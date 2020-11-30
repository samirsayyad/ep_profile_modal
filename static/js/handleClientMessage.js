var helper = require("./helper")
var contributors = require("./contributors/contributors")
var syncData = require("./syncData")
var shared = require("./shared")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	var padId = pad.getPadId()

	contributors.increaseUserFromList(context.payload.userId,padId)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	var padId = pad.getPadId()

	contributors.decreaseUserFromList(context.payload.userId,padId)
}

exports.handleClientMessage_CUSTOM = function(hook, context, cb){
	var current_user_id = pad.getUserId()

	if(context.payload.action == "totalUserHasBeenChanged"){
	  var totalUserCount = context.payload.totalUserCount;
	  $("#userlist_count").text(totalUserCount)
	}

	if(context.payload.action == "EP_PROFILE_MODAL_PROMPT_DATA"){ // when we quess user by exist data prompt
		if (confirm('Do you want to prefill your existing data?')) {
			//for set image 
			if (context.payload.data.image){
				var message = {
					type : 'ep_profile_modal',
					action : "ep_profile_modal_prefill" ,
					userId :  context.payload.userId,
					data: context.payload.data,
					padId : context.payload.padId
				  }
				pad.collabClient.sendMessage(message);  // Send the chat position message to the server
			}

			$("#ep_profile_modal_homepage").val(context.payload.data.homepage)
			$("#ep_profile_modalForm_about_yourself").val(context.payload.data.about)

			// Save it!
		  } 
	}
	if(context.payload.action == "EP_PROFILE_USERS_LIST"){
		var onlineUsers = pad.collabClient.getConnectedUsers();
		contributors.manageOnlineOfflineUsers(context.payload.list ,onlineUsers , pad.getUserId())
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
		var online_anonymous_selector = contributors.isThereOnlineAnonymous()
		if (online_anonymous_selector){
			
			contributors.increaseToOnlineAnonymous(online_anonymous_selector ,context.payload.userId)
		}else{
			contributors.createOnlineAnonymousElement(context.payload.userId,"Anonymous",image_url,{})
		}

		contributors.removeUserElementInUserList(context.payload.userId)
	}

	if (context.payload.action =="EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT"){
			shared.addTextChatMessage(context.payload.msg);

	}
	if(context.payload.action == "EP_PROFILE_USER_LOGIN_UPDATE"){
		/////////////////// related to user list when user has been loginned
		var online_anonymous_selector = contributors.isThereOnlineAnonymous()
		if (context.payload.userName == "Anonymous"){
			if (online_anonymous_selector){
			
				contributors.increaseToOnlineAnonymous(online_anonymous_selector ,context.payload.userId)
			}else{
				contributors.createOnlineAnonymousElement(context.payload.userId,context.payload.userName,context.payload.img,context.payload.user)
			}

			contributors.removeUserElementInUserList(context.payload.userId)

		}else{
			if (online_anonymous_selector){
				
				if (contributors.checkUserExistInOnlineAnonymous(online_anonymous_selector,context.payload.userId)){
					contributors.decreaseFromOnlineAnonymous(online_anonymous_selector,context.payload.userId)
				}
			}
			contributors.createOnlineUserElementInUserList(context.payload.userId,context.payload.userName,context.payload.img ,current_user_id  , context.payload.user)
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


