exports.postAceInit = function (hook,context){
	// console.log("samir",pad )
	// console.log("samir",pad.collabClient )
	// console.log("samir",pad.collabClient.getConnectedUsers())


	$("#userlist,#ep_profile_modal_user_list_close").on('click', function(){
		($('#ep_profile_modal_user_list').hasClass('ep_profile_modal-show'))?
			$('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show')
			:
			$('#ep_profile_modal_user_list').addClass('ep_profile_modal-show')
	})

	$('#ep-profile-button').on('click', function(){
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
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	  })


	// upload image profile
	$("#profile_file").on('change', function(e) {
		var userId= pad.getUserId()  ;
		var fd = new FormData();
		var files = $('#profile_file')[0].files[0];
		fd.append('file',files);
		$.ajax({
			url: '/p/' + clientVars.padId + '/pluginfw/ep_profile_modal/upload/'+userId ,
			type: 'post',
			data: fd,
			contentType: false,
			processData: false,
			success: function(response){
				if(response&&response.error==false ){
					  if (response.type =="s3")
						var image_url ='/p/getUserProfileImage/'+userId 
						$("#ep-profile-image").attr("src", image_url +"?t=" + new Date().getTime());
						$(".ep_profile_modal_section_image_big").attr("src", image_url +"?t=" + new Date().getTime());
						var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
						if (avatar.length){
							avatar.attr("src", image_url +"?t=" + new Date().getTime());
						}

 					}
				}
			 })
		
	})

	$("#ep_profile_modal_submit").on('click',function(){
		
		var username = $("#ep_profile_modal_username").val();
		var email = $("#ep_profile_modal_email").val();
		if(username == "" || !isEmail(email)){

			if (!isEmail(email)  ){
				$("#ep_profile_modal_email").focus()
				$('#ep_profile_modal_email').addClass('ep_profile_modal_validation_error')

			}
			return false;
		}else{

			$('#ep_profile_modal_email').removeClass('ep_profile_modal_validation_error')

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
			//$('#ep_profile_modal').addClass('ep_profile_modal-show')
			$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		}
	})

}

 
exports.handleClientMessage_USER_IMAGE = function(hook, context){
	$("#ep-profile-image").attr({src:  context.message.user_image });
}


function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(email=="")
		return true
	else
		return regex.test(email);
  }

function isUsername(username) {
var regex = /^([a-zA-Z0-9_.+-])/;
return regex.test(username);
}