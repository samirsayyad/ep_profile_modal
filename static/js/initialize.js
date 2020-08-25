
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
    if(clientVars.ep_profile_modal.user_status == "2"){
      
        window.user_status = "login";
        $("#pad_title").append("<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div></div>")
        
    }else{
        $("#pad_title").append("<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>"+usersListHTML+" </div><div class='ep-profile-button' id='ep-profile-button'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div></div>")
        window.user_status = "out";
        setTimeout(function() { 
            $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

        }, 1000);
    }


    var message = {
        type : 'ep_profile_modal',
        action : "ep_profile_modal_ready" ,
        userId :  pad.getUserId() ,
      }
    pad.collabClient.sendMessage(message); 
    

    if (clientVars.ep_profile_modal.userName == "Anonymous")
    {
        pad.collabClient.updateUserInfo({
        userId :  pad.getUserId() ,
        name: "Anonymous",
        colorId: "#b4b39a"
        } )
    }


}

