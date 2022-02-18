'use strict';

// var shared = require('../shared');
// var helper = require('../helper');

const profileForm = (() => {
  let animating = false;

  const showModal = () => {
    $('#ep_profile_formModal').addClass('ep_profile_formModal_show');
    $('#ep_profile_formModal_overlay').addClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'block'});

    setTimeout(() => { $('#ep_profile_modalForm_name').focus(); }, 1000);
  };

  const sendEmailVerification = (email, username) => {
    const oldText = $('#ep_profile_modal_verification').text();
    $.ajax({
      url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/${username}/${email}`,
      type: 'get',
      data: {},
      contentType: false,
      processData: false,
      beforeSend: () => {
        $('#ep_profile_modal_verification').text('Sending...');
      },
      error: (xhr) => { // if error occured
        $('#ep_profile_modal_verification').text('Error');
        setTimeout(() => {
          $('#ep_profile_modal_verification').text(oldText);
        }, 2000);
      },
      success: (response) => {
        $('#ep_profile_modal_verification').text('Verification email has been sent.');
        $('#ep_profile_modal_verification').attr('data-verification-status', 'true');
      },

    });
  };

  const allEventListener = () => {
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody');

    innerdocbody.on('keypress', (e) => {
      showModal();
    });
    innerdocbody.on('mousedown', (event) => {
      if (event.which === 1) {
        showModal();
      }
    });
  };

  const removeEventListener = () => {
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody');
    innerdocbody.off('keypress');
    innerdocbody.off('mousedown');
  };

  const handleOnCloseOverlay = () => {
    const userId = pad.getUserId();
    const padId = pad.getPadId();
    const $form = $('#ep_profile_formModal_msform');
    const data = getFormData($form);
    const msg = {};
    localStorage.setItem('formPassed', 'yes');
    removeEventListener();
    if (data.ep_profile_modalForm_name === '' || ['', null, undefined].includes(localStorage.getItem('formStatus'))) { return false; }

    let text = `Please welcome ${data.ep_profile_modalForm_name}`;
    if (data.ep_profile_modalForm_about_yourself !== '') { text += `, ${data.ep_profile_modalForm_about_yourself}`; }
    if (data.ep_profile_modalForm_homepage !== '') {
      const url = shared.getValidUrl(data.ep_profile_modalForm_homepage);
      text += `, ${url}`;
    }

    msg.messageChatText = `${text}`;
    msg.target = 'profile';
    msg.userId = userId;
    msg.time = new Date();

    const message = {
      type: 'ep_rocketchat',
      action: 'ep_rocketchat_sendMessageToChat_login',
      userId,
      data: msg,
      padId,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };

  const hideFormModalOverlay = () => {
    $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'none'});

    handleOnCloseOverlay();
  };

  const resetModal = () => {
    const fieldsets = $('#ep_profile_formModal_msform fieldset');
    fieldsets.each(function (index) {
      if (index === 0) $(this).show(); else $(this).hide();
    });
  };

  const getFormData = ($form) => {
    const unindexedArray = $form.serializeArray();
    const indexedArray = {};

    $.map(unindexedArray, (n, i) => {
      indexedArray[n.name] = n.value;
    });

    return indexedArray;
  };

  const sendFormDataToServer = () => {
    const userId = pad.getUserId();
    const padId = pad.getPadId();
    const $form = $('#ep_profile_formModal_msform');
    const data = getFormData($form);
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_info',
      userId,
      data,
      padId,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };

  const nextHandler = (currentFs, nextFs) => {
    if (animating) return false;
    const currentSection = currentFs.attr('data-section');
    localStorage.setItem('formStatus', currentSection);
    if (currentSection === 'name') {
      if ($('#ep_profile_modalForm_name').val() === '') {
        $('#ep_profile_modalForm_name').css({border: '1px solid red'});
        return false;
      }
      const username = $('#ep_profile_modalForm_name').val();
      $('#ep_profile_modalForm_name').css({border: '0px solid gray'});
      // submit username once user input and press next
      helper.userLogin({
        username,
      });
      shared.loginByEmailAndUsernameWithoutValidation(username, '', false);
    }
    if (currentSection === 'email') {
      const userEmail = $('#ep_profile_modalForm_email').val();
      if (!shared.isEmail(userEmail) || userEmail === '') {
        $('#ep_profile_modalForm_email').css({border: '1px solid red'});
        return false;
      }
      const username = $('#ep_profile_modalForm_name').val();
      shared.loginByEmailAndUsernameWithoutValidation(username, userEmail, true);
      sendEmailVerification(userEmail, username);
      $('#ep_profile_modalForm_email').css({border: '0px solid gray'});
    }

    if (currentSection === 'homepage') {
      const userLink = $('#ep_profile_modal_homepage').val();
      if (!shared.IsValid(userLink) || userLink === '') {
        $('#ep_profile_modal_homepage').css({border: '1px solid red'});
        return false;
      }
      $('#ep_profile_modal_homepage').css({border: '0px solid gray'});
      sendFormDataToServer();
    }

    animating = true;
    currentFs.hide();
    if (nextFs.length) {
      nextFs.show();

      // focus handling
      const nextSelection = nextFs.attr('data-section');
      if (nextSelection === 'email') { $('#ep_profile_modalForm_email').focus().select(); }
      if (nextSelection === 'homepage') { $('#ep_profile_modal_homepage').focus().select(); }
      if (nextSelection === 'bio') { $('#ep_profile_modalForm_about_yourself').focus().select(); }
    } else { // seems last fieldset
      submitHandle();
    }
    animating = false;
  };

  const initModal = (clientVars) => {
    const modal = $('#ep_profile_formModal_script').tmpl(clientVars);
    $('body').append(modal);

    // jQuery time
    let currentFs, nextFs, previousFs; // fieldsets
    let animating; // flag to prevent quick multi-click glitches

    $('#ep_profile_formModal_msform fieldset').on('keypress', function (e) {
      if (e.keyCode === 13) {
        // Cancel the default action on keypress event
        e.preventDefault();
        currentFs = $(this);
        nextFs = $(this).next();
        nextHandler(currentFs, nextFs);
      }
    });

    $('.next').click(function () {
      currentFs = $(this).parent();
      nextFs = $(this).parent().next();
      nextHandler(currentFs, nextFs);
    });

    $('.skip').click(function () {
      if (animating) return false;
      $('#ep_profile_modalForm_name').css({border: '1px solid gray'});

      animating = true;

      currentFs = $(this).parent();
      nextFs = $(this).parent().next();

      // show the next fieldset
      currentFs.hide();
      nextFs.show();
      animating = false;
    });


    $('.close , #ep_profile_formModal_overlay , .ep_profile_formModal_topClose').click(() => {
      $('#ep_profile_formModal').removeClass('ep_profile_formModal_show');

      hideFormModalOverlay();

      return false;
    });

    $('.previous').click(function () {
      if (animating) return false;
      animating = true;

      currentFs = $(this).parent();
      previousFs = $(this).parent().prev();

      currentFs.hide();
      previousFs.show();
      animating = false;
    });

    $('.submit').click(() => {
      submitHandle();
      return false;
    });

    $('.clear').click(function () {
      shared.resetAllProfileImage($(this).attr('data-userId'), $(this).attr('data-padId'));
    });

    const uploadImg = () => {
      const userId = pad.getUserId();
      const fd = new FormData();
      const files = $('#profile_file_modal')[0].files[0];
      fd.append('file', files);
      if (!files) return;
      $.ajax({
        url: `/static/${clientVars.padId}/pluginfw/ep_profile_modal/upload/${userId}`,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        beforeSend: () => {
          // setting a timeout
          helper.refreshLoadingImage(userId, clientVars.padId);
        },
        error: (xhr) => { // if error occured
          helper.refreshUserImage(userId, clientVars.padId);
          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));

          if (xhr.status === 413) {
            $.gritter.add({
              title: 'Error',
              text: 'ep_profile_modal: image size is large.',
              sticky: true,
              class_name: 'error',
            });
          }
        },
        success: (response) => {
          helper.refreshUserImage(userId, clientVars.padId);
          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));
        },

      });
    };

    const submitHandle = () => {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      $('#ep_profile_formModal').removeClass('ep_profile_formModal_show');

      uploadImg();
      hideFormModalOverlay();
      sendFormDataToServer();

      const username = $('#ep_profile_modalForm_name').val();

      helper.userLogin({
        email: $('#ep_profile_modalForm_email').val(),
        username,
      });
      setTimeout(() => {
        helper.refreshUserImage(userId, padId);
      }, 2200);
    };

    // upload image profile
    $('#profile_file_modal').on('change', (e) => {
      const files = $('#profile_file_modal')[0].files[0];

      const url = URL.createObjectURL(files);
      $('#profile_modal_selected_image').css({'background-position': '50% 50%',
        'background-image': `url(${url})`, 'background-repeat': 'no-repeat', 'background-size': '64px'});
    });
  };

  return {
    showModal,
    hideFormModalOverlay,
    handleOnCloseOverlay,
    resetModal,
    getFormData,
    initModal,
    allEventListener,
  };
})();
