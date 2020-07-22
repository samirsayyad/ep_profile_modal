var eejs = require('ep_etherpad-lite/node/eejs/');
var db = require('ep_etherpad-lite/node/db/DB');
var async = require('../../src/node_modules/async');
var padMessageHandler = require("ep_etherpad-lite/node/handler/PadMessageHandler");
var gravatar = require('gravatar');
const fetch = require('node-fetch');
var socketio;
var padId;
const defaultImg = "../static/plugins/ep_profile_modal/static/img/user.png"
const defaultUserName = "Anonymous"

exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/profileModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/askModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/userListModal.html", {}, module);

    return cb();
}

exports.clientVars = async function  (hook, context, callback){
  padId = context.pad.id;
  var profile_json = null;
  var user_email = await db.get("ep_profile_modal_email:"+context.clientVars.userId);
  var user_status = await db.get("ep_profile_modal_status:"+context.clientVars.userId);
  if(user_email){
    var httpsUrl = gravatar.url(user_email, {protocol: 'https', s: '200'});
    var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
    profile_json = await fetch(profile_url) ;
    profile_json = await profile_json.json()
    if (profile_json !="User not found")
        profile_json = profile_json.entry[0]
    else
        profile_json = null 
  }



  

//* collect user If just enter to pad */
  var pad_users = await db.get("ep_profile_modal_contributed_"+padId);
  if (pad_users){
    if (pad_users.indexOf(context.clientVars.userId) == -1){
      pad_users.push(context.clientVars.userId)
      db.set("ep_profile_modal_contributed_"+padId , pad_users);


      // tell everybody that total user has been changed
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


  return callback({
      ep_profile_modal: {
          profile_image_url: (profile_json != null ) ?  httpsUrl : defaultImg,
          profile_json : profile_json  ,
          user_email : user_email ,
          user_status : user_status ,
          userName : (context.clientVars.userName) ? context.clientVars.userName : defaultUserName ,
          contributed_authors_count : pad_users.length,
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
    db.set("ep_profile_modal_email:"+message.userId, message.email);
    db.set("ep_profile_modal_status:"+message.userId, "2");
    db.set("ep_profile_modal_username:"+message.userId, message.name);

    var profile_image = await checkUserExistInGravatar(message.email)
    console.log("1",profile_image)

    profile_image = (profile_image) ? profile_image : defaultImg
    console.log("12",profile_image)
    // var msg = {
    //   type: "CUSTOM",
    //   userId: message.userId ,
    //   data: {
    //     type: "EP_PROFILE_IMAGE",
    //     payload : {
    //       userId: message.userId ,
    //       data:profile_image,
    //       email : message.email ,
    //       userName : message.name ,
    //       padId: padId,

    //     }
    //   },
    // }

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload : {
          padId: padId,
          action:"EP_PROFILE_USER_LOGIN_UPDATE",
          userId: message.userId ,
          img:profile_image,
          email : message.email ,
          userName : message.name ,
          padId: padId,
        }
      },
    }
    sendToRoom(msg)
    //socketio.sockets.sockets[context.client.id].json.send(msg)
    // var pad_users = await db.get("ep_profile_modal_contributed_"+padId);
    // sendUsersListToAllUsers(pad_users,message.userId)
    
  }
  if(message.action === "ep_profile_modal_logout"){
    db.set("ep_profile_modal_status:"+message.userId, "1");
  }

  if(message.action === "ep_profile_modal_ready"){
    var pad_users = await db.get("ep_profile_modal_contributed_"+ padId);
    console.log(pad_users , "going to parse")
    sendUsersListToAllUsers(pad_users)
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

exports.clientReady = async function(hook, message) {
  console.log('Client has entered the pad' + message.padId + message);
  console.log(message)


};


function sendToRoom( msg){
  console.log("er are sending ." ,msg)
  var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if(bufferAllows){
    setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      try{
        padMessageHandler.handleCustomObjectMessage(msg, false, function(error){
          console.log(error)
          // TODO: Error handling.
        })
      }catch(error){
        console.log(error)

      }
      
    }
    , 100);
  }
}

async function sendUsersListToAllUsers(pad_users){
  var all_users_list =[]
  async.forEach(pad_users ,async function(value , cb ){
    let temp_email = await db.get("ep_profile_modal_email:"+value);
    let temp_status = await db.get("ep_profile_modal_status:"+value);
    let temp_username = await db.get("ep_profile_modal_username:"+value);
    let temp_profile_url = gravatar.profile_url(temp_email, {protocol: 'https' });
    temp_profile_json = await fetch(temp_profile_url) ;
    temp_profile_json = await temp_profile_json.json()
    if (temp_profile_json =="User not found"){
      var temp_imageUrl = defaultImg

    }else{
      var temp_imageUrl = gravatar.url(temp_email, {protocol: 'https', s: '200'});

    }

    all_users_list.push({
      userId : value ,
      email : temp_email ,
      status : temp_status ,
      userName : (temp_username ) ? temp_username : defaultUserName,
      imageUrl : temp_imageUrl
    })

    cb();

  },function(err){

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload : {
          padId: padId,
          action:"EP_PROFILE_USERS_LIST",
          list :all_users_list ,
          //userId :userId // context.clientVars.userId
        }
      },
    }
    sendToRoom(msg)
  })

}


async function checkUserExistInGravatar(user_email){
  var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
  var profile_json = null ;
  var profile_img = false ;
  profile_json = await fetch(profile_url) ;
  profile_json = await profile_json.json()
  
  if (profile_json !="User not found"){
    profile_img = gravatar.url(user_email, {protocol: 'https', s: '200'});
    return profile_img
  }else{
    return false
  }
  
}