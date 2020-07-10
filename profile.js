var eejs = require('ep_etherpad-lite/node/eejs/');
var db = require('ep_etherpad-lite/node/db/DB');
var gravatar = require('gravatar');
const fetch = require('node-fetch');

var padMessageHandler = require("../../src/node/handler/PadMessageHandler");

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
  console.log(context.clientVars)
  console.log(context.clientVars.userId)
  var user_email = await db.get("email:"+context.clientVars.userId);
  console.log("res : ", user_email)

  var httpsUrl = gravatar.url(user_email, {protocol: 'https', s: '200'});
  var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
  var profile_json = null;
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
            user_email : user_email ,
        }
    });
}

/*
* Handle incoming messages from clients
*/
exports.handleMessage = async function(hook_name, context, callback){
    // Firstly ignore any request that aren't about chat
    var isProfileMessage = false;
    if(context){
      if(context.message && context.message){
        if(context.message.type === 'COLLABROOM'){
          if(context.message.data){
            if(context.message.data.type){
              if(context.message.data.type === 'ep_profile_modal'){
                isProfileMessage = true;
              }
            }
          }
        }
      }
    }


  if(!isProfileMessage){
    callback(false);
    return false;
  }

  var message = context.message.data;
  if(message.action === 'ep_profile_modal_send_email'){
    db.set("email:"+message.userId, message.email);
  }

  if(isProfileMessage === true){
    callback([null]);
  }else{
    callback(true);
  }
}

