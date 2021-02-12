// var contributors = require('./contributors/contributors');
// var profileForm = require('./profileForm/main');
// var usersProfileSection = require('./userProfileSection/userProfileSection');


const aceInitialized = (() => {
  const aceInitialized = (hook, context) => {
    // check is there any saved user in this browser
    console.log(clientVars)
    if (!localStorage.getItem('client_id'))
      localStorage.setItem('client_id',shared.uuidv4())
    profileForm.initModal({
      username : localStorage.getItem('username') || "",
      user_email : localStorage.getItem('user_email') || "",
      user_bio : localStorage.getItem('bio') || "",
      user_homepage : localStorage.getItem('homepage') || "",

    });


    // when user enter username we set it as passed because no need to show this form on following refresh
    if (localStorage.getItem('formPassed') !== "passed") {
      profileForm.showModal();
    }

    const userId = pad.getUserId();

    // / user profile section
    usersProfileSection.initiate(clientVars);
    // / user profile section

    let modal = $('#ep_profile_modal_script').tmpl(clientVars);
    $('body').append(modal);
    // /
    modal = $('#ep_profile_modal_user_list_script').tmpl(clientVars);
    $('body').append(modal);
    // /general
    modal = $('#ep_profile_modal_general_script').tmpl(clientVars);
    $('body').append(modal);
    const style = `background : url(/static/getUserProfileImage/${userId}/${clientVars.padId}) no-repeat 50% 50% ; background-size :32px`;
    const onlineUsers = pad.collabClient.getConnectedUsers();
    const usersListHTML = contributors.createHTMLforUserList(clientVars.ep_profile_modal.contributed_authors_count, onlineUsers, clientVars.padId, clientVars.ep_profile_modal.verified_users);
    if (clientVars.ep_profile_modal.user_status == '2') {
      window.user_status = 'login';
      $('#pad_title').append(`<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>${usersListHTML}</div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image' style='${style}' /></div></div>`);
    } else {
      $('#pad_title').append(`<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>${usersListHTML} </div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image'  style='${style}' /></div></div>`);
      window.user_status = 'out';
      if (clientVars.ep_profile_modal.form_passed == true) {
        setTimeout(() => {
          profileForm.showModal();

          // $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
        }, 1000);
      }
    }
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_ready',
      userId,
      padId: pad.getPadId(),
      data: clientVars.ep_profile_modal,
    };
    pad.collabClient.sendMessage(message);
    if (clientVars.ep_profile_modal.userName == 'Anonymous') {
      pad.collabClient.updateUserInfo({
        userId,
        name: 'Anonymous',
        colorId: '#b4b39a',
      });
    }
    // }


    return [];
  };

  return aceInitialized;
})();
