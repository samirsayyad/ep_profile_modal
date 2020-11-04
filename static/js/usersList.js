var helper = require("./helper")
var syncData = require("./syncData")
var shared = require("./shared")

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

	if(context.payload.action == "EP_PROFILE_MODAL_PROMPT_DATA"){ // when we quess user by exist data prompt
		console.log("we gottttttttttttttttttttttttttttt",context.payload)

		
	}
	if(context.payload.action == "EP_PROFILE_USERS_LIST"){
		var onlineUsers = pad.collabClient.getConnectedUsers();
		console.log("pay;lpad", context.payload)
		helper.manageOnlineOfflineUsers(context.payload.list ,onlineUsers , pad.getUserId())
	}
	
	if(context.payload.action == "EP_PROFILE_USER_IMAGE_CHANGE"){ // when user A change image and user B want to know
		helper.refreshGeneralImage(context.payload.userId ,context.payload.padId )
	}

	if(context.payload.action == "EP_PROFILE_USER_LOGOUT_UPDATE"){
		var image_url ='/p/getUserProfileImage/'+context.payload.userId+"/"+context.payload.padId  +"?t=" + new Date().getTime()
		
		if (current_user_id ==context.payload.userId){
			helper.refreshUserImage(current_user_id,context.payload.padId)
//			$("#ep_profile_modal_section_info_name").text(context.payload.userName);

		}else{
			helper.refreshGeneralImage(context.payload.userId,context.payload.padId)
		}
		
		syncData.resetGeneralFields(context.payload.userId)

		// making user as anonymous
		var online_anonymous_selector = helper.isThereOnlineAnonymous()
		if (online_anonymous_selector){
			
			helper.increaseToOnlineAnonymous(online_anonymous_selector ,context.payload.userId)
		}else{
			helper.createOnlineAnonymousElement(context.payload.userId,Anonymous,image_url,{})
		}

		helper.removeUserElementInUserList(context.payload.userId)
	}

	if (context.payload.action =="EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT"){
			shared.addTextChatMessage(context.payload.msg);

	}
	if(context.payload.action == "EP_PROFILE_USER_LOGIN_UPDATE"){

		console.log("we got ",context.payload)

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


	// change owner loginned img at top of page
		if (current_user_id ==context.payload.userId){
			helper.refreshUserImage(current_user_id,context.payload.padId)
			syncData.syncAllFormsData(context.payload.userId , context.payload.user)

			//$("#ep_profile_modal_section_info_name").text(context.payload.userName);


		}else{
			helper.refreshGeneralImage(context.payload.userId,context.payload.padId)
			syncData.syncGeneralFormsData(context.payload.userId , context.payload.user)

		}


		




	}

}


