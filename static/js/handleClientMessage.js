var helper = require("./helper")
var contributors = require("./contributors/contributors")
var syncData = require("./syncData")
var shared = require("./shared")

exports.handleClientMessage_USER_NEWINFO = (hook, context)=>{
	var padId = pad.getPadId()

	contributors.increaseUserFromList(context.payload.userId,padId)
	return[]
}
exports.handleClientMessage_USER_LEAVE = (hook, context)=>{
	var padId = pad.getPadId()

	contributors.decreaseUserFromList(context.payload.userId,padId)
	return[]
}

exports.handleClientMessage_CUSTOM = (hook, context, cb)=>{
	var current_user_id = pad.getUserId()

	if(context.payload.action == "totalUserHasBeenChanged"){
		var totalUserCount = context.payload.totalUserCount;
		$("#userlist_count").text(totalUserCount)
		// var style = "background : url(/p/getUserProfileImage/"+current_user_id+"/"+ clientVars.padId +") no-repeat 50% 50% ; background-size :32px"
		// var onlineUsers = pad.collabClient.getConnectedUsers();
		// var usersListHTML = contributors.createHTMLforUserList( context.payload.totalUserCount,onlineUsers,context.payload.padId,
		// context.payload.verified_users)
		// $("#pad_title").append("<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image' style='"+style+"' /></div></div>")
		// var tmplObject = {
		// 	onlineUsers : onlineUsers.reverse(),
		// 	totalUserCount : context.payload.totalUserCount ,
		// 	padId : context.payload.padId,
		// 	verified_users : context.payload.verified_users
		// }
		// modal = $("#ep_profile_modal_user_list_script").tmpl(tmplObject,
		// 	{
		// 	  isInArray: function (items , needle) {
		// 		return items.indexOf(needle);
		// 	  }
		// 	});


	}

	if(context.payload.action == "EP_PROFILE_MODAL_PROMPT_DATA"){ // when we quess user by exist data prompt
		// if (confirm('Do you want to prefill your existing data?')) {
		// 	//for set image 
		// 	if (context.payload.data.image){
		// 		var message = {
		// 			type : 'ep_profile_modal',
		// 			action : "ep_profile_modal_prefill" ,
		// 			userId :  context.payload.userId,
		// 			data: context.payload.data,
		// 			padId : context.payload.padId
		// 		  }
		// 		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
		// 	}

		// 	$("#ep_profile_modal_homepage").val(context.payload.data.homepage)
		// 	$("#ep_profile_modalForm_about_yourself").val(context.payload.data.about)
		// 	$("#profile_modal_selected_image").css({"background-position":"50% 50%",
		// 	"background-image":"url("+context.payload.data.image+")" , "background-repeat":"no-repeat","background-size": "64px"
		// 	});
		// 	// Save it!
		// }else{
		// 	var message = {
		// 		type : 'ep_profile_modal',
		// 		action : "ep_profile_modal_prefill" ,
		// 		userId :  context.payload.userId,
		// 		data: {
		// 			image:""
		// 		},
		// 		padId : context.payload.padId
		// 	  }
		// 	pad.collabClient.sendMessage(message);
		// } 
		var image_url ='/p/getUserProfileImage/'+context.payload.userId+"/"+ context.payload.padId  +"?t=" + new Date().getTime();
		$("#ep_profile_modal_homepage").val(context.payload.data.homepage)
		$("#ep_profile_modalForm_about_yourself").val(context.payload.data.about)
		$("#profile_modal_selected_image").css({"background-position":"50% 50%",
			"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "64px"
		});
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
			helper.logoutCssFix(current_user_id)

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

	return[]


}


