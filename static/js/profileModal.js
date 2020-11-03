var usersProfileSection = require("./userProfileSection/userProfileSection")
var shared = require("./shared")
var helper = require("./helper")

var profileForm = require("./profileForm/main")
var syncData = require("./syncData")
exports.postAceInit = function (hook,context){
	// console.log("samir",pad )
	// console.log("samir",pad.collabClient )
	// console.log("samir",pad.collabClient.getConnectedUsers())
	// /p/getUserProfileImage/${clientVars.userId}?t=${clientVars.serverTimestamp}

	usersProfileSection.initiateListeners()
	
	$("#ep_profile_modal_save").on("click",function(){
		var userId = pad.getUserId() 
		var padId =  pad.getPadId()
		var username = $("#ep_profile_modal-username");
		var email = $("#ep_profile_modal-email");
		var about = $("#ep_profile_modal-about");
		var homepage = $("#ep_profile_modal-homepage");
		//var pushNotification = $("#ep_profile_modal_push_notification").checked;
		//validations
		if (username.val() == "") {
			username.css({"border":"1px solid red"})
			return false;
		}
		username.css({"border":"1px solid gray"})

		var userEmail =email.val()
		if (!shared.isEmail(userEmail) || userEmail==""){
			email.css({"border":"1px solid red"})
			return false;
		}
		email.css({"border":"1px solid gray"})

		var userLink = homepage.val()
		console.log(shared.IsValid(userLink))
		if (!shared.IsValid(userLink) || userLink==""){
			homepage.css({"border":"1px solid red"})
			return false;
		}
		homepage.css({"border":"1px solid gray"})
	
		//validations

		var $form = $("#ep_profile_modal_one");
		var data = shared.getFormData($form);

		var message = {
			type : 'ep_profile_modal',
			action : "ep_profile_modal_info" ,
			userId :  userId,
			data: data,
			padId : padId
		  }
		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		pad.collabClient.updateUserInfo({
			userId : padId,
			name: username.val(),
			colorId: "#b4b39a"
		})

		////
		if ( window.user_status == "login"){
			if($('#ep_profile_modal').hasClass('ep_profile_modal-show')){
				$('#ep_profile_modal').removeClass('ep_profile_modal-show')
				shared.hideGeneralOverlay()

			}
			else{
				$('#ep_profile_modal').addClass('ep_profile_modal-show')
				
				$("#online_ep_profile_modal_status").show()
				$("#offline_ep_profile_modal_status").hide()

				shared.showGeneralOverlay()
			}
			
	
		}
		// else{
		// 	($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
		// 	$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		// 	:
		// 	$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
		// }
	})

	$("#userlist_count,#ep_profile_modal_user_list_close").on('click', function(){
		if($('#ep_profile_modal_user_list').hasClass('ep_profile_modal-show')){
			$('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show')
			shared.hideGeneralOverlay()

		}
		else{
			shared.showGeneralOverlay()
			$('#ep_profile_modal_user_list').addClass('ep_profile_modal-show')
		}
		
	})

	$("#ep_profile_modal_verification").on("click",function(){
		var verificationStatus = $(this).attr("data-verification-status")
		var oldText = $(this).text()
		if(verificationStatus != "true"){
			$.ajax({
				url: '/p/' + pad.getPadId() + '/pluginfw/ep_profile_modal/sendVerificationEmail/'+pad.getUserId()+"/null/null" ,
				type: 'get',
				data: {},
				contentType: false,
				processData: false,
				beforeSend: function() {
					// setting a timeout
					var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'

					$("#ep_profile_modal_verification").text("Sending...")
						
				},
				error: function(xhr) { // if error occured
					$("#ep_profile_modal_verification").text("Error")
					setTimeout(function() { 
						$("#ep_profile_modal_verification").text(oldText)
					}, 2000);

				},
				success: function(response){
					$("#ep_profile_modal_verification").text("Verification email has been sent.")
					$("#ep_profile_modal_verification").attr("data-verification-status","true")
				}
				
			})
	
		}
		return false;
	})


	$('#ep-profile-button').on('click', function(){
		if ( window.user_status == "login"){
			if($('#ep_profile_modal').hasClass('ep_profile_modal-show')){
				$('#ep_profile_modal').removeClass('ep_profile_modal-show')
			}
			else{
				$('#ep_profile_modal').addClass('ep_profile_modal-show')
				$("#online_ep_profile_modal_status").show()
				$("#offline_ep_profile_modal_status").hide()
				shared.showGeneralOverlay()

			}
	
		}else{
			// ($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
			// $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
			// :
			// $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
			profileForm.resetModal()

			profileForm.showModal()

		}


	  });

	$("#ep_profile_modal_close").on('click', function(){
		if($('#ep_profile_modal').hasClass('ep_profile_modal-show')){
			$('#ep_profile_modal').removeClass('ep_profile_modal-show')
			shared.hideGeneralOverlay()

		}else{
			shared.showGeneralOverlay()
			$('#ep_profile_modal').addClass('ep_profile_modal-show')

		}
		

	})
	$("#ep_profile_modal_close_ask").on('click', function(){
		($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
		$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
		:
		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

	})

	


	  $("#ep_profile_modal_signout").on('click',function(){
		var userId = pad.getUserId()
		var padId = pad.getPadId()
		window.user_status = "out";
		var message = {
			type : 'ep_profile_modal',
			action : "ep_profile_modal_logout" ,
			email : $("#ep_profile_hidden_email").val() ,
			userId :  userId ,
			padId :padId

		  }
		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')
		$("#online_ep_profile_modal_status").hide()
		$("#offline_ep_profile_modal_status").show()
		// $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
		syncData.resetProfileModalFields()
		//$('#ep_profile_modal').addClass('ep_profile_modal-show')
		//shared.showGeneralOverlay()
		shared.hideGeneralOverlay()
		//shared.sendSignOutMessage(userId,padId)
		$(".avatar[data-id=\"user_"+userId+"\"]").attr({"style": ""})

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
				helper.refreshLoadingImage(userId,clientVars.padId)
			},
			error: function(xhr) { // if error occured
				helper.refreshUserImage(userId,clientVars.padId)
			},
			success: function(response){
				helper.refreshUserImage(userId,clientVars.padId)
			}
			
		})
	})

	$("#ep_profile_modal_submit").on('click',function(){
		
		var username = $("#ep_profile_modal_username").val();
		var email = $("#ep_profile_modal_email").val();

		shared.loginByEmailAndUsername(username , email)

	})

	$("#ep_profile_modal_login").on('click', function(){
		var username = $("#ep_profile_modal-username").val();
		var email = $("#ep_profile_modal-email").val();

		shared.loginByEmailAndUsername(username , email)
		$('#ep_profile_modal').removeClass('ep_profile_modal-show')

	})

	$("#ep_profile_general_overlay").on("click",function(){
		shared.hideGeneralOverlay()
	})
}
 