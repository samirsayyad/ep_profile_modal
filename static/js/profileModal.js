exports.postAceInit = function (hook,context){
	console.log("samir",pad )

	console.log("samir",pad.collabClient )

	console.log("samir",pad.collabClient.getConnectedUsers())
	var hs = $('#ep-profile-button');
	hs.on('click', function(){
		if ( window.user_status == "login"){
			($('#ep_profile_modal').hasClass('ep_profile_modal-show'))?
			$('#ep_profile_modal').removeClass('ep_profile_modal-show')
			:
			$('#ep_profile_modal').addClass('ep_profile_modal-show')
	
		}else{
			($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
			$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
			:
			$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
		}


	  });

	$("#ep_profile_modal_close").on('click', function(){
		($('#ep_profile_modal').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal').addClass('ep_profile_modal-show')

	})
	$("#ep_profile_modal_close_ask").on('click', function(){
		($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	})

	


	  $("#ep_profile_modal_signout").on('click',function(){
		window.user_status = "out";
		var message = {
			type : 'ep_profile_modal',
			action : "ep_profile_modal_logout" ,
			email : $("#ep_profile_hidden_email").val() ,
			userId :  pad.getUserId() ,

		  }
		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		$("#ep-profile-image").attr("src","../static/plugins/ep_profile_modal/static/img/user.png");
		//$("#ep-profile-button").attr("id","ep-profile-button-ask");
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	  })




	$("#ep_profile_modal_submit").on('click',function(){
		
		var username = $("#ep_profile_modal_username").val();
		var email = $("#ep_profile_modal_email").val();

		if(email == "" || username == ""){
			return false;
		}else{

			window.user_status = "login"
			pad.collabClient.updateUserInfo({
				userId :  pad.getUserId() ,
				name: username,
				colorId: "#b4b39a"
			} )
			var message = {
				type : 'ep_profile_modal',
				action : "ep_profile_modal_login" ,
				email : email ,
				userId :  pad.getUserId() ,
				name: username,

			  }
			pad.collabClient.sendMessage(message);  // Send the chat position message to the server

			//$("#ep-profile-image").attr("src","../static/plugins/ep_profile_modal/static/img/user.png");
			//$("#ep-profile-button-ask").attr("id","ep-profile-button");
			$('#ep_profile_modal').addClass('ep_profile_modal-show')
			$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		}
	})

}

 
exports.handleClientMessage_USER_IMAGE = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);

	$("#ep-profile-image").attr({src:  context.message.user_image });

}