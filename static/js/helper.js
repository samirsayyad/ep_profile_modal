'use strict';
const __LOGIN = '2';
const __LOGOUT = '1';

(() => {
  const userLogin = (data) => {
    window.userStatus = 'login';
    clientVars.ep_profile_modal.userStatus = __LOGIN;

    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: data.username,
      colorId: '#b4b39a',
    });
  };
  const userLogout = () => {
    window.userStatus = 'logout';
    clientVars.ep_profile_modal.userStatus = __LOGOUT;


    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: 'Anonymous',
      colorId: '#b4b39a',
    });
  };
  const logoutCssFix = (userId) => {
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({'margin': '0px', 'box-shadow': 'none'});
    }
  };
  const refreshUserImage = (userId, padId) => {
    const imageUrl = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${imageUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      userSelector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }

    const rocketChatOnlineUser = $(
        `.avatar[data-id="${userId}"]`
    );
    if (rocketChatOnlineUser.length) {
      rocketChatOnlineUser
          .children('.ep_rocketchat_onlineUsersList_avatarImg')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '28px',
          });
    }
  };

  const refreshLoadingImage = (userId, padId) => {
    const imageUrl =
    '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${imageUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      userSelector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  const refreshGeneralImage = (userId, padId) => {
    const imageUrl = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${imageUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      userSelector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  return {
    userLogin,
    userLogout,
    logoutCssFix,
    refreshUserImage,
    refreshLoadingImage,
    refreshGeneralImage,
  };
})();
