exports.postAceInit = function (hook,context){
	// console.log("samir",pad )
	// console.log("samir",pad.collabClient )
	// console.log("samir",pad.collabClient.getConnectedUsers())
	// /p/getUserProfileImage/${clientVars.userId}?t=${clientVars.serverTimestamp}

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
		var userId = pad.getUserId()
		window.user_status = "out";
		var message = {
			type : 'ep_profile_modal',
			action : "ep_profile_modal_logout" ,
			email : $("#ep_profile_hidden_email").val() ,
			userId :  userId ,

		  }
		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	  })


	// upload image profile
	$("#profile_file").on('change', function(e) {
		var userId= pad.getUserId()  ;
		var fd = new FormData();
		var files = $('#profile_file')[0].files[0];
		fd.append('file',files);
		if (!files) return;
		$.ajax({
			url: '/p/' + clientVars.padId + '/pluginfw/ep_profile_modal/upload/'+userId ,
			type: 'post',
			data: fd,
			contentType: false,
			processData: false,
			beforeSend: function() {
				// setting a timeout
				var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'
				$("#ep-profile-image").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
				});
				$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
				if (avatar.length){
					avatar.css({"background-position":"50% 50%",
					"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"});
				}


					
			},
			error: function(xhr) { // if error occured
				var image_url ='/p/getUserProfileImage/'+userId +"?t=" + new Date().getTime();
				var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
				if (avatar.length){
					avatar.css({"background-position":"50% 50%",
					"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
					});
				}
				$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				$("#ep-profile-image").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
				});
			},
			success: function(response){
				var image_url ='/p/getUserProfileImage/'+userId +"?t=" + new Date().getTime();
				var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
				if (avatar.length){
					avatar.css({"background-position":"50% 50%",
					"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
					});
				}
				$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
				$("#ep-profile-image").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
				});

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

 
// exports.handleClientMessage_USER_IMAGE = function(hook, context){
// 	console.log("=>>>>>> handleClientMessage_USER_IMAGE")
// 	$("#ep-profile-image").css({"background-position":"50% 50%",
// 	"background-image":"url("+context.message.user_image+")" , "background-repeat":"no-repeat","background-size": "32px"
// 	});
	
// 	//attr({src:  context.message.user_image });
// }


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