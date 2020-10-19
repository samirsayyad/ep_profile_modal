var helper = require("./helper")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	var padId = pad.getPadId()

	helper.increaseUserFromList(context.payload.userId,padId)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	var padId = pad.getPadId()

	helper.decreaseUserFromList(context.payload.userId,padId)
}

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
	var current_user_id = pad.getUserId()

	if(context.payload.action == "totalUserHasBeenChanged"){
	  var totalUserCount = context.payload.totalUserCount;
	  $("#userlist_count").text(totalUserCount)
	}

	if(context.payload.action == "EP_PROFILE_USERS_LIST"){
		var onlineUsers = pad.collabClient.getConnectedUsers();
		console.log("pay;lpad", context.payload)
		helper.manageOnlineOfflineUsers(context.payload.list ,onlineUsers , pad.getUserId())
	}
	if(context.payload.action == "EP_PROFILE_USER_IMAGE_CHANGE"){ // when user A change image and user B want to know
		var image_url ='/p/getUserProfileImage/'+context.payload.userId+"/"+context.payload.padId  +"?t=" + new Date().getTime()
		var avatar = $(".avatarImg[data-id=\"user_"+context.payload.userId+"/"+context.payload.padId +"\"]")
		if (avatar.length){
			avatar.css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
			});
		}

		var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+context.payload.userId+"\"]") ; 
		if(user_selector.length)
		{
			user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
			});
		} 
	}
	if(context.payload.action == "EP_PROFILE_USER_LOGOUT_UPDATE"){
		var image_url ='/p/getUserProfileImage/'+context.payload.userId+"/"+context.payload.padId  +"?t=" + new Date().getTime()
		if (current_user_id ==context.payload.userId){
			image_url ='/p/getUserProfileImage/'+current_user_id+"/"+context.payload.padId +"?t=" + new Date().getTime()
			$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
			$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
			$("#ep-profile-image").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
			});
			
			$("#ep_profile_modal_section_info_name").text(context.payload.userName);

		}
		
		var avatar = $(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]")
		if (avatar.length){
			avatar.css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
			});
		}

	}
	if(context.payload.action == "EP_PROFILE_USER_LOGIN_UPDATE"){
		var image_url ='/p/getUserProfileImage/'+context.payload.userId +"/"+context.payload.padId +"?t=" + new Date().getTime()

		// change owner loginned img at top of page
		if (current_user_id ==context.payload.userId){
			image_url ='/p/getUserProfileImage/'+current_user_id+"/"+context.payload.padId 
			$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
			$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
			$("#ep-profile-image").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
			});
			$("#ep_profile_modal_section_info_name").text(context.payload.userName);
		}
		//$(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]").attr("src",context.payload.img)
		var avatar = $(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]")
		if (avatar.length){
			avatar.css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
			});
		}

		// var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+context.payload.userId+"\"]") ; 
		// if(user_selector.length)
		// {
		// 	user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
		// 	"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
		// 	});
		// } 

		/////////////////// related to user list when user has been loginned
		var online_anonymous_selector = helper.isThereOnlineAnonymous()
		if (context.payload.userName == "Anonymous"){
			if (online_anonymous_selector){
			
				helper.increaseToOnlineAnonymous(online_anonymous_selector ,context.payload.userId)
			}else{
				helper.createOnlineAnonymousElement(context.payload.userId,context.payload.userName,context.payload.img,context.payload.user)
			}

			helper.removeUserElementInUserList(context.payload.userId)

		}else{
			if (online_anonymous_selector){
				
				if (helper.checkUserExistInOnlineAnonymous(online_anonymous_selector,context.payload.userId)){
					helper.decreaseFromOnlineAnonymous(online_anonymous_selector,context.payload.userId)
				}
			}
			helper.createOnlineUserElementInUserList(context.payload.userId,context.payload.userName,context.payload.img ,current_user_id  , context.payload.user)
		}



		// profileModal.html

		
		// profileModal.html


	}

}


