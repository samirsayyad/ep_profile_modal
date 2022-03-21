'use strict';

(() => {
  const __LOGOUT = '1';
  const postAceInit = (hook, context) => {
    usersProfileSection.initiateListeners();
    $('#ep_profile_modal_save').on('click', () => {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      const username = $('#ep_profile_modal-username');
      // validations
      if (username.val() === '') {
        username.css({border: '1px solid red'});
        return false;
      }
      username.css({border: '0'});
      // validations

      const $form = $('#ep_profile_modal_one');
      const data = shared.getFormData($form);

      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_info',
        userId,
        data,
        padId,
      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      pad.collabClient.updateUserInfo({
        userId: padId,
        name: username.val(),
        colorId: '#b4b39a',
      });

      if (window.userStatus === 'login') {
        if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
          $('#ep_profile_modal').removeClass('ep_profile_modal-show');
          shared.hideGeneralOverlay();
        } else {
          $('#ep_profile_modal').addClass('ep_profile_modal-show');

          $('#online_ep_profile_modal_status').show();
          $('#offline_ep_profile_modal_status').hide();

          shared.showGeneralOverlay();
        }
      }
    });

    $('#userlist_count').on('click', () => {
      const page = $('#ep_profile_modal_user_list').attr('data-page') || 1;
      const pageLoaded = $('#ep_profile_modal_user_list').attr('data-pageLoaded') || false;
      const onlineListSelector = $('#ep_profile_user_list_container');

      if (pageLoaded !== 'true') {
        $.ajax({
          url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${page}/`,
          type: 'get',
          data: {},
          contentType: false,
          processData: false,
          beforeSend: () => {
            // setting a timeout
            // $('#contributorsLoading').show();
            $('#ep_profile_user_list_container').css({display: 'none'});
            $('#ep_profile_modal_load_more_contributors').css({display: 'none'});
            onlineListSelector.css({display: 'none'});
          },
          error: (xhr) => { // if error occured
            $('#contributorsLoading').css({display: 'none'});
            onlineListSelector.css({display: 'block'});
          },
          success: (response) => {
            onlineListSelector.css({display: 'block'});
            $('#contributorsLoading').css({display: 'none'});
            $('#ep_profile_user_list_container').css({display: 'block'});
            $('#ep_profile_modal_user_list').attr('data-pageLoaded', 'true');
            const onlineUsers = pad.collabClient.getConnectedUsers();
            contributors.manageOnlineOfflineUsers(
                response.data, onlineUsers, pad.getUserId(), response.lastPage);
          },

        });
      }
    });

    $('#ep_profile_modal_load_more_contributors').on('click', () => {
      let page = $('#ep_profile_modal_user_list').attr('data-page') || 1;
      page++;
      $.ajax({
        url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${page}/`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend: () => {
          // setting a timeout
          $('#loadMoreLoading').show();
          $('#ep_profile_modal_load_more_contributors').css({display: 'none'});
        },
        error: (xhr) => { // if error occured
          $('#loadMoreLoading').hide();
          $('#ep_profile_modal_load_more_contributors').css({display: 'block'});
        },
        success: (response) => {
          $('#ep_profile_modal_load_more_contributors').css({display: 'block'});
          $('#loadMoreLoading').hide();
          $('#ep_profile_modal_user_list').attr('data-page', page);
          const onlineUsers = pad.collabClient.getConnectedUsers();
          contributors.manageOnlineOfflineUsers(
              response.data, onlineUsers, pad.getUserId(), response.lastPage);
        },

      });
    });

    $('#userlist_count,#ep_profile_modal_user_list_close').on('click', () => {
      if ($('#ep_profile_modal_user_list').hasClass('ep_profile_modal-show')) {
        $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show');
        shared.hideGeneralOverlay();
      } else {
        shared.showGeneralOverlay();
        $('#ep_profile_modal_user_list').addClass('ep_profile_modal-show');
      }
    });

    $('#ep_profile_modal_verification').on('click', function () {
      const verificationStatus = $(this).attr('data-verification-status');
      const oldText = $(this).text();
      if (verificationStatus !== 'true') {
        $.ajax({
          url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${
            pad.getUserId()}/null/null`,
          type: 'get',
          data: {},
          contentType: false,
          processData: false,
          beforeSend: () => {
            // setting a timeout
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
      }
      return false;
    });
    $('#ep_profile_modal_share').on('click', () => {
      const dummy = document.createElement('input');
      const text = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      $.gritter.add({
        text: 'Link copied to clipboard',
      });
    });

    $('#ep-profile-button').on('click', () => {
      if (window.user_status === 'login') {
        if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
          $('#ep_profile_modal').removeClass('ep_profile_modal-show');
        } else {
          $('#ep_profile_modal').addClass('ep_profile_modal-show');
          $('#online_ep_profile_modal_status').show();
          $('#offline_ep_profile_modal_status').hide();
          shared.showGeneralOverlay();
        }
      } else {
        profileForm.resetModal();
        profileForm.showModal();
      }
    });

    $('#ep_profile_modal_close').on('click', () => {
      if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
        $('#ep_profile_modal').removeClass('ep_profile_modal-show');
        shared.hideGeneralOverlay();
      } else {
        shared.showGeneralOverlay();
        $('#ep_profile_modal').addClass('ep_profile_modal-show');
      }
    });
    $('#ep_profile_modal_close_ask').on('click', () => {
      ($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))
        ? $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
        : $('#ep_profile_modal_ask').addClass('ep_profile_modal-show');
    });


    $('#ep_profile_modal_signout').on('click', () => {
      profileForm.resetModal();

      const userId = pad.getUserId();
      const padId = pad.getPadId();
      localStorage.setItem('formStatus', '');
      clientVars.ep_profile_modal.userStatus = __LOGOUT;

      window.userStatus = 'out';
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_logout',
        email: $('#ep_profile_hidden_email').val(),
        userId,
        padId,

      };
      clientVars.ep_profile_modal.userStatus = __LOGOUT;
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      $('#ep_profile_modal').removeClass('ep_profile_modal-show');
      $('#online_ep_profile_modal_status').hide();
      $('#offline_ep_profile_modal_status').show();
      syncData.resetProfileModalFields();
      shared.hideGeneralOverlay();
      $(`.avatar[data-id="user_${userId}"]`).attr({style: ''});
      helper.userLogout();
    });


    // upload image profile
    $('#profile_file').on('change', (e) => {
      const userId = pad.getUserId();
      const fd = new FormData();
      const files = $('#profile_file')[0].files[0];
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
        },
        success: (response) => {
          helper.refreshUserImage(userId, clientVars.padId);
        },

      });
    });

    $('#ep_profile_modal_submit').on('click', () => {
      const username = $('#ep_profile_modal_username').val();
      const email = $('#ep_profile_modal_email').val();

      shared.loginByEmailAndUsername(username, email);
    });

    $('#ep_profile_modal_login').on('click', () => {
      const username = $('#ep_profile_modal-username').val();
      const email = $('#ep_profile_modal-email').val();

      shared.loginByEmailAndUsername(username, email);
      $('#ep_profile_modal').removeClass('ep_profile_modal-show');
    });

    $('#ep_profile_general_overlay').on('click', () => {
      shared.hideGeneralOverlay();
    });

    return [];
  };
  return postAceInit;
})();
