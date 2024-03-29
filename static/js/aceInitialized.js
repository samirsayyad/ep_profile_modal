import * as profileForm from './profileForm/main';
import * as usersProfileSection from './userProfileSection/userProfileSection.js';
import * as contributors from './contributors/contributors';

export default (hook, context) => {
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
  } else {
    // if mobile
    $('#mainHeader .inlineAvatar').append(`
        <div class='ep_profile_modal_header'>
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
