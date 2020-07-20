
var helper = require("./helper")
exports.aceInitialized = function(hook, context){

    console.log("user list ", pad.userList());
    var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);
    $("body").append(modal)
    modal = $("#ep_profile_modal_script").tmpl(clientVars);
    $("body").append(modal)
    var usersListHTML = helper.createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
    if(clientVars.ep_profile_modal.profile_json == null || clientVars.ep_profile_modal.user_status == "1"){
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+" </div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div>")
        window.user_status = "out";

        setTimeout(function() { 
            $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

        }, 1000);

        //$("#userList").append()
    }else{
        window.user_status = "login";

        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
        
    }




    
// &#8725; 
}

