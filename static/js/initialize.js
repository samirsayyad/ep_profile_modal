
var helper = require("./helper")
exports.aceInitialized = function(hook, context){

    var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);
    $("body").append(modal);
    ///
    modal = $("#ep_profile_modal_script").tmpl(clientVars);
    $("body").append(modal);

    ///
    modal = $("#ep_profile_modal_user_list_script").tmpl(clientVars);
    $("body").append(modal);
    

    var onlineUsers = pad.collabClient.getConnectedUsers();
    var usersListHTML = helper.createHTMLforUserList(clientVars.ep_profile_modal.contributed_authors_count,onlineUsers)
    if(clientVars.ep_profile_modal.profile_json == null || clientVars.ep_profile_modal.user_status == "1"){
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+" </div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div>")
        window.user_status = "out";
        setTimeout(function() { 
            $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

        }, 1000);

    }else{
        window.user_status = "login";
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
        
    }


    var message = {
        type : 'ep_profile_modal',
        action : "ep_profile_modal_ready" ,
        userId :  pad.getUserId() ,
      }
    pad.collabClient.sendMessage(message); 
    


}

