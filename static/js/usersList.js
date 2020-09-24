var helper = require("./helper")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	helper.increaseUserFromList(context.payload.userId)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	helper.decreaseUserFromList(context.payload.userId)
}

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
	var current_user_id = pad.getUserId()

	if(context.payload.action == "totalUserHasBeenChanged"){
	  var totalUserCount = context.payload.totalUserCount;
	  $("#userlist_count").text(totalUserCount)
	}

	if(context.payload.action == "EP_PROFILE_USERS_LIST"){
		var onlineUsers = pad.collabClient.getConnectedUsers();
		helper.manageOnlineOfflineUsers(context.payload.list ,onlineUsers , pad.getUserId())
	}

	if(context.payload.action == "EP_PROFILE_USER_LOGOUT_UPDATE"){
		var image_url ='/p/getUserProfileImage/'+context.payload.userId 
		$("#ep-profile-image").attr("src", image_url +"?t=" + new Date().getTime());
		$(".ep_profile_modal_section_image_big").attr("src", image_url +"?t=" + new Date().getTime());
		$(".ep_profile_modal_section_image_big_ask").attr("src", image_url +"?t=" + new Date().getTime());
		var avatar = $(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]")
		if (avatar.length){
			avatar.attr("src", image_url +"?t=" + new Date().getTime());
		}

		//$(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]").attr("src","../static/plugins/ep_profile_modal/static/img/user-blue.png")

	}
	if(context.payload.action == "EP_PROFILE_USER_LOGIN_UPDATE"){
		var image_url ='/p/getUserProfileImage/'+context.payload.userId 

		// change owner loginned img at top of page
		if (current_user_id ==context.payload.userId){
			$("#ep-profile-image").attr("src", image_url +"?t=" + new Date().getTime());
			$(".ep_profile_modal_section_image_big").attr("src",context.payload.img);
			$(".ep_profile_modal_section_image_big").attr("src", image_url +"?t=" + new Date().getTime());
			$("#ep_profile_modal_section_info_name").text(context.payload.userName);
		}
		//$(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]").attr("src",context.payload.img)
		var avatar = $(".avatarImg[data-id=\"user_"+context.payload.userId+"\"]")
		if (avatar.length){
			avatar.attr("src", image_url +"?t=" + new Date().getTime());
		}

		/////////////////// related to user list when user has been loginned
		var online_anonymous_selector = helper.isThereOnlineAnonymous()
		if (context.payload.userName == "Anonymous"){
			if (online_anonymous_selector){
			
				helper.increaseToOnlineAnonymous(online_anonymous_selector ,context.payload.userId)
			}else{
				helper.createOnlineAnonymousElement(context.payload.userId,context.payload.userName,context.payload.img)
			}

			helper.removeUserElementInUserList(context.payload.userId)

		}else{
			if (online_anonymous_selector){
				
				if (helper.checkUserExistInOnlineAnonymous(online_anonymous_selector,context.payload.userId)){
					helper.decreaseFromOnlineAnonymous(online_anonymous_selector,context.payload.userId)
				}
			}
			helper.createOnlineUserElementInUserList(context.payload.userId,context.payload.userName,context.payload.img ,current_user_id )
		}



	}

  }


