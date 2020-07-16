var helper = require("./helper")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	// var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
	console.log(context)
	// $("#userlist").html(usersListHTML)
	helper.increaseUserFromList(44,context.payload.userId)

}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	// var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
	console.log(context)
	// $("#userlist").html(usersListHTML)
	helper.decreaseUserFromList(44,context.payload.userId)
}
exports.handleClientMessage_EP_PROFILE_IMAGE = function(hook, context){
	console.log("asssssssssssssssssssssssssssssssssssss",hook,context)

	$("#ep-profile-image").attr("src",context.payload.data);
	$(".ep_profile_modal_section_image_big").attr("src",context.payload.data);

	$("#ep_profile_modal_section_info_email").text(context.payload.email);
	$("#ep_profile_modal_section_info_name").text(context.payload.userName);
}