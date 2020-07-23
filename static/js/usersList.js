var helper = require("./helper")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	helper.increaseUserFromList(context.payload.userId)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	helper.decreaseUserFromList(context.payload.userId)
}
// exports.handleClientMessage_EP_PROFILE_IMAGE = function(hook, context){
// 	$("#ep-profile-image").attr("src",context.payload.data);
// 	$(".ep_profile_modal_section_image_big").attr("src",context.payload.data);

// 	$("#ep_profile_modal_section_info_email").text(context.payload.email);
// 	$("#ep_profile_modal_section_info_name").text(context.payload.userName);
// 	/////////////////// related to user list when user has been loginned
// 	var online_anonymous_selector = helper.isThereOnlineAnonymous()
// 	if (online_anonymous_selector){
// 		if (helper.checkUserExistInOnlineAnonymous(online_anonymous_selector,context.payload.userId)){
// 			helper.decreaseFromOnlineAnonymous(online_anonymous_selector,context.payload.userId)
// 		}
// 		helper.createOnlineUserElementInUserList(context.payload.userId,context.payload.userName,context.payload.data )
// 	}



// }

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
	var current_user_id = pad.getUserId()

	if(context.payload.action == "totalUserHasBeenChanged"){
	  var totalUserCount = context.payload.totalUserCount;
	  $("#userlist_count").text(totalUserCount)


	}

	// if(context.payload.action == "newUserComeToList"){
	// 	if($(".ep_profile_user_row[data-id=\"user_list_"+context.payload.newUserData.userId+"\"]").length){
	// 		$(".ep_profile_user_row[data-id=\"user_list_"+context.payload.newUserData.userId+"\"]").appendTo("#ep_profile_user_list_container")
	// 	}else{
	// 		var userListHtml = helper.getHtmlOfUsersList(context.payload.newUserData.userId , context.payload.newUserData.userName ,context.payload.newUserData.imageUrl )
	// 		$("#ep_profile_user_list_container").append(userListHtml);

	// 	}
		
	// }


	if(context.payload.action == "EP_PROFILE_USERS_LIST"){
		var onlineUsers = pad.collabClient.getConnectedUsers();
		helper.manageOnlineOfflineUsers(context.payload.list ,onlineUsers , pad.getUserId())

	}

	if(context.payload.action == "EP_PROFILE_USER_LOGIN_UPDATE"){

		// change owner loginned img at top of page
		if (current_user_id ==context.payload.userId){
			$("#ep-profile-image").attr("src",context.payload.img);
			$(".ep_profile_modal_section_image_big").attr("src",context.payload.img);
	
			$("#ep_profile_modal_section_info_email").text(context.payload.email);
			$("#ep_profile_modal_section_info_name").text(context.payload.userName);
		}

		/////////////////// related to user list when user has been loginned
		var online_anonymous_selector = helper.isThereOnlineAnonymous()
		if (online_anonymous_selector){
			
			if (helper.checkUserExistInOnlineAnonymous(online_anonymous_selector,context.payload.userId)){
				helper.decreaseFromOnlineAnonymous(online_anonymous_selector,context.payload.userId)
			}
		}
		helper.createOnlineUserElementInUserList(context.payload.userId,context.payload.userName,context.payload.img ,current_user_id )





	}

  }


