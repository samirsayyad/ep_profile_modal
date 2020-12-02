
var contributors = require("./contributors/contributors")
var profileForm = require("./profileForm/main")
var usersProfileSection = require("./userProfileSection/userProfileSection")

exports.aceInitialized = function(hook, context){

    var userId = pad.getUserId()
    var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);

    profileForm.initModal(clientVars)

    if(clientVars.ep_profile_modal.form_passed !== true){
        profileForm.showModal()

    }

    /// user profile section
    usersProfileSection.initiate(clientVars)
    /// user profile section

    //
    $("body").append(modal);
    ///
    modal = $("#ep_profile_modal_script").tmpl(clientVars);
    $("body").append(modal);
    ///
    modal = $("#ep_profile_modal_user_list_script").tmpl(clientVars);
    $("body").append(modal);
    ///general
    modal = $("#ep_profile_modal_general_script").tmpl(clientVars);
    $("body").append(modal);
   
    if(clientVars.ep_profile_modal.user_status == "2"){
        window.user_status = "login";
    }else{
        window.user_status = "out";
        if (clientVars.ep_profile_modal.form_passed == true){
            setTimeout(function() { 
                profileForm.showModal()

                //$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')

            }, 1000);
        }

    }
    var message = {
        type : 'ep_profile_modal',
        action : "ep_profile_modal_ready" ,
        userId : userId ,
        padId : pad.getPadId(),
        data : clientVars.ep_profile_modal
      }
    pad.collabClient.sendMessage(message); 
    if (clientVars.ep_profile_modal.userName == "Anonymous")
    {
        pad.collabClient.updateUserInfo({
        userId :userId,
        name: "Anonymous",
        colorId: "#b4b39a"
        } )
    }


}

