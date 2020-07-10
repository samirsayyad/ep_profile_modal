exports.postAceInit = function (hook,context){
	var hs = $('#ep-profile-button');
	hs.on('click', function(){
		($('#ep_profile_modal').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal').addClass('ep_profile_modal-show')

	  });
	  
	  $("#ep_profile_modal_username_listener").on('click',function(){
		var username = $("#ep_profile_modal_username").val();
		console.log(username, "we are going to")
		if(username){
			var message = {
				type : 'USERINFO_UPDATE',
				userInfo : {
					userId :  pad.getUserId() ,
					name: username,
					colorId: "#b4b39a"
		
				} 
			  }
			pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		}

	  })
}

