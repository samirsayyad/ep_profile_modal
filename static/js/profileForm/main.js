// var shared = require('../shared');
// var helper = require('../helper');

const profileForm = (() => {
  const allEventListener= function(){
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody');

    innerdocbody.on("keypress",function(e) {
      showModal()
    });
    innerdocbody.on("mousedown",function(event) {
      if(event.which == 1){
        showModal()
      }
    
      
      
  });
  }




  const removeEventListener =function(){
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody')
    innerdocbody.off("keypress");
    innerdocbody.off("mousedown");

  }
  const showModal = function () {
    $('#ep_profile_formModal').addClass('ep_profile_formModal_show');
    $('#ep_profile_formModal_overlay').addClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'block'});

    setTimeout(() => { $('#ep_profile_modalForm_name').focus(); }, 1000);
  };
  const hideFormModalOverlay = function () {
    $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'none'});

    handleOnCloseOverlay();
  };
  const handleOnCloseOverlay = function () {
    const userId = pad.getUserId();
    const padId = pad.getPadId();
    const $form = $('#ep_profile_formModal_msform');
    const data = getFormData($form);
    const msg = {};
    localStorage.setItem("formPassed","yes")
    removeEventListener()
    console.log(localStorage.getItem("formStatus"),'ssssss')
    if (data.ep_profile_modalForm_name == '' || ['',null,undefined].includes(localStorage.getItem("formStatus"))) { return false; }
    // var message = {
    //     type : 'ep_profile_modal',
    //     action : "ep_profile_modal_send_chat_message" ,
    //     userId :  userId,
    //     data: data,
    //     padId : padId
    //     }
    // pad.collabClient.sendMessage(message);  // Send the chat position message to the server
    let text = `Please welcome ${data.ep_profile_modalForm_name}`;
    if (data.ep_profile_modalForm_about_yourself !== '') { text += `, ${data.ep_profile_modalForm_about_yourself}`; }
    if (data.ep_profile_modalForm_homepage !== '') {
      const url = shared.getValidUrl(data.ep_profile_modalForm_homepage);
      text += `, ${url}`;
      // text += `, ${message.data.ep_profile_modalForm_homepage} `
    }

    msg.messageChatText = `${text}`;
    msg.target = 'profile';
    msg.userId = userId;
    msg.time = new Date();

    // shared.addTextChatMessage(msg);
    const message = {
      type: 'ep_rocketchat',
      action: 'ep_rocketchat_sendMessageToChat_login',
      userId,
      data: msg,
      padId,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const resetModal = function () {
    const fieldsets = $('#ep_profile_formModal_msform fieldset');
    fieldsets.each(function (index) {
      if (index == 0) $(this).show(); else $(this).hide();
    });
  };
  const getFormData = function ($form) {
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};

    $.map(unindexed_array, (n, i) => {
      indexed_array[n.name] = n.value;
    });

    return indexed_array;
  };
  const initModal = function (clientVars) {
    const modal = $('#ep_profile_formModal_script').tmpl(clientVars);
    $('body').append(modal);

    // jQuery time
    let current_fs, next_fs, previous_fs; // fieldsets
    let left, opacity, scale; // fieldset properties which we will animate
    let animating; // flag to prevent quick multi-click glitches

    $('#ep_profile_formModal_msform fieldset').on('keypress', function (e) {
      if (e.keyCode == 13) {
        // Cancel the default action on keypress event
        e.preventDefault();
        current_fs = $(this);
        next_fs = $(this).next();
        nextHandler(current_fs, next_fs);
      }
    });
    $('.next').click(function () {
      current_fs = $(this).parent();
      next_fs = $(this).parent().next();
      nextHandler(current_fs, next_fs);
    });

    $('.skip').click(function () {
      if (animating) return false;
      $('#ep_profile_modalForm_name').css({border: '1px solid gray'});

      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      // activate next step on progressbar using the index of next_fs
      // $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      // show the next fieldset
      current_fs.hide();
      next_fs.show();
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

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      // de-activate current step on progressbar
      // $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
      current_fs.hide();
      previous_fs.show();
      animating = false;
    });

    $('.submit').click(() => {
      submitHandle();
      return false;
    });
    $('.clear').click(function () {
      shared.resetAllProfileImage($(this).attr('data-userId'), $(this).attr('data-padId'));
    });

    function sendFormDataToServer() {
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
    }
    function submitHandle() {
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
      // sync profile section to up
    }


    function nextHandler(current_fs, next_fs) {
      if (animating) return false;

      const currentSection = current_fs.attr('data-section');
      localStorage.setItem("formStatus",currentSection)
      if (currentSection == 'name') {
        if ($('#ep_profile_modalForm_name').val() == '') {
          $('#ep_profile_modalForm_name').css({border: '1px solid red'});
          return false;
        }
        var username = $('#ep_profile_modalForm_name').val();
        $('#ep_profile_modalForm_name').css({border: '0px solid gray'});
        // submit username once user input and press next
        helper.userLogin({
          username,
        });
        shared.loginByEmailAndUsernameWithoutValidation(username, '', false);
      }
      if (currentSection == 'email') {
        const userEmail = $('#ep_profile_modalForm_email').val();
        if (!shared.isEmail(userEmail) || userEmail == '') {
          $('#ep_profile_modalForm_email').css({border: '1px solid red'});
          return false;
        }
        var username = $('#ep_profile_modalForm_name').val();
        shared.loginByEmailAndUsernameWithoutValidation(username, userEmail, true);
        sendEmailVerification(userEmail, username);
        $('#ep_profile_modalForm_email').css({border: '0px solid gray'});
      }

      if (currentSection == 'homepage') {
        const userLink = $('#ep_profile_modal_homepage').val();
        //console.log(shared.IsValid(userLink));
        if (!shared.IsValid(userLink) || userLink == '') {
          $('#ep_profile_modal_homepage').css({border: '1px solid red'});
          return false;
        }
        $('#ep_profile_modal_homepage').css({border: '0px solid gray'});
        sendFormDataToServer();
      }

      // if (currentSection == 'image') {
      //   uploadImg();
      // }


      animating = true;
      current_fs.hide();
      if (next_fs.length) {
        next_fs.show();

        // focus handling
        const nextSelection = next_fs.attr('data-section');
        if (nextSelection == 'email') { $('#ep_profile_modalForm_email').focus().select(); }
        if (nextSelection == 'homepage') { $('#ep_profile_modal_homepage').focus().select(); }
        if (nextSelection == 'bio') { $('#ep_profile_modalForm_about_yourself').focus().select(); }
      } else { // seems last fieldset
        submitHandle();
      }
      animating = false;
    }


    function sendEmailVerification(email, username) {
      var oldText = $("#ep_profile_modal_verification").text()
      $.ajax({
        url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/${username}/${email}`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend() {
          // setting a timeout
          const image_url = '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';

          $('#ep_profile_modal_verification').text('Sending...');
        },
        error(xhr) { // if error occured
          $('#ep_profile_modal_verification').text('Error');
          setTimeout(() => {
            $('#ep_profile_modal_verification').text(oldText);
          }, 2000);
        },
        success(response) {
          $('#ep_profile_modal_verification').text('Verification email has been sent.');
          $('#ep_profile_modal_verification').attr('data-verification-status', 'true');
        },

      });
    }


    function uploadImg() {
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
        beforeSend() {
          // setting a timeout

          helper.refreshLoadingImage(userId, clientVars.padId);
        },
        error(xhr) { // if error occured
          helper.refreshUserImage(userId, clientVars.padId);
          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));

          switch (xhr.status) {
            case 413:
              $.gritter.add({
                'title': 'Error',
                'text': 'ep_profile_modal: image size is large.',
                'sticky': true,
                'class_name': 'error'
              });
                 // Take action, referencing xhr.responseText as needed.
          }
        },
        success(response) {
          helper.refreshUserImage(userId, clientVars.padId);

          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));
        },

      });
    }


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
