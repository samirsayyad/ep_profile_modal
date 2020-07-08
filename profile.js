var eejs = require('ep_etherpad-lite/node/eejs/');
var gravatar = require('gravatar');
var httpsUrl = gravatar.url('samir.saiad@gmail.com', {protocol: 'https', s: '100'});
var profile_url = gravatar.profile_url('samir.saiad@gmail.com', {protocol: 'https' });


exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/profileModal.html", {profile_image_url: httpsUrl}, module);
    return cb();
}

exports.clientVars = function  (hook, context, callback){

    console.log(httpsUrl , "here")
    return callback({
        ep_profile_modal: {
            profile_image_url: httpsUrl,
            profile_url : profile_url
        }
    });
}