exports.postAceInit = function (hook,context){
	console.log("samir",pad )

	console.log("samir",pad.collabClient )

	console.log("samir",pad.collabClient.getConnectedUsers())
	var hs = $('#ep-profile-button');
	var hs_ask = $('#ep-profile-button-ask');

	hs.on('click', function(){
		($('#ep_profile_modal').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal').addClass('ep_profile_modal-show')

	  });
	  
	hs_ask.on('click', function(){
		($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	});
	  $("#ep_profile_modal_username_listener").on('click',function(){
		var username = $("#ep_profile_modal_username").val();
		//console.log(username, "we are going to")
		if(username){
			var message = {
				type : 'USERINFO_UPDATE',
				userInfo : {
					userId :  pad.getUserId() ,
					name: username,
					colorId: "#b4b39a"
		
				} 
			  }
			//pad.collabClient.sendMessage(message);  // Send the chat position message to the server
			pad.collabClient.updateUserInfo({
				userId :  pad.getUserId() ,
				name: username,
				colorId: "#b4b39a"
	
			} )
		}

	  })



	  $("#ep_profile_modal_email_listener").on('click',function(){
		var email = $("#ep_profile_modal_email").val();
		console.log(email, "we are going to")
		if(email){
			var message = {
				type : 'ep_profile_modal',
				action : "ep_profile_modal_send_email" ,
				email : email ,
				userId :  pad.getUserId() ,

			  }
			pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		}

	  })


	  $("#ep_profile_modal_signout").on('click',function(){
		var message = {
			type : 'ep_profile_modal',
			action : "ep_profile_modal_logout" ,
			email : $("#ep_profile_hidden_email").val() ,
			userId :  pad.getUserId() ,

		  }
		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		$("#ep-profile-image").attr("src","../static/plugins/ep_profile_modal/static/img/user.png");
		$("#ep-profile-button").attr("id","ep-profile-button-ask");
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	  })


	// $('body').click(function (event) {
	// 	console.log(event.target)
	// 	if(
	// 		!$(event.target).closest('#ep-profile-button').length && 
	// 		!$(event.target).is('#ep-profile-button') &&
	// 		!$(event.target).closest('#ep-profile-button-ask').length && 
	// 		!$(event.target).is('#ep-profile-button-ask') &&
	// 		!$(event.target).is('#ep_profile_modal') &&
	// 		!$(event.target).is('#ep_profile_modal_ask')
	// 	) {
	// 		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
	// 		$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
	// 	}
 

	// });

	$("#ep_profile_modal_submit").on('click',function(){
		var username = $("#ep_profile_modal_username").val();
		var email = $("#ep_profile_modal_email").val();

		if(email == "" || username == ""){
			return false;
		}else{
			pad.collabClient.updateUserInfo({
				userId :  pad.getUserId() ,
				name: username,
				colorId: "#b4b39a"
			} )
			var message = {
				type : 'ep_profile_modal',
				action : "ep_profile_modal_login" ,
				email : $("#ep_profile_hidden_email").val() ,
				userId :  pad.getUserId() ,
	
			  }
			pad.collabClient.sendMessage(message);  // Send the chat position message to the server

			//$("#ep-profile-image").attr("src","../static/plugins/ep_profile_modal/static/img/user.png");
			$("#ep-profile-button-ask").attr("id","ep-profile-button");
			$('#ep_profile_modal').addClass('ep_profile_modal-show')
			$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		}
	})

}

 
exports.handleClientMessage_USER_IMAGE = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);

	$("#ep-profile-image").attr({src:  context.message.user_image });

}