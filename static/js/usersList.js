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