
var helper = require("./helper")
exports.aceInitialized = function(hook, context){
    console.log("user list ", pad.userList());
    var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
    if(clientVars.ep_profile_modal.profile_json == null){
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+" </div><div id='ep-profile-button'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div>")
        var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);
        $("body").append(modal)
        //$("#userList").append()
    }else{
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+"</div><div id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
        var modal = $("#ep_profile_modal_script").tmpl(clientVars);
        $("body").append(modal)
    }

// &#8725; 
}

