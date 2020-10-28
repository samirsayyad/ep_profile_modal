var shared = require("./shared")

exports.syncAllFormsData = function (userId,data){

    //users List 
        var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
        if(user_selector.length)
        {
            user_selector.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text(data.username);
            user_selector.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(data.about);
            var homepageElem = user_selector.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_homepage").
            children("ep_profile_user_list_profile_homepage_link")
            homepageElem.text(data.homepage);
            homepageElem.attr({"href":shared.getValidUrl(data.homepage)})
        } 
    // users list


    // profile card 

        // $("#ep_profile_users_profile_name").text(data.username)
        // $("#ep_profile_users_profile_desc").text(data.about)
        // $("#ep_profile_users_profile_homepage").attr({"href":data.homepage})
        // $("#ep_profile_users_profile_homepage").text(data.homepage)

    // profile card 

    // profile modal
        $("#ep_profile_modal-username").val(data.username)
        $("#ep_profile_modal-about").val(data.about)
        $("#ep_profile_modal-homepage").val(data.homepage)
        $("#ep_profile_modal-email").val(data.email)
        if(data.verified==true){
            $("#ep_profile_modal_verification").attr("data-verification-status","true")
            $("#ep_profile_modal_verification").text("Verified")
        }else{
            $("#ep_profile_modal_verification").attr("data-verification-status","false")
            $("#ep_profile_modal_verification").text("Send verification email")
        }

        // if(data.push_notification == false)
        //     $("#ep_profile_modal_push_notification").attr('checked','')
        // else
        //     $("#ep_profile_modal_push_notification").attr('checked','checked')

    // profile modal


}

exports.resetProfileModalFields = function(){
    $("#ep_profile_modal-username").val("")
    $("#ep_profile_modal-about").val("")
    $("#ep_profile_modal-homepage").val("")
    $("#ep_profile_modal-email").val("")
}