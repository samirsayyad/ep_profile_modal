'use strict';

// var shared = require('../shared');

(() => {
  const initiate = (clientVars) => {
    const modal = $('#ep_profile_users_profile_script').tmpl(clientVars);
    $('body').append(modal);
    // $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')
  };

  const initiateListeners = () => {
    const avatarListerner = (userId) => {
      const padId = pad.getPadId();
      $.ajax({
        url: `/static/${padId}/pluginfw/ep_profile_modal/getUserInfo/${userId}`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend: () => {
          const imageUrl = '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
          $('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
            'background-image':
            `url(${imageUrl})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
          // $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
          $('#ep_profile_user_img').css({'background-position': '50% 50%',
            'background-image':
            `url(${imageUrl})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
          $('#ep_profile_users_profile_name').text('');
          $('#ep_profile_users_profile_desc').text('');

          $('#ep_profile_users_profile').addClass('ep_profile_formModal_show');
          shared.showGeneralOverlay();
        },
        error: (xhr) => { // if error occured
          $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
          shared.hideGeneralOverlay();
        },
        success: (response) => {
          const imageUrl = `/static/getUserProfileImage/${userId}/${padId}?t=${
            new Date().getTime()}`;
          let username = response.user.username;
          if (username == null || username === '') { username = 'Anonymous'; }
          const about = response.user.about || '';
          const homepage = response.user.homepage || '';

          $('#ep_profile_users_profile_name').text(username);
          $('#ep_profile_users_profile_desc').text(about);
          if (homepage === '') {
            $('#ep_profile_users_profile_homepage').hide();
          } else {
            $('#ep_profile_users_profile_homepage').attr({href:
              shared.getValidUrl(homepage), target: '_blank'});
          }

          $('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
            'background-image':
            `url(${imageUrl})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
          $('#ep_profile_user_img').css({'background-position': '50% 50%',
            'background-image':
             `url(${imageUrl})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
        },
      });
    };


    $('#usersIconList').on('avatarClick', (e, userIdParam) => { // coming from external plugins
      if (!userIdParam || (userIdParam.indexOf('a.') < 0)) return;
      avatarListerner(userIdParam);
    });

    $('#usersIconList').on('click', '.avatar', function () {
      const userId = $(this).attr('data-userId');
      avatarListerner(userId);
    });


    $('#ep_profile_users_profile_close').on('click', () => {
      $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
      shared.hideGeneralOverlay();
    });
  };

  return {
    initiate,
    initiateListeners,
  };
})();
