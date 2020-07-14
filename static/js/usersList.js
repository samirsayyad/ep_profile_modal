exports.handleClientMessage_USER_NEWINFO = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	$("#userlist_count").text(pad.collabClient.getConnectedUsers().length)
}
exports.handleClientMessage_USER_LEAVE = function(hook, context){
	//console.log("salam samir ma ma ",context,hook,pad.collabClient.getConnectedUsers().length);
	$("#userlist_count").text(pad.collabClient.getConnectedUsers().length)
}