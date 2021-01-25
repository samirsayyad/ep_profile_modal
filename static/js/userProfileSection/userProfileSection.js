// var shared = require('../shared');

const usersProfileSection = (() => {
	const initiate = function (clientVars) {
		const modal = $('#ep_profile_users_profile_script').tmpl(clientVars);
		$('body').append(modal);
		// $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')
	};
	
	const initiateListeners = function () {
		$('#usersIconList').on('click', '.avatar', function () {
			console.log('clicked');
			const userId = $(this).attr('data-userId');
			const padId = pad.getPadId();
			$.ajax({
				url: `/p/${padId}/pluginfw/ep_profile_modal/getUserInfo/${userId}`,
				type: 'get',
				data: {},
				contentType: false,
				processData: false,
				beforeSend() {
					const image_url = '../static/plugins/ep_profile_modal/static/img/loading.gif';
					$('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
						'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '69px', 'background-color': '#3873E0'});
					$('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
				},
				error(xhr) { // if error occured
	
				},
				success(response) {
					console.log(response);
					const image_url = `/p/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
					let username = response.user.username;
					if (username == null || username == '') { username = 'Anonymous'; }
					const about = response.user.about || '';
					const homepage = response.user.homepage || '';
	
					$('#ep_profile_users_profile_name').text(username);
					$('#ep_profile_users_profile_desc').text(about);
					$('#ep_profile_users_profile_homepage').attr({href: shared.getValidUrl(homepage), target: '_blank'});
	
	
					$('#ep_profile_users_profile').addClass('ep_profile_formModal_show');
					shared.showGeneralOverlay();
	
	
					$('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
						'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '69px', 'background-color': '#3873E0'});
				},
			});
		});
	
		$('#ep_profile_users_profile_close').on('click', () => {
			$('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
			shared.hideGeneralOverlay();
		});
	};
	
	return {
		initiate,
		initiateListeners,
	}
	
})()

