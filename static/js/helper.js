const helper = (() => {
  const userLogin = function (data) {
    window.user_status = 'login';
    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: data.username,
      colorId: '#b4b39a',
    });
  };
  const userLogout = function () {
    window.user_status = 'logout';
    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: 'Anonymous',
      colorId: '#b4b39a',
    });
  };
  const logoutCssFix = function (userId) {
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({'margin': '0px', 'box-shadow': 'none'});
    }
  };
  const refreshUserImage = function (userId, padId) {
    const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  const refreshLoadingImage = function (userId, padId) {
    const image_url =
			'../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  const refreshGeneralImage = function (userId, padId) {
    const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
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
