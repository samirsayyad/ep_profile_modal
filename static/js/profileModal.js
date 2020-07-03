exports.postAceInit = function (hook,context){
	var hs = $('#ep-profile-button');
	hs.on('click', function(){
		($('#ep_profile_modal').is(":visible")) ? 
		$('#ep_profile_modal').animate({ opacity: 0 }) : $('#ep_profile_modal').animate({ opacity: 1 })
		
  	});
}

