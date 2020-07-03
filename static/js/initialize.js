
exports.aceInitialized = function(hook, context){
    console.log(clientVars)
    $("body").append("<div class='ep_profile_modal' id='ep_profile_modal'></div>")
    $("#pad_title").append("<div id='ep-profile-button'><img src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
}