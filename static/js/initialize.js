exports.aceInitialized = function(hook, context){
    $("body").append("<div class='ep_profile_modal' id='ep_profile_modal'></div>")
    $("#pad_title").append("<div id='ep-profile-button'>Profile</div>")
}