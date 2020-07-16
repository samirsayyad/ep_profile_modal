var helper = require("./helper")

exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())

	$("#userlist").html(usersListHTML)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())

	$("#userlist").html(usersListHTML)
}
exports.handleClientMessage_EP_PROFILE_IMAGE = function(hook, context){

	$("#ep-profile-image").attr("src",context.payload.data);
	$(".ep_profile_modal_section_image_big").attr("src",context.payload.data);
	console.log("asssssssssssssssssssssssssssssssssssss",hook,context)
}