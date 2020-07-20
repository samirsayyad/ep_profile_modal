var eejs = require('ep_etherpad-lite/node/eejs/');
var db = require('ep_etherpad-lite/node/db/DB');
//var API = require('ep_etherpad-lite/node/db/API.js');
var padMessageHandler = require("ep_etherpad-lite/node/handler/PadMessageHandler");
var gravatar = require('gravatar');
const fetch = require('node-fetch');
var socketio;
var padId;

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
  var padId = context.pad.id;
  //console.log("all author list of pad ",padId, await API.listAuthorsOfPad(padId))
  var user_email = await db.get("ep_profile_modal_email:"+context.clientVars.userId);
  var user_status = await db.get("ep_profile_modal_status:"+context.clientVars.userId);




  //* collect user If just enter to pad */
  var pad_users = await db.get("ep_profile_modal_contributed_"+padId);
  if (pad_users){
    if (pad_users.indexOf(context.clientVars.userId) == -1){
      pad_users.push(context.clientVars.userId)
      db.set("ep_profile_modal_contributed_"+padId , pad_users);


      // tell everybody that total user has been changed
      //totalUserHasBeenChanged(pad_users.length)
        var msg = {
          type: "COLLABROOM",
          data: {
            type: "CUSTOM",
            payload : {
              totalUserCount : pad_users.length,
              padId: padId,
              action:"totalUserHasBeenChanged",
      
            }
          },
        }
        sendToRoom(msg)
      // tell everybody that total user has been changed




    }
  }else{
    pad_users = [ context.clientVars.userId ]
    db.set("ep_profile_modal_contributed_"+padId , pad_users);
  }


  //* collect user If just enter to pad */


  var httpsUrl = gravatar.url(user_email, {protocol: 'https', s: '200'});
  var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
  var profile_json = null;
  profile_json = await fetch(profile_url) ;
  profile_json = await profile_json.json()


  if (profile_json !="User not found")
      profile_json = profile_json.entry[0]
  else
      profile_json = null 
    return callback({
        ep_profile_modal: {
            profile_image_url: httpsUrl,
            profile_json : profile_json  ,
            user_email : user_email ,
            user_status : user_status ,
            userName : (context.clientVars.userName) ? context.clientVars.userName : "Anonymous" ,
            contributed_authors_count : pad_users.length
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
    db.set("ep_profile_modal_email:"+message.userId, message.email);
    db.set("ep_profile_modal_status:"+message.userId, "2");

    var httpsUrl = gravatar.url(message.email, {protocol: 'https', s: '200'});
    var msg = {
      type: "CUSTOM",
      userId: message.userId ,
      data: {
        type: "EP_PROFILE_IMAGE",
        payload : {
          // profile_img : httpsUrl,
          userId: message.userId ,
          //from: message.userId,
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
    db.set("ep_profile_modal_status:"+message.userId, "1");
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


function sendToRoom( msg){
  var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if(bufferAllows){
    setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      padMessageHandler.handleCustomObjectMessage(msg, false, function(){
        // TODO: Error handling.
      })
    }
    , 100);
  }
}
