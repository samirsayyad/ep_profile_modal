var gravatar = require('gravatar');

exports.aceInitialized = function(hook, context){
    var httpsUrl = gravatar.url('samir.saiad@gmail.com', {protocol: 'https', s: '50'});

    $("body").append("<div class='ep_profile_modal' id='ep_profile_modal'></div>")
    $("#pad_title").append("<div id='ep-profile-button'><img src='"+httpsUrl+"' /></div>")
}