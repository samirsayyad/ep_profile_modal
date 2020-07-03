exports.postAceInit = function (hook,context){
	var hs = $('#ep-profile-button');
	hs.on('click', function(){
		($('#ep_profile_modal').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal').addClass('ep_profile_modal-show')

  	});
}

