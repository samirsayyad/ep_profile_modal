import * as shared from '../shared';

const defaultImg =
  '../static/plugins/ep_profile_modal/static/dist/img/user.png';


export const createHTMLforUserList = (total, online, padId, userVerify) => {
  // generate avatar too
  let html = "<div id='usersIconList' class='ep_profile_inlineAvatars'>";
  let style;
  let borderStyle = '';
  $.each(online.reverse(), (key, value) => {
    style = `background: url(/static/getUserProfileImage/${value.userId
    }/${padId}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;`;
    if (userVerify) {
      borderStyle =
        'box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;';
    } else {
      borderStyle = '';
    }

    style += borderStyle;
    html += `<div class='avatar' data-userId="${value.userId}" data-id="user_${value.userId
    }"  id="user_${value.userId}" ><div data-userId="${value.userId
    }"  class='avatarImg' style='${style}' data-id="user_${value.userId}"></div></div>`;
  });
  html += ' </div>';
  return `${html}<span class='slash_profile'>⧸</span><span
    id='userlist_count' class='userlist_count'>${total}</span> <input  value='Share'
      id='ep_profile_modal_share' type='button' class='ep_profile_modal_share'>`;
};

export const increaseUserFromList = (userId, padId) => {
  const style = `background: url(/static/getUserProfileImage/${userId}/${padId
  }) no-repeat 50% 50% ; background-size : 26px;background-color: #fff;`;

  if (!$(`.avatar[data-id="user_${userId}"]`).length) {
    const $image = $(
        `<div class='avatar' data-userId="${userId}"  data-id="user_${userId}" id="user_${userId
        }" ><div class='avatarImg' data-userId="${userId}"  data-id="user_${userId
        }" style='${style}'></div></div>`
    );
    $image.prependTo('#usersIconList');
    $image.hide().slideDown(200);
  }
};

// TODO: rewrite and use template
const getHtmlOfUsersList = (
  userId,
  username,
  img,
  anonymousHandler,
  about,
  homepage,
  seenStatus
) => {
  about = about || '';
  homepage = homepage || '';
  let style;
  if (anonymousHandler && username === 'Anonymous') {
    style = `background: url(${img}) no-repeat 50% 50% ; background-size : 69px ;`;

    return (
      `<div data-user-ids='${userId}' data-anonymouseCount='1' data-id='user_list_${anonymousHandler}' class='ep_profile_user_row'>` +
      `<div style='${style}' class='ep_profile_user_img' id='ep_profile_user_img'></div>` +
      "<div class='ep_profile_user_list_profile_userDesc'>" +
      `<div class='ep_profile_user_list_username'>
        <div class='ep_profile_user_list_username_text' id='ep_profile_users_profile_name'>
        ${username}
        </div>` +
      `<div class='ep_profile_contributor_status'>${seenStatus}</div>` +
      '</div>' +
      `<p class='ep_profile_user_list_profile_desc' id='ep_profile_users_profile_desc'>
${about}</p>` +
      '</div> </div>'
    );
  } else {
    style = `background: url(${img}) no-repeat 50% 50% ; background-size : 69px ;`;
    return (
      `<div data-id='user_list_${userId}' class='ep_profile_user_row'>` +
      `<div style='${style}' class='ep_profile_user_img'  id='ep_profile_user_img'></div>` +
      "<div class='ep_profile_user_list_profile_userDesc'>" +
      `<div class='ep_profile_user_list_username'>
<div class='ep_profile_user_list_username_text' id='ep_profile_users_profile_name'>
${username}</div>` +
      `<a target='_blank' style='
${homepage === '' ||
        homepage === '#' ||
        homepage === undefined ||
        homepage == null
        ? 'display : none'
        : ''
      }'  class='ep_profile_contributor_link_container' title='
        ${shared.getValidUrl(homepage)}' href='${shared.getValidUrl(
          homepage
      )}'> </a>` +
      `<div class='ep_profile_contributor_status'>${seenStatus}</div>` +
      '</div>' +
      `<p class='ep_profile_user_list_profile_desc' id='ep_profile_users_profile_desc'>
        ${about}
      </p>` +
      '</div> </div>'
    );
  }
};

export const increaseToOnlineAnonymous = (selectorOn, userId) => {
  const anonymouseCount = selectorOn.attr('data-anonymouseCount');
  const idsData = selectorOn.attr('data-user-ids');
  const idsDataArray = idsData.split(',');
  if (idsDataArray.indexOf(userId) === -1) {
    idsDataArray.push(userId);
    selectorOn.attr('data-user-ids', idsDataArray.join(','));
    const newAnonymouseCount = parseInt(anonymouseCount) + 1;
    selectorOn.attr('data-anonymouseCount', newAnonymouseCount);
    selectorOn
        .children('.ep_profile_user_list_profile_userDesc')
        .children('.ep_profile_user_list_username')
        .children('.ep_profile_user_list_username_text')
        .text(`Anonymous ×${newAnonymouseCount}`);
  }
};

export const manageOnlineOfflineUsers = (
  allUsersList,
  onlineUsers,
  currentUserId,
  lastPage
) => {
  const onlineListSelector = $('#ep_profile_user_list_container');
  const offlineListSelector = $('#ep_profile_user_list_container_off');
  if (lastPage) {
    $('#ep_profile_modal_load_more_contributors').css({display: 'none'});
  } else {
    $('#ep_profile_modal_load_more_contributors').css({display: 'block'});
  }
  // offline_list_selector.empty();
  $.each(allUsersList, (key, value) => {
    // if (value.userId != currentUserId){
    const result = $.grep(onlineUsers, (e) => e.userId === value.userId);
    if (result.length) {
      // online
      if (value.userName === 'Anonymous') {
        const selectorOn = $(
            '.ep_profile_user_row[data-id="user_list_on_Anonymous"]'
        );

        if (selectorOn.length) {
          increaseToOnlineAnonymous(selectorOn, value.userId);
        } else {
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              value.userName,
              value.imageUrl,
              'on_Anonymous',
              value.about,
              value.homepage,
              'Online'
          );
          onlineListSelector.append(userListHtml);
        }
        if (currentUserId === value.userId) {
          $(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({
            'margin-top': '28px',
          });
        }
      } else {
        if (
          !$(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`)
              .length
        ) {
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              value.userName,
              value.imageUrl,
              false,
              value.about,
              value.homepage,
              'Online'
          );
          try {
            onlineListSelector.append(userListHtml);
          } catch (error) {
            console.log(error);
          }
        } else if (currentUserId === value.userId) {
          $(
              `.ep_profile_user_row[data-id="user_list_${value.userId}"]`
          ).prependTo(onlineListSelector);
        } else {
          $(
              `.ep_profile_user_row[data-id="user_list_${value.userId}"]`
          ).appendTo(onlineListSelector);
        }
        if (currentUserId === value.userId) {
          $(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).css({
            'margin-top': '28px',
          });
        }
      }
    }
    // offline
    if (value.lastSeenDate !== '') {
      if (value.userName !== 'Anonymous') {
        if (
          !$(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`)
              .length
        ) {
          console.log('value', value);
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              value.userName,
              value.imageUrl,
              false,
              value.about,
              value.homepage,
              shared.getCustomDate(value.lastSeenDate)
          );
          const offlinesDateSelector = $('#ep_profile_user_list_offline');
          if (offlinesDateSelector.length) {
            offlinesDateSelector.append(userListHtml);
          } else {
            $('#ep_profile_user_list_container_off').append(
                `<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>
                ${userListHtml}</div>`
            );
          }
        } else {
          $(
              `.ep_profile_user_row[data-id="user_list_${value.userId}"]`
          ).appendTo(offlineListSelector);
        }
      }
    }

    // }
  });

  // just for anonymouse to be end of list
  $.each(allUsersList, (key, value) => {
    // if (value.userId != currentUserId){
    const result = $.grep(onlineUsers, (e) => e.userId === value.userId);
    if (!result.length) {
      // offline
      if (value.userName === 'Anonymous') {
        const selectorOff = $(
            '.ep_profile_user_row[data-id="user_list_off_Anonymous"]'
        );
        if (selectorOff.length) {
          const anonymouseCount = selectorOff.attr('data-anonymouseCount');
          const newAnonymouseCount = parseInt(anonymouseCount) + 1;

          const idsDataOff = selectorOff.attr('data-user-ids');
          const idsDataOffArray = idsDataOff.split(',');
          idsDataOffArray.push(value.userId);
          selectorOff.attr('data-user-ids', idsDataOffArray.join(','));

          selectorOff.attr('data-anonymouseCount', newAnonymouseCount);
          selectorOff
              .children('.ep_profile_user_list_profile_userDesc')
              .children('.ep_profile_user_list_username')
              .text(`Anonymous ×${newAnonymouseCount}`);
        } else {
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              'Anonymous',
              value.imageUrl,
              'off_Anonymous',
              value.about,
              value.homepage,
              shared.getCustomDate(value.lastSeenDate)
          );
          const selectorOfflinesDate = $('#ep_profile_user_list_offline');
          if (selectorOfflinesDate.length) {
            selectorOfflinesDate.append(userListHtml);
          } else {
            $('#ep_profile_user_list_container_off').append(
                `<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>
                ${userListHtml}</div>`
            );
          }
        }
      }
    }
  });
};

export const decreaseFromOnlineAnonymous = (selectorOn, userId) => {
  const anonymouseCount = selectorOn.attr('data-anonymouseCount');
  const idsData = selectorOn.attr('data-user-ids');
  let idsDataArray = idsData.split(',');

  idsDataArray = $.grep(idsDataArray, (value) => value !== userId);

  selectorOn.attr('data-user-ids', idsDataArray.join(','));
  const newAnonymouseCount = parseInt(anonymouseCount) - 1;
  selectorOn.attr('data-anonymouseCount', newAnonymouseCount);
  if (newAnonymouseCount > 1) {
    selectorOn
        .children('.ep_profile_user_list_profile_userDesc')
        .children('.ep_profile_user_list_username')
        .children('.ep_profile_user_list_username_text')
        .text(`Anonymous ×${newAnonymouseCount}`);
  } else {
    selectorOn
        .children('.ep_profile_user_list_profile_userDesc')
        .children('.ep_profile_user_list_username')
        .children('.ep_profile_user_list_username_text')
        .text('Anonymous');
  }

  if (newAnonymouseCount < 1) {
    selectorOn.remove();
  }
  return newAnonymouseCount;
};

export const increaseToOfflineAnonymous = (selectorOff, userId) => {
  const anonymouseCount = selectorOff.attr('data-anonymouseCount');
  let idsData = selectorOff.attr('data-user-ids');

  idsData = $.grep(idsData, (value) => value !== userId);

  selectorOff.attr('data-user-ids', idsData);
  const newAnonymouseCount = parseInt(anonymouseCount) + 1;
  selectorOff.attr('data-anonymouseCount', newAnonymouseCount);
  selectorOff
      .children('.ep_profile_user_list_profile_userDesc')
      .children('.ep_profile_user_list_username')
      .children('.ep_profile_user_list_username_text')
      .text(`Anonymous ×${newAnonymouseCount}`);
};

export const createOfflineAnonymousElement = (
  userId,
  img,
  about,
  homepage,
  userElement
) => {
  const userListHtml = getHtmlOfUsersList(
      userId,
      'Anonymous',
      img,
      'off_Anonymous',
      about,
      homepage,
      'Today'
  );
  const offlineListSelector = $('#ep_profile_user_list_offline');
  if (offlineListSelector.length) {
    // because need anonymous offline be last one
    const userSelector = $(
        ".ep_profile_user_row[data-id='user_list_off_Anonymous']"
    );
    if (userSelector.length) {
      userElement.insertBefore(userSelector);
    } else {
      offlineListSelector.append(userElement);
    }
  } else {
    const offlineContainer = $('#ep_profile_user_list_container_off');
    offlineContainer.prepend(
        "<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"
    );
    offlineListSelector.append(userListHtml);
  }
};

export const createOnlineUserElementInUserList = (
  userId,
  userName,
  img,
  currentUserId,
  user
) => {
  const userSelector = $(
      `.ep_profile_user_row[data-id="user_list_${userId}"]`
  );
  if (!userSelector.length) {
    const userListHtml = getHtmlOfUsersList(
        userId,
        userName,
        img,
        false,
        user.about,
        user.homepage,
        'Online'
    );
    if (userId === currentUserId) {
      // it is owner
      const titleOfContributors = $('#ep_profile_user_list_date_title');
      if (titleOfContributors.length) {
        $(userListHtml).insertAfter(titleOfContributors);
      } else {
        $('#ep_profile_user_list_container').prepend(userListHtml);
      }
    } else {
      $('#ep_profile_user_list_container').append(userListHtml);
    }
  } else {
    userSelector
        .children('.ep_profile_user_list_profile_userDesc')
        .children('.ep_profile_user_list_username')
        .children('.ep_profile_user_list_username_text')
        .text(userName);
    userSelector.children('.ep_profile_user_img').css({
      'background-position': '50% 50%',
      'background-image': `url(${img})`,
      'background-repeat': 'no-repeat',
      'background-size': '69px',
    });
  }
};

export const isThereOnlineAnonymous = () => {
  const selector = $(
      '.ep_profile_user_row[data-id="user_list_on_Anonymous"]'
  );
  if (selector.length) {
    return selector;
  } else {
    return false;
  }
};

export const checkUserExistInOnlineAnonymous = (selectorOn, userId) => {
  const idsData = selectorOn.attr('data-user-ids');
  const idsDataArray = idsData.split(',');
  if (idsDataArray.indexOf(userId) === -1) {
    return false;
  } else {
    return true;
  }
};

export const createOnlineAnonymousElement = (userId, userName, imageUrl, user) => {
  const onlineListSelector = $('#ep_profile_user_list_container');
  const userListHtml = getHtmlOfUsersList(
      userId,
      userName,
      imageUrl,
      'on_Anonymous',
      user.about,
      user.homepage,
      'Online'
  );
  onlineListSelector.append(userListHtml);
};

export const moveOnlineUserToOffline = (userElement) => {
  const offlineListSelector = $('#ep_profile_user_list_offline');
  if (offlineListSelector.length) {
    // because need anonymous offline be last one
    const userSelector = $(
        ".ep_profile_user_row[data-id='user_list_off_Anonymous']"
    );
    if (userSelector.length) {
      userElement.insertBefore(userSelector);
    } else {
      offlineListSelector.append(userElement);
    }
  } else {
    const offlineContainer = $('#ep_profile_user_list_container_off');
    offlineContainer.prepend(
        "<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"
    );
    offlineListSelector.append(userElement);
  }

  userElement
      .children('.ep_profile_user_list_profile_userDesc')
      .children('.ep_profile_user_list_username')
      .children('.ep_profile_contributor_status')
      .text('Last seen today');
};

export const decreaseUserFromList = (userId, padId) => {
  $(`.avatar[data-id="user_${userId}"]`).animate(
      {opacity: 0},
      1000,
      'linear',
      function () {
        $(this).remove();
      }
  );

  const selectorUser = $(
      `.ep_profile_user_row[data-id="user_list_${userId}"]`
  );
  if (selectorUser.length) {
    moveOnlineUserToOffline(selectorUser);
  } else {
    const selectorOn = $(
        '.ep_profile_user_row[data-id="user_list_on_Anonymous"]'
    );
    if (selectorOn.length) {
      const selectorOff = $(
          '.ep_profile_user_row[data-id="user_list_off_Anonymous"]'
      );
      decreaseFromOnlineAnonymous(selectorOn, userId);
      if (selectorOff.length) {
        increaseToOfflineAnonymous(selectorOff, userId);
      } else {
        createOfflineAnonymousElement(
            userId,
            defaultImg,
            null,
            null,
            selectorUser
        );
      }
    } else {
      let offlineListSelector = $('#ep_profile_user_list_offline');
      if (offlineListSelector.length) {
        offlineListSelector.append(
            $(`.ep_profile_user_row[data-id="user_list_${userId}"]`)
        );
      } else {
        const offlineContainer = $('#ep_profile_user_list_container_off');
        offlineContainer.prepend(
            `<div class="ep_profile_user_list_date_title"
              id="ep_profile_user_list_offline"></div>`
        );
        offlineListSelector = $('#ep_profile_user_list_offline');
        $(`.ep_profile_user_row[data-id="user_list_${userId}"]`).appendTo(
            offlineListSelector
        );
      }
    }
  }

  // user img update
  const imageUrl = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
  const userSelector = $(
      `.ep_profile_user_row[data-id="user_list_${userId}"]`
  );
  if (userSelector.length) {
    userSelector.children('.ep_profile_user_img').css({
      'background-position': '50% 50%',
      'background-image': `url(${imageUrl})`,
      'background-repeat': 'no-repeat',
      'background-size': '69px',
    });
  }
};

export const removeUserElementInUserList = (userId) => {
  $(`.ep_profile_user_row[data-id="user_list_${userId}"]`).remove();
};

export const paginateContributors = (
  allUsersList,
  onlineUsers,
  currentUserId,
  lastPage
) => {
  const containerPaginationList = $(
      '#ep_profile_user_list_container_pagination'
  );
  if (lastPage) {
    $('#ep_profile_modal_load_more_contributors').css({display: 'none'});
  }
  $.each(allUsersList, (key, value) => {
    const result = $.grep(onlineUsers, (e) => e.userId === value.userId);

    if (value.lastSeenDate !== '' && value.userName !== 'Anonymous') {
      const userListHtml = getHtmlOfUsersList(
          value.userId,
          value.userName,
          value.imageUrl,
          false,
          value.about,
          value.homepage,
          result.length ? 'Online' : shared.getCustomDate(value.lastSeenDate)
      );

      containerPaginationList.append(userListHtml);
    }

    if (result.length) {
      // online
      if (value.userName === 'Anonymous') {
        const selectorOn = $(
            '.ep_profile_user_row[data-id="user_list_on_Anonymous"]'
        );

        if (selectorOn.length) {
          increaseToOnlineAnonymous(selectorOn, value.userId);
        } else {
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              value.userName,
              value.imageUrl,
              'on_Anonymous',
              value.about,
              value.homepage,
              'Online'
          );
          containerPaginationList.append(userListHtml);
        }
        if (currentUserId === value.userId) {
          $(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({
            'margin-top': '28px',
          });
        }
      }
    }
  });

  // just for anonymouse to be end of list
  $.each(allUsersList, (key, value) => {
    // if (value.userId != currentUserId){
    const result = $.grep(onlineUsers, (e) => e.userId === value.userId);
    if (!result.length) {
      // offline
      if (value.userName === 'Anonymous') {
        const selectorOff = $(
            '.ep_profile_user_row[data-id="user_list_off_Anonymous"]'
        );
        if (selectorOff.length) {
          const anonymouseCount = selectorOff.attr('data-anonymouseCount');
          const newAnonymouseCount = parseInt(anonymouseCount) + 1;

          const idsDataOff = selectorOff.attr('data-user-ids');
          const idsDataOffArray = idsDataOff.split(',');
          idsDataOffArray.push(value.userId);
          selectorOff.attr('data-user-ids', idsDataOffArray.join(','));

          selectorOff.attr('data-anonymouseCount', newAnonymouseCount);
          selectorOff
              .children('.ep_profile_user_list_profile_userDesc')
              .children('.ep_profile_user_list_username')
              .text(`Anonymous ×${newAnonymouseCount}`);
        } else {
          const userListHtml = getHtmlOfUsersList(
              value.userId,
              'Anonymous',
              value.imageUrl,
              'off_Anonymous',
              value.about,
              value.homepage
          );
          containerPaginationList.append(userListHtml);
        }
      }
    }
  });
};
