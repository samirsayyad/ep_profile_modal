var eejs = require('ep_etherpad-lite/node/eejs/');
var db = require('ep_etherpad-lite/node/db/DB');
var async = require('../../src/node_modules/async');
var padMessageHandler = require("ep_etherpad-lite/node/handler/PadMessageHandler");
var padId;
const defaultUserName = "Anonymous"
const emailService = require("./email")
const settings = require('ep_etherpad-lite/node/utils/Settings');
var gravatar = require('gravatar');
const fetch = require('node-fetch');

exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/profileModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/askModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/userListModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/profileForm/modalForm.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/userProfileSection/userProfileSection.html", {}, module);

    return cb();
}

exports.clientVars = async function  (hook, context, callback){
  padId = context.pad.id;
  var user = await db.get("ep_profile_modal:"+context.clientVars.userId+"_"+padId) || {};
  var default_img ='/p/getUserProfileImage/'+context.clientVars.userId+"/"+padId+"t="+context.clientVars.serverTimestamp
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
          profile_image_url: default_img,
          user_email : user.email || "" ,
          user_status : user.status || "1" ,
          userName : user.username || defaultUserName ,
          contributed_authors_count : pad_users.length,
          about : user.about || "",
          homepage : user.homepage || "" ,
          form_passed : user.form_passed || false ,
          verified : user.verified || false ,

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
  var default_img ='/p/getUserProfileImage/'+message.userId+"/"+message.padId+"t="+(new Date().getTime())
  var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {};

  if(message.action ==="ep_profile_modal_info"){
    var form_passed = true
        user.about = message.data.ep_profile_formModal_about_yourself
        user.email =  message.data.ep_profile_modalForm_email
        user.homepage =  message.data.ep_profile_modal_homepage
        user.username =  message.data.ep_profile_modal_name
        user.createDate = (user.createDate) ? user.createDate : new Date() ;
        user.updateDate = new Date() ;

        user.status = "2"
        if (!user.image){
          var profile_url = gravatar.profile_url(user.email, {protocol: 'https' });
          profile_json = await fetch(profile_url) ;
          profile_json = await profile_json.json()
          if (profile_json =="User not found")
            form_passed = false
        }
        form_passed = (user.about=="" || user.email=="" || user.homepage==""|| user.username=="" )? false : form_passed
        user.form_passed =form_passed
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId,user) ;
  }



  if(message.action === 'ep_profile_modal_login'){

    user.createDate = (user.createDate) ? user.createDate : new Date() ;
    user.updateDate = new Date() ;
    user.email = message.email || ""
    user.status = "2"
    user.username = message.name || ""
    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload : {
          padId: message.padId ,
          action:"EP_PROFILE_USER_LOGIN_UPDATE",
          userId: message.userId ,
          img:default_img,
          email : message.email ,
          userName : message.name ,

        }
      },
    }
    sendToRoom(msg)
    sendToChat(message.userId ,message.padId ,message.name)

    // email verification 
    if (message.email){
      var generalUserEmail = await db.get("ep_profile_modal_email:"+message.userId) || {}  ; // for unique email per userId
      if (generalUserEmail.verified != true){
        var confirmCode = new Date().getTime().toString()
        generalUserEmail.confirmationCode = confirmCode
        generalUserEmail.email = message.email
        var html =`<p> Please click on below link</p><p> 
        <a href='https://docs.plus/p/emailConfirmation/${Buffer.from(message.userId).toString('base64')}/
        ${Buffer.from(message.padId).toString('base64')}/
        ${Buffer.from(confirmCode).toString('base64')}
        '>Confirmation link</a> </p>`

        console.log(html)
        emailService.sendMail({
          fromName : settings.ep_profile_modal.email.template.fromName,
          fromEmail : settings.ep_profile_modal.email.template.fromEmail,
          to : message.email ,
          subject : "docs.plus email confirmation",
          html: html
        })
        .then(()=>{
        })
        .catch((err)=>{
          console.log(err)
        })

        db.set("ep_profile_modal_email:"+message.userId, generalUserEmail) 
    }



    }
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId , user)  ;

  }
  if(message.action === "ep_profile_modal_logout"){
    user.status = "1";
    user.lastLogoutDate = new Date();

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload : {
          padId: padId,
          action:"EP_PROFILE_USER_LOGOUT_UPDATE",
          userId: message.userId ,

        }
      },
    }


    sendToRoom(msg)
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId , user)  ;

  }


///////////////////////////////////////
  if(message.action === "ep_profile_modal_ready"){
    var pad_users = await db.get("ep_profile_modal_contributed_"+ padId);
    sendUsersListToAllUsers(pad_users,padId)
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

function emailConfirmationSend(){
  
}

function sendToRoom( msg){
  var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if(bufferAllows){
    setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      try{
        padMessageHandler.handleCustomObjectMessage(msg, false, function(error){
          //console.log(error)
          // TODO: Error handling.
        })
      }catch(error){
        console.log(error)

      }
      
    }
    , 100);
  }
}
function sendToChat(authorID,padID , userName  ){
  try{
    let text = `has logged in.`
    padMessageHandler.sendChatMessageToPadClients(new Date().valueOf(), authorID, text, padID ,"PLUGIN");
 
  }catch(error){
    console.log(error)

  }

}
async function sendUsersListToAllUsers(pad_users,padId){
  var all_users_list =[]
  async.forEach(pad_users ,async function(value , cb ){
    var user = await db.get("ep_profile_modal:"+value+"_"+padId) || {};
    var default_img ='/p/getUserProfileImage/'+value+"/"+padId+"t="+(new Date().getTime())

    all_users_list.push({
      userId : value ,
      email : user.email||"" ,
      status : user.status ||"1" ,
      userName : user.username  || defaultUserName,
      imageUrl : default_img , 
      about : user.about || "",
      homepage : user.homepage || "" ,
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


