
var helper = require("./helper")
exports.aceInitialized = function(hook, context){
    console.log("user list ", pad.userList());
    var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
    if(clientVars.ep_profile_modal.profile_json == null || clientVars.ep_profile_modal.user_status == "1"){
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+" </div><div class='ep-profile-button' id='ep-profile-button-ask'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div>")
        
        //$("#userList").append()
    }else{
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
        
    }
    var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);
    $("body").append(modal)
    modal = $("#ep_profile_modal_script").tmpl(clientVars);
    $("body").append(modal)

// &#8725; 
}

