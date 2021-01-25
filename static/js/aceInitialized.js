// var contributors = require('./contributors/contributors');
// var profileForm = require('./profileForm/main');
// var usersProfileSection = require('./userProfileSection/userProfileSection');



const aceInitialized = (() => {

	const aceInitialized = (hook, context) => {
		const userId = pad.getUserId();
		// if (!window.matchMedia('(max-width: 720px)').matches) {
		let modal = $('#ep_profile_askmodal_script').tmpl(clientVars);
		profileForm.initModal(clientVars);
		if (clientVars.ep_profile_modal.form_passed !== true) {
			profileForm.showModal();
		}
		// / user profile section
		usersProfileSection.initiate(clientVars);
		// / user profile section
	
		//
		$('body').append(modal);
		// /
		modal = $('#ep_profile_modal_script').tmpl(clientVars);
		$('body').append(modal);
		// /
		modal = $('#ep_profile_modal_user_list_script').tmpl(clientVars);
		$('body').append(modal);
		// /general
		modal = $('#ep_profile_modal_general_script').tmpl(clientVars);
		$('body').append(modal);
		const style = `background : url(/p/getUserProfileImage/${userId}/${clientVars.padId}) no-repeat 50% 50% ; background-size :32px`;
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
	
	return aceInitialized
	
})();

