var eejs = require('ep_etherpad-lite/node/eejs/');
var gravatar = require('gravatar');
const fetch = require('node-fetch');
var user_email = 'asamir.saiad@gmail.com' ;
var httpsUrl = gravatar.url(user_email, {protocol: 'https', s: '200'});
var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
var profile_json = null;

exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/profileModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/askModal.html", {}, module);

    return cb();
}

exports.clientVars = async function  (hook, context, callback){

    //console.log(httpsUrl , "here")
    

    profile_json = await fetch(profile_url) ;
    profile_json = await profile_json.json()
    console.log(profile_json  +  " jjjjjjjj")

    if (profile_json !="User not found")
        profile_json = profile_json.entry[0]
    else
        profile_json = null 
    //console.log(profile_json.entry[0] +  " jjjjjjjj")
    return callback({
        ep_profile_modal: {
            profile_image_url: httpsUrl,
            profile_json : profile_json  ,
            user_email : user_email
        }
    });
}

