var eejs = require('ep_etherpad-lite/node/eejs/');
var db = require('ep_etherpad-lite/node/db/DB');
var gravatar = require('gravatar');
const fetch = require('node-fetch');
var socketio;
var padId;

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
  //console.log(padMessageHandler)
  //console.log(context.clientVars)
  var padId = context.pad.id;

  console.log(context.clientVars.userId)
  var user_email = await db.get("email:"+context.clientVars.userId);
  var user_status = await db.get("status:"+context.clientVars.userId);

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
            user_status : user_status ,
            userName : (context.clientVars.userName) ? context.clientVars.userName : "Anonymous"
        }
    });
}

/*
* Handle incoming messages from clients
*/
exports.handleMessage = async function(hook_name, context, callback){
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
  if(message.action === 'ep_profile_modal_login'){
    console.log(context)
    db.set("email:"+message.userId, message.email);
    db.set("status:"+message.userId, "2");

    var httpsUrl = gravatar.url(message.email, {protocol: 'https', s: '200'});
    //var profile_url = gravatar.profile_url(message.email, {protocol: 'https' });
    // var message = {data:{
    //   type:"CUSTOM",
    //   action : 'USER_IMAGE',
    //   httpsUrl : httpsUrl,
    //   profile_url :  profile_url ,

    //   }}
      //console.log(padMessageHandler.handleCustomObjectMessage(message ,context.client.id ))
      var msg = {
        type: "CUSTOM",
        userId: message.userId ,
        data: {
          type: "EP_PROFILE_IMAGE",
          payload : {
            // profile_img : httpsUrl,
            userId: message.userId ,
            from: message.userId,
            data:httpsUrl,
            email : message.email ,
            userName : message.name ,
            padId: padId,

          }
        },
      }
      socketio.sockets.sockets[context.client.id].json.send(msg)


  }
  if(message.action === "ep_profile_modal_logout"){
    db.set("status:"+message.userId, "1");
    // var msg = {
    //   type: "COLLABROOM",
    //   data: {
    //     type: "USER_IMAGE",
    //     action :"USER_IMAGE",
    //   },
    // }
    // socketio.sockets.sockets[context.client.id].json.send(msg)


  }

  
  if(isProfileMessage === true){
    callback([null]);
  }else{
    callback(true);
  }
}

exports.socketio = function (hook, context, callback)
{
  socketio = context.io;
  callback();
};