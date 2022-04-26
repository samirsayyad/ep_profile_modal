exports.moduleList = (()=>{
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

const documentReady = (() => {
  const documentReady = (hooks, context, cb) => {
    let socket;
    const loc = document.location;
    const port =
      loc.port === '' ? (loc.protocol === 'https:' ? 443 : 80) : loc.port;
    const url = `${loc.protocol}//${loc.hostname}:${port}/`;
    const pathComponents = location.pathname.split('/');
    // Strip admin/plugins
    const baseURL = `${pathComponents
        .slice(0, pathComponents.length - 2)
        .join('/')}/`;
    const resource = `${baseURL.substring(1)}socket.io`;

    const room = `${url}pluginfw/admin/ep_profile_modal`;

    switch (context) {
      case 'admin/ep_profile_modal': {
        // connect
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});
        socket.on('load-settings-result', (data) => {
          shared.setFormData($('#settings-form'), data);
        });

        $('#save-settings').on('click', () => {
          const data = shared.getFormData($('#settings-form'));
          socket.emit('save-settings', data);
          alert('Succesfully saved.');
        });

        socket.emit('load-settings');
        break;
      }
      case 'admin/ep_profile_modal_analytics': {
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});

        socket.on('load-pads-result', (data) => {
          console.log('load-pads', data);
          $.each(data, (index, value) => {
            $('#pads').append(`<option value="${value}">${value}</option>`);
          });
        });
        socket.on('load-analytics-result', (data) => {
          console.log('load-analytics', data);
          $.each(data.pad_users_data, (index, value) => {
            if (value.userId) {
              $('#users').append(`
              <tr style="height: 0;">
                <td>${value.email || value.userId}</td>
                <td>${value.username}</td>
                <td>${value.createDate}</td>
                <td>${value.lastSeenDate}</td>
                <td>${value.verifiedDate || '-'}</td>
                <td>${value.verified ? 'Verified' : 'unconfirmed'}</td>
              </tr>
              `);
            }
          });
        });

        $('#pads').on('change', function () {
          socket.emit('load-analytics', {pad: this.value});
        });

        socket.emit('load-pads');
        break;
      }
      default: {
        return [];
      }
    }
  };
  return documentReady;
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

const contributors = (() => {
  const defaultImg =
    '../static/plugins/ep_profile_modal/static/dist/img/user.png';

  const createHTMLforUserList = (total, online, padId, userVerify) => {
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

  const increaseUserFromList = (userId, padId) => {
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

  // @todo rewrite and use template
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
        `<div  data-user-ids='${userId}' data-anonymouseCount='1' data-id='user_list_${
          anonymousHandler}' class='ep_profile_user_row'>` +
        `<div style='${style}' class='ep_profile_user_img' id='ep_profile_user_img'></div>` +
        "<div class='ep_profile_user_list_profile_userDesc'>" +
        `<div class='ep_profile_user_list_username'>
<div class='ep_profile_user_list_username_text' id='ep_profile_users_profile_name'>${
        username}</div>` +
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
${
        homepage === '' ||
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
        `<p class='ep_profile_user_list_profile_desc' id='ep_profile_users_profile_desc'>${
          about}</p>` +
        '</div> </div>'
      );
    }
  };
  const increaseToOnlineAnonymous = (selectorOn, userId) => {
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

  const manageOnlineOfflineUsers = (
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

  const decreaseFromOnlineAnonymous = (selectorOn, userId) => {
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

  const increaseToOfflineAnonymous = (selectorOff, userId) => {
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

  const createOfflineAnonymousElement = (
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

  const createOnlineUserElementInUserList = (
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

  const isThereOnlineAnonymous = () => {
    const selector = $(
        '.ep_profile_user_row[data-id="user_list_on_Anonymous"]'
    );
    if (selector.length) {
      return selector;
    } else {
      return false;
    }
  };
  const checkUserExistInOnlineAnonymous = (selectorOn, userId) => {
    const idsData = selectorOn.attr('data-user-ids');
    const idsDataArray = idsData.split(',');
    if (idsDataArray.indexOf(userId) === -1) {
      return false;
    } else {
      return true;
    }
  };

  const createOnlineAnonymousElement = (userId, userName, imageUrl, user) => {
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

  const moveOnlineUserToOffline = (userElement) => {
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

  const decreaseUserFromList = function (userId, padId) {
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

  const removeUserElementInUserList = (userId) => {
    $(`.ep_profile_user_row[data-id="user_list_${userId}"]`).remove();
  };

  const paginateContributors = (
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
  return {
    createHTMLforUserList,
    increaseUserFromList,
    decreaseUserFromList,
    moveOnlineUserToOffline,
    decreaseFromOnlineAnonymous,
    increaseToOfflineAnonymous,
    createOfflineAnonymousElement,
    manageOnlineOfflineUsers,
    increaseToOnlineAnonymous,
    createOnlineUserElementInUserList,
    isThereOnlineAnonymous,
    checkUserExistInOnlineAnonymous,
    createOnlineAnonymousElement,
    removeUserElementInUserList,
    paginateContributors,
  };
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

// var shared = require('../shared');
// var helper = require('../helper');

const profileForm = (() => {
  const showModal = () => {
    $('#ep_profile_formModal').addClass('ep_profile_formModal_show');
    $('#ep_profile_formModal_overlay').addClass(
        'ep_profile_formModal_overlay_show'
    );
    $('#ep_profile_formModal_overlay').css({display: 'block'});
    setTimeout(() => {
      $('#ep_profile_modalForm_name').focus();
    }, 1000);
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

  const getFormData = ($form) => {
    const unindexedArray = $form.serializeArray();
    const indexedArray = {};

    $.map(unindexedArray, (n, i) => {
      indexedArray[n.name] = n.value;
    });

    return indexedArray;
  };
  const handleOnCloseOverlay = () => {
    const userId = pad.getUserId();
    const padId = pad.getPadId();
    const $form = $('#ep_profile_formModal_msform');
    const data = getFormData($form);
    const msg = {};
    localStorage.setItem('formPassed', 'yes');
    removeEventListener();
    if (
      data.ep_profile_modalForm_name === '' ||
      ['', null, undefined].includes(localStorage.getItem('formStatus'))
    ) {
      return false;
    }
    let text = `Please welcome ${data.ep_profile_modalForm_name}`;
    if (data.ep_profile_modalForm_about_yourself !== '') {
      text += `, ${data.ep_profile_modalForm_about_yourself}`;
    }
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
    $('#ep_profile_formModal_overlay').removeClass(
        'ep_profile_formModal_overlay_show'
    );
    $('#ep_profile_formModal_overlay').css({display: 'none'});

    handleOnCloseOverlay();
  };
  const resetModal = function () {
    const fieldsets = $('#ep_profile_formModal_msform fieldset');
    fieldsets.each(function (index) {
      if (index === 0) $(this).show();
      else $(this).hide();
    });
  };

  const initModal = function (clientVars) {
    const modal = $('#ep_profile_formModal_script').tmpl(clientVars);
    $('body').append(modal);

    // jQuery time
    let currentFs, nextFs, previousFs; // fieldsets
    let animating; // flag to prevent quick multi-click glitches

    $('.skip').click(function () {
      if (animating) return false;
      $('#ep_profile_modalForm_name').css({border: '1px solid gray'});

      animating = true;

      currentFs = $(this).parent();
      nextFs = $(this).parent().next();

      // activate next step on progressbar using the index of next_fs
      // $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      // show the next fieldset
      currentFs.hide();
      nextFs.show();
      animating = false;
    });

    $(
        '.close , #ep_profile_formModal_overlay , .ep_profile_formModal_topClose'
    ).click(() => {
      $('#ep_profile_formModal').removeClass('ep_profile_formModal_show');

      hideFormModalOverlay();

      return false;
    });
    $('.previous').click(function () {
      if (animating) return false;
      animating = true;

      currentFs = $(this).parent();
      previousFs = $(this).parent().prev();

      // de-activate current step on progressbar
      // $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
      currentFs.hide();
      previousFs.show();
      animating = false;
    });

    $('.clear').click(function () {
      shared.resetAllProfileImage(
          $(this).attr('data-userId'),
          $(this).attr('data-padId')
      );
    });

    const sendFormDataToServer = () => {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      const $form = $('#ep_profile_formModal_msform');
      const data = getFormData($form);
      // send to ep_push_notification
      if (data.ep_profile_modalForm_push === 'Yes') {
        const event = new CustomEvent('ep_push_notification',
            {detail: {eventName: 'checkPermission'}});
        // Dispatch/Trigger/Fire the event
        window.dispatchEvent(event);
      }
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_info',
        userId,
        data,
        padId,
      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
    };

    const sendEmailVerification = (email, username) => {
      const oldText = $('#ep_profile_modal_verification').text();
      $.ajax({
        url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/$
        {pad.getUserId()}/${username}/${email}`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend: () => {
          // setting a timeout
          $('#ep_profile_modal_verification').text('Sending...');
        },
        error: (xhr) => {
          // if error occured
          $('#ep_profile_modal_verification').text('Error');
          setTimeout(() => {
            $('#ep_profile_modal_verification').text(oldText);
          }, 2000);
        },
        success: (response) => {
          $('#ep_profile_modal_verification').text(
              'Verification email has been sent.'
          );
          $('#ep_profile_modal_verification').attr(
              'data-verification-status',
              'true'
          );
        },
      });
    };

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
        error: (xhr) => {
          // if error occured
          helper.refreshUserImage(userId, clientVars.padId);
          $('#profile_modal_selected_image').attr(
              'style',
              (i, style) => style && style.replace(/background-image[^;]+;?/g, '')
          );

          switch (xhr.status) {
            case 413:
              $.gritter.add({
                title: 'Error',
                text: 'ep_profile_modal: image size is large.',
                sticky: true,
                // eslint-disable-next-line camelcase
                class_name: 'error',
              });
            // Take action, referencing xhr.responseText as needed.
          }
        },
        success: (response) => {
          helper.refreshUserImage(userId, clientVars.padId);

          $('#profile_modal_selected_image').attr(
              'style',
              (i, style) => style && style.replace(/background-image[^;]+;?/g, '')
          );
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
      // sync profile section to up
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
        shared.loginByEmailAndUsernameWithoutValidation(
            username,
            userEmail,
            true
        );
        sendEmailVerification(userEmail, username);
        $('#ep_profile_modalForm_email').css({border: '0px solid gray'});
      }

      if (currentSection === 'homepage') {
        const userLink = $('#ep_profile_modal_homepage').val();
        // console.log(shared.IsValid(userLink));
        if (!shared.isValid(userLink) || userLink === '') {
          $('#ep_profile_modal_homepage').css({border: '1px solid red'});
          return false;
        }
        $('#ep_profile_modal_homepage').css({border: '0px solid gray'});
        sendFormDataToServer();
      }
      // if (currentSection === 'push') {
      //   helper.checkNotificationPermission();
      // }

      if (currentSection === 'push') {
        $('#ep_profile_modal_push').val('Yes');
        sendFormDataToServer();
      }

      // if (currentSection == 'image') {
      //   uploadImg();
      // }

      animating = true;
      currentFs.hide();
      if (nextFs.length) {
        nextFs.show();

        // focus handling
        const nextSelection = nextFs.attr('data-section');
        if (nextSelection === 'email') {
          $('#ep_profile_modalForm_email').focus().select();
        }
        if (nextSelection === 'homepage') {
          $('#ep_profile_modal_homepage').focus().select();
        }
        if (nextSelection === 'bio') {
          $('#ep_profile_modalForm_about_yourself').focus().select();
        }
      } else {
        // seems last fieldset
        submitHandle();
      }
      animating = false;
    };

    $('#ep_profile_formModal_msform fieldset').on('keypress', (e) => {
      if (e.keyCode === 13) {
        // Cancel the default action on keypress event
        e.preventDefault();
        $('.next').click();
      }
    });
    $('.next').click(function () {
      currentFs = $(this).parent();
      nextFs = $(this).parent().next();
      nextHandler(currentFs, nextFs);
    });

    $('.submit').click(() => {
      submitHandle();
      return false;
    });
    // upload image profile
    $('#profile_file_modal').on('change', (e) => {
      const files = $('#profile_file_modal')[0].files[0];

      const url = URL.createObjectURL(files);
      $('#profile_modal_selected_image').css({
        'background-position': '50% 50%',
        'background-image': `url(${url})`,
        'background-repeat': 'no-repeat',
        'background-size': '64px',
      });
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

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

// var shared = require('../shared');

const usersProfileSection = (() => {
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
          const imageUrl =
            '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
          $('#ep_profile_users_profile_userImage').css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
          // $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
          $('#ep_profile_user_img').css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
          $('#ep_profile_users_profile_name').text('');
          $('#ep_profile_users_profile_desc').text('');

          $('#ep_profile_users_profile').addClass('ep_profile_formModal_show');
          shared.showGeneralOverlay();
        },
        error: (xhr) => {
          // if error occured
          $('#ep_profile_users_profile').removeClass(
              'ep_profile_formModal_show'
          );
          shared.hideGeneralOverlay();
        },
        success: (response) => {
          const imageUrl =
          `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
          let username = response.user.username;
          if (username == null || username === '') {
            username = 'Anonymous';
          }
          const about = response.user.about || '';
          const homepage = response.user.homepage || '';

          $('#ep_profile_users_profile_name').text(username);
          $('#ep_profile_users_profile_desc').text(about);
          if (homepage === '') {
            $('#ep_profile_users_profile_homepage').hide();
          } else {
            $('#ep_profile_users_profile_homepage').attr({
              href: shared.getValidUrl(homepage),
              target: '_blank',
            });
          }

          $('#ep_profile_users_profile_userImage').css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
          $('#ep_profile_user_img').css({
            'background-position': '50% 50%',
            'background-image': `url(${imageUrl})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
        },
      });
    };

    $('#usersIconList').on('avatarClick', (e, userIdParam) => {
      // coming from external plugins
      if (!userIdParam || userIdParam.indexOf('a.') < 0) return;
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

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

const postAceInit = (() => {
  const __LOGOUT = '1';
  const postAceInit = (hook, context) => {
    usersProfileSection.initiateListeners();

    $('#ep_profile_modalForm_push').on('change', (e) => {
      const elem = $('#ep_profile_modalForm_push');
      const checked = elem.is(':checked');
      elem.attr('checked', checked);
      elem.val(checked);
    });

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


      // send to ep_push_notification
      if (data.ep_profile_modalForm_push) {
        const event = new CustomEvent('ep_push_notification',
            {detail: {eventName: 'checkPermission'}});
        // Dispatch/Trigger/Fire the event
        window.dispatchEvent(event);
      }


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
      const pageLoaded =
        $('#ep_profile_modal_user_list').attr('data-pageLoaded') || false;
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
            $('#ep_profile_modal_load_more_contributors').css({
              display: 'none',
            });
            onlineListSelector.css({display: 'none'});
          },
          error: (xhr) => {
            // if error occured
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
                response.data,
                onlineUsers,
                pad.getUserId(),
                response.lastPage
            );
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
          $('#ep_profile_modal_load_more_contributors').css({
            display: 'none',
          });
        },
        error: (xhr) => {
          // if error occured
          $('#loadMoreLoading').hide();
          $('#ep_profile_modal_load_more_contributors').css({
            display: 'block',
          });
        },
        success: (response) => {
          $('#ep_profile_modal_load_more_contributors').css({
            display: 'block',
          });
          $('#loadMoreLoading').hide();
          $('#ep_profile_modal_user_list').attr('data-page', page);
          const onlineUsers = pad.collabClient.getConnectedUsers();
          contributors.manageOnlineOfflineUsers(
              response.data,
              onlineUsers,
              pad.getUserId(),
              response.lastPage
          );
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
          url: `/static/${pad.getPadId()
          }/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/null/null`,
          type: 'get',
          data: {},
          contentType: false,
          processData: false,
          beforeSend: () => {
            // setting a timeout
            $('#ep_profile_modal_verification').text('Sending...');
          },
          error: (xhr) => {
            // if error occured
            $('#ep_profile_modal_verification').text('Error');
            setTimeout(() => {
              $('#ep_profile_modal_verification').text(oldText);
            }, 2000);
          },
          success: (response) => {
            $('#ep_profile_modal_verification').text(
                'Verification email has been sent.'
            );
            $('#ep_profile_modal_verification').attr(
                'data-verification-status',
                'true'
            );
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
      if (window.userStatus === 'login') {
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
      $('#ep_profile_modal_ask').hasClass('ep_profile_modal-show')
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
        error: (xhr) => {
          // if error occured
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

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

const aceInitialized = (() => {
  const aceInitialized = (hook, context) => {
    const bindEvent = (element, eventName, eventHandler) => {
      if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
        element.attachEvent(`on${eventName}`, eventHandler);
      }
    };

    bindEvent(window, 'message', (e) => {
      const eventName = e.data.eventName;
      const data = e.data.data;

      if (eventName === 'showEtherpadModal') {
        profileForm.showModal();
      }
      if (eventName === 'showProfileDetailModal') {
        $('#usersIconList').trigger('avatarClick', data.userId);
      }
    });

    const userId = pad.getUserId();
    // if (!window.matchMedia('(max-width: 720px)').matches) {
    profileForm.initModal(clientVars);
    // if (clientVars.ep_profile_modal.form_passed !== true) {
    //   profileForm.showModal();
    // }
    if (localStorage.getItem('formPassed') !== 'yes') profileForm.allEventListener();
    //   profileForm.showModal();

    // / user profile section
    usersProfileSection.initiate(clientVars);
    // / user profile section

    let modal = $('#ep_profile_modal_script').tmpl(clientVars);
    $('body').append(modal);
    // /
    modal = $('#ep_profile_modal_user_list_script').tmpl(clientVars);
    $('body').append(modal);
    // /general
    modal = $('#ep_profile_modal_general_script').tmpl();
    $('body').append(modal);
    // template generate

    const style = `
      background : url(/static/getUserProfileImage/${userId}/${clientVars.padId}) no-repeat 50% 50%;
      background-size :32px
    `;

    const onlineUsers = pad.collabClient.getConnectedUsers();
    const usersListHTML = contributors.createHTMLforUserList(
        clientVars.ep_profile_modal.contributed_authors_count,
        onlineUsers,
        clientVars.padId,
        clientVars.ep_profile_modal.verified
    );

    if (!$('body').hasClass('mobileView')) {
      if ($('#pad_title').length === 0) {
        $('body').prepend(`
          <div id='pad_title'>
            <div class="title_container">
              <span contenteditable style="color:#000" id='title'>Loading...</span>
            </div>
            <button id='save_title'></button>
          </div>
        `);
      }
      $('#pad_title').append(`
        <div class='ep_profile_modal_header'>
          <div class='userlist' id='userlist'>
          ${usersListHTML}
          </div>
          <div class='ep-profile-button' id='ep-profile-button'>
          <div id='ep-profile-image' style='${style}' /></div>
        </div>
      `);
    }

    if (clientVars.ep_profile_modal.userStatus === '2') {
      window.userStatus = 'login';
    } else {
      window.userStatus = 'out';
    }
    // We were telling to server that we
    // are ready to get data that due to large data
    // need to be request base over HTTP + just for analytics
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_ready',
      userId,
      padId: clientVars.padId,
      data: clientVars.ep_profile_modal,
    };

    pad.collabClient.sendMessage(message);

    if (clientVars.ep_profile_modal.userName === 'Anonymous') {
      pad.collabClient.updateUserInfo({
        userId,
        name: 'Anonymous',
        colorId: '#b4b39a',
      });
    }

    return [];
  };

  return aceInitialized;
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

const handleClientMessage = (() => {
  const handleClientMessage_USER_NEWINFO = (hook, context) => {
    const padId = pad.getPadId();

    contributors.increaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_USER_LEAVE = (hook, context) => {
    const padId = pad.getPadId();

    contributors.decreaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_CUSTOM = (hook, context, cb) => {
    const currentUserId = pad.getUserId();

    if (context.payload.action === 'totalUserHasBeenChanged') {
      const totalUserCount = context.payload.totalUserCount;
      $('#userlist_count').text(totalUserCount);
    }

    if (context.payload.action === 'EP_PROFILE_USER_IMAGE_CHANGE') {
      // when user A change image and user B want to know
      helper.refreshGeneralImage(context.payload.userId, context.payload.padId);
    }

    if (context.payload.action === 'EP_PROFILE_USER_LOGOUT_UPDATE') {
      const imageUrl = `/static/getUserProfileImage/${context.payload.userId}/${
        context.payload.padId
      }?t=${new Date().getTime()}`;

      if (currentUserId === context.payload.userId) {
        helper.refreshUserImage(currentUserId, context.payload.padId);
        helper.logoutCssFix(currentUserId);
      } else {
        helper.refreshGeneralImage(
            context.payload.userId,
            context.payload.padId
        );
      }

      syncData.resetGeneralFields(context.payload.userId);

      // making user as anonymous
      const onlineAnonymousSelector = contributors.isThereOnlineAnonymous();
      if (onlineAnonymousSelector) {
        contributors.increaseToOnlineAnonymous(
            onlineAnonymousSelector,
            context.payload.userId
        );
      } else {
        contributors.createOnlineAnonymousElement(
            context.payload.userId,
            'Anonymous',
            imageUrl,
            {}
        );
      }

      contributors.removeUserElementInUserList(context.payload.userId);
    }

    if (context.payload.action === 'EP_PROFILE_USER_LOGIN_UPDATE') {
      // ///////////////// related to user list when user has been loginned
      const onlineAnonymousSelector = contributors.isThereOnlineAnonymous();
      if (context.payload.userName === 'Anonymous') {
        if (onlineAnonymousSelector) {
          contributors.increaseToOnlineAnonymous(
              onlineAnonymousSelector,
              context.payload.userId
          );
        } else {
          contributors.createOnlineAnonymousElement(
              context.payload.userId,
              context.payload.userName,
              context.payload.img,
              context.payload.user
          );
        }

        contributors.removeUserElementInUserList(context.payload.userId);
      } else {
        if (onlineAnonymousSelector) {
          if (
            contributors.checkUserExistInOnlineAnonymous(
                onlineAnonymousSelector,
                context.payload.userId
            )
          ) {
            contributors.decreaseFromOnlineAnonymous(
                onlineAnonymousSelector,
                context.payload.userId
            );
          }
        }
        contributors.createOnlineUserElementInUserList(
            context.payload.userId,
            context.payload.userName,
            context.payload.img,
            currentUserId,
            context.payload.user
        );
      }

      // change owner loginned img at top of page
      if (currentUserId === context.payload.userId) {
        helper.refreshUserImage(currentUserId, context.payload.padId);
        syncData.syncAllFormsData(context.payload.userId, context.payload.user);

        // $("#ep_profile_modal_section_info_name").text(context.payload.userName);
      } else {
        helper.refreshGeneralImage(
            context.payload.userId,
            context.payload.padId
        );
        syncData.syncGeneralFormsData(
            context.payload.userId,
            context.payload.user
        );
      }
    }

    return [];
  };
  return {
    handleClientMessage_USER_NEWINFO,
    handleClientMessage_USER_LEAVE,
    handleClientMessage_CUSTOM,
  };
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';
const __LOGIN = '2';
const __LOGOUT = '1';

const helper = (() => {
  // const checkNotificationPermission = () => {
  //   if (!('Notification' in window)) {
  //     $.gritter.add({
  //       title: 'Error',
  //       text: 'ep_profile_modal: This browser does not support desktop notification.',
  //       sticky: true,
  //       // eslint-disable-next-line camelcase
  //       class_name: 'error',
  //     });
  //   } else if (!['denied', 'granted'].includes(Notification.permission)) {
  //     Notification.requestPermission().then((permission) => {
  //       console.log(permission, '<= permission');
  //     });
  //   }
  // };

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
      userSelector.children('.ep_profile_user_img').css({
        'background-position': '50% 50%',
        'background-image': `url(${imageUrl})`,
        'background-repeat': 'no-repeat',
        'background-size': '69px',
      });
    }

    const rocketChatOnlineUser = $(`.avatar[data-id="${userId}"]`);
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
      userSelector.children('.ep_profile_user_img').css({
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
      userSelector.children('.ep_profile_user_img').css({
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
    // checkNotificationPermission,
  };
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
'use strict';

// const __LOGIN = '2';
// var helper = require('./helper');

const shared = (() => {
  const resetAllProfileImage = (userId, padId) => {
    $.ajax({
      url: `/static/${padId}/pluginfw/ep_profile_modal/resetProfileImage/${userId}`,
      type: 'get',
      data: {},
      contentType: false,
      processData: false,
      beforeSend: () => {
        helper.refreshLoadingImage(userId, padId);
      },
      error: (xhr) => {
        // if error occured
        helper.refreshUserImage(userId, padId);
      },
      success: (response) => {
        helper.refreshUserImage(userId, padId);
      },
    });
  };
  const sendSignOutMessage = (userId, padId) => {
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_send_signout_message',
      userId,
      padId,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const scrollDownToLastChatText = (selector) => {
    const $element = $(selector);
    if ($element.length <= 0 || !$element[0]) return true;
    $element.animate(
        {scrollTop: $element[0].scrollHeight},
        {duration: 400, queue: false}
    );
  };
  const addTextChatMessage = (msg) => {
    const authorClass = `author-${msg.userId.replace(/[^a-y0-9]/g, (c) => {
      if (c === '.') return '-';
      return `z${c.charCodeAt(0)}z`;
    })}`;

    // create the time string
    let minutes = `${new Date(msg.time).getMinutes()}`;
    let hours = `${new Date(msg.time).getHours()}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (hours.length === 1) hours = `0${hours}`;
    const timeStr = `${hours}:${minutes}`;

    const html = `<p><span class='time ${authorClass}'>${timeStr}</span> ${msg.text}</p>`;

    $(document).find('#chatbox #chattext').append(html);
    scrollDownToLastChatText('#chatbox #chattext');
  };

  const loginByEmailAndUsernameWithoutValidation = (
      username,
      email,
      suggestData
  ) => {
    clientVars.ep_profile_modal.userStatus = __LOGIN;

    window.userStatus = 'login';
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_login',
      email,
      userId: pad.getUserId(),
      name: username,
      padId: pad.getPadId(),
      suggestData,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const isEmail = (email) => {
    const regex =
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email === '') {
      return true;
    } else {
      return regex.test(email);
    }
  };

  const loginByEmailAndUsername = (username, email) => {
    if (username === '' || !isEmail(email)) {
      if (!isEmail(email)) {
        $('#ep_profile_modal_email').focus();
        $('#ep_profile_modal_email').addClass(
            'ep_profile_modal_validation_error'
        );
      }
      return false;
    } else {
      $('#ep_profile_modal_email').removeClass(
          'ep_profile_modal_validation_error'
      );
      clientVars.ep_profile_modal.userStatus = __LOGIN;

      window.userStatus = 'login';
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_login',
        email,
        userId: pad.getUserId(),
        name: username,
        padId: pad.getPadId(),
        suggestData: false,
      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      helper.userLogin({
        email,
        username,
      });

      $('#online_ep_profile_modal_status').show();
      $('#offline_ep_profile_modal_status').hide();
    }
  };

  const isValid = (url) => {
    const pattern =
    // eslint-disable-next-line max-len
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return pattern.test(url);
  };

  const getFormData = ($form) => {
    const unindexedArray = $form.serializeArray();
    const indexedArray = {};

    $.map(unindexedArray, (n, i) => {
      indexedArray[n.name] = n.value;
    });

    return indexedArray;
  };
  const setFormData = ($form, indexedArray) => {
    $.map(indexedArray, (n, i) => {
      $(`#${i}`).val(n);
    });
  };

  const isUsername = (username) => {
    const regex = /^([a-zA-Z0-9_.+-])/;
    return regex.test(username);
  };
  const showGeneralOverlay = () => {
    $('#ep_profile_general_overlay').addClass(
        'ep_profile_formModal_overlay_show'
    );
    $('#ep_profile_general_overlay').css({display: 'block'});
  };

  const hideGeneralOverlay = () => {
    $('#ep_profile_general_overlay').removeClass(
        'ep_profile_formModal_overlay_show'
    );
    $('#ep_profile_general_overlay').css({display: 'none'});
    $('#ep_profile_modal').removeClass('ep_profile_modal-show');
    $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show');
    $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
  };

  const getValidUrl = (url) => {
    if (url === '' || !url) return '';
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }

    return newUrl;
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthNumber - 1];
  };
  const getCustomeFormatDate = (date) => {
    if (date === 'today' || date === 'yesterday') return `Last seen ${date}`;
    date = date.split('-');
    return `Last seen ${date[2]} ${getMonthName(date[1])} ${date[0]}`;
  };
  const getCustomDate = (date) => {
    console.log(date, 'date');
    if (date === 'today' || date === 'yesterday') return `Last seen ${date}`;
    date = date.split('-');
    return `Last seen ${date[2]}/${date[1]}/${date[0]}`;
  };

  return {
    resetAllProfileImage,
    sendSignOutMessage,
    addTextChatMessage,
    scrollDownToLastChatText,
    loginByEmailAndUsernameWithoutValidation,
    loginByEmailAndUsername,
    isEmail,
    isValid,
    getFormData,
    setFormData,
    isUsername,
    showGeneralOverlay,
    hideGeneralOverlay,
    getValidUrl,
    getMonthName,
    getCustomeFormatDate,
    getCustomDate,
  };
})();

/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

// var shared = require('./shared');

const syncData = (() => {
  const syncAllFormsData = (userId, data) => {
    if (data === undefined) return;
    // users List
    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      const usernameBox = userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_username');
      usernameBox
          .children('.ep_profile_user_list_username_text')
          .text(data.username);

      userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_profile_desc')
          .text(data.about);
      if (data.homepage) {
        const homepageElem = usernameBox.children(
            '.ep_profile_contributor_link_container'
        );
        homepageElem.attr({href: shared.getValidUrl(data.homepage)});
      }
      usernameBox.children('.ep_profile_contributor_status').text('Online');
    }
    $('#ep_profile_modal-username').val(data.username);
    $('#ep_profile_modal-about').val(data.about);
    $('#ep_profile_modal-homepage').val(data.homepage);
    $('#ep_profile_modal-email').val(data.email);
    if (data.verified === true) {
      $('#ep_profile_modal_verification').attr(
          'data-verification-status',
          'true'
      );
      $('#ep_profile_modal_verification').text('Verified');
    } else {
      $('#ep_profile_modal_verification').attr(
          'data-verification-status',
          'false'
      );
      $('#ep_profile_modal_verification').text('Send verification email');
    }
    // if(data.push_notification == false)
    //     $("#ep_profile_modal_push_notification").attr('checked','')
    // else
    //     $("#ep_profile_modal_push_notification").attr('checked','checked')

    // profile modal
  };
  const syncGeneralFormsData = (userId, data) => {
    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      const usernameBox = userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_username');
      usernameBox
          .children('.ep_profile_user_list_username_text')
          .text(data.username);

      userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_profile_desc')
          .text(data.about);

      const homepageElem = usernameBox.children(
          '.ep_profile_contributor_link_container'
      );
      homepageElem.attr({href: shared.getValidUrl(data.homepage)});

      usernameBox.children('.ep_profile_contributor_status').text('Online');
    }
  };

  const resetProfileModalFields = () => {
    $('#ep_profile_modal-username').val('');
    $('#ep_profile_modal-about').val('');
    $('#ep_profile_modal-homepage').val('');
    $('#ep_profile_modal-email').val('');

    $('#ep_profile_modalForm_name').val('');
    $('#ep_profile_modalForm_email').val('');
    $('#ep_profile_modal_homepage').val('');
    $('#ep_profile_modalForm_about_yourself').val('');
  };
  const resetGeneralFields = (userId) => {
    const userSelector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (userSelector.length) {
      const usernameBox = userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_username');
      usernameBox.children('.ep_profile_user_list_username_text').text('');
      userSelector
          .children('.ep_profile_user_list_profile_userDesc')
          .children('.ep_profile_user_list_profile_desc')
          .text('');
      const homepageElem = usernameBox.children(
          '.ep_profile_contributor_link_container'
      );
      homepageElem.attr({href: ''});
      usernameBox.children('.ep_profile_contributor_status').text('');
    }
  };

  return {
    syncAllFormsData,
    syncGeneralFormsData,
    resetProfileModalFields,
    resetGeneralFields,
  };
})();
return {
documentReady
,contributors
,profileForm
,usersProfileSection
,postAceInit
,aceInitialized
,handleClientMessage
,helper
,shared
,syncData
}
})();