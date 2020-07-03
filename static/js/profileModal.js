exports.postAceInit = function (hook,context){
	var hs = $('#ep-profile-button');
	hs.on('click', function(){
		$('#ep_profile_modal').show()
  	});
}

