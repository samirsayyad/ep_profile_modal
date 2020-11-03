const shared = require("../helpers/shared")
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const etherpadFuncs = require("../helpers/etherpadSharedFunc")
const db = require('ep_etherpad-lite/node/db/DB');
const async = require('../../../../src/node_modules/async');
const staticVars = require("../helpers/statics")


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
  
    if(message.action ==="ep_profile_modal_info"){
        ep_profile_modal_info(message)
    }

    if(message.action === 'ep_profile_modal_login'){
        ep_profile_modal_login(message)
    }

    // if(message.action==="ep_profile_modal_send_signout_message"){
    //     ep_profile_modal_send_signout_message(message)
    // }

    if(message.action === "ep_profile_modal_logout"){
        ep_profile_modal_logout(message)
    }

    if(message.action === "EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT"){
        EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT(message)
    }
    
    if(message.action === "ep_profile_modal_ready"){
        ep_profile_modal_ready(message)
    }

    if(isProfileMessage === true){
        callback([null]);
    }else{
        callback(true);
    }
}


// const ep_profile_modal_send_signout_message = async function(message){
//     var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {}; 
// }


const ep_profile_modal_login = async function(message){
    var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {};
    var default_img ='/p/getUserProfileImage/'+message.userId+"/"+message.padId+"t="+(new Date().getTime())

    user.createDate = (user.createDate) ? user.createDate : new Date() ;
    user.updateDate = new Date() ;
    user.email = message.email || ""
    user.status = "2"
    user.username = message.name || ""
    user.userId = message.userId

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
          user : user

        }
      },
    }
    etherpadFuncs.sendToRoom(msg)

  
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId , user)  ;

    // change primary key to email
    if(message.email){
      await db.set("ep_profile_modal:"+message.email , user)  ;

      ///// store users in email way 
      // email collecting users
      var datetime = new Date();
      var _timestamp = datetime.getTime()
      var _date = datetime.toISOString().slice(0,10) 
      var email_contributed_users = await db.get("ep_profile_modal_email_contributed_"+message.padId) || [];
      var lastUserIndex = email_contributed_users.findIndex(i => i.email ===message.email );
      if(lastUserIndex !== -1){
        email_contributed_users[lastUserIndex].data.last_seen_timestamp = _timestamp
        email_contributed_users[lastUserIndex].data.last_seen_date = _date
      }else{
        email_contributed_users.push({
          email : message.email,
          data : {
            "last_seen_timestamp" :_timestamp,
            "last_seen_date" : _date ,
            "created_at_timestamp" :_timestamp,
            "created_at_date" : _date ,
          }
        })
      }
    
      db.set("ep_profile_modal_email_contributed_"+message.padId,email_contributed_users);
      // remove user id from contributed users because we have email now
      var pad_users = await db.get("ep_profile_modal_contributed_"+message.padId);
      var indexOfUserId= pad_users.indexOf(message.userId);
      if (indexOfUserId != -1){
        pad_users.splice(indexOfUserId, 1);
        db.set("ep_profile_modal_contributed_"+message.padId , pad_users);
      }
      // remove user id from contributed users because we have email now
      //// store users in email way
    }
    // change primary key to email
}


const ep_profile_modal_info = async function(message){

    var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {};
    var default_img ='/p/getUserProfileImage/'+message.userId+"/"+message.padId+"t="+(new Date().getTime())
    var form_passed = true
        user.about = message.data.ep_profile_modalForm_about_yourself
        user.email =  message.data.ep_profile_modalForm_email
        user.homepage =  shared.getValidUrl(message.data.ep_profile_modalForm_homepage)
        user.username =  message.data.ep_profile_modalForm_name
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

    //send everybody
    var msg = {
        type: "COLLABROOM",
        data: {
        type: "CUSTOM",
        payload : {
            padId: message.padId ,
            action:"EP_PROFILE_USER_LOGIN_UPDATE",
            userId: message.userId ,
            img:default_img,
            email : user.email ,
            userName : user.username ,
            user : user
        }
        },
    }
    etherpadFuncs.sendToRoom(msg)
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId,user) ;

}


const ep_profile_modal_logout = async function(message){
    var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {};
    user.status = "1";
    user.lastLogoutDate = new Date();

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload : {
          padId:  message.padId,
          action:"EP_PROFILE_USER_LOGOUT_UPDATE",
          userId: message.userId ,

        }
      },
    }


    etherpadFuncs.sendToRoom(msg)
    await db.set("ep_profile_modal:"+message.userId+"_"+message.padId , {})  ; //empty session
    if (user.username!=="" && user.username){
      var chatMsg = {}
      chatMsg.text = `<b>${user.username}${(user.about) ? `, ${user.about}`  : ``} has left. ${(user.homepage !=="" || user.homepage) ? ` Find them at <a target='_blank' href='${shared.getValidUrl(user.homepage)}'>${user.homepage}</a>` : ``} </b>`
      chatMsg.target = "profile";
      chatMsg.userId = message.userId
      chatMsg.time = new Date()
      var msg = {
        type: "COLLABROOM",
        data: {
          type: "CUSTOM",
          payload : {
            padId:  message.padId,
            action:"EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT",
            userId: message.userId ,
            msg : chatMsg
          }
        },
      }
      etherpadFuncs.sendToRoom(msg)
    }else{
      console.log("data not set")
    }

}

const EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT= async function(message){
    var msg = {
        type: "COLLABROOM",
        data: {
          type: "CUSTOM",
          payload : {
            padId:  message.padId,
            action:"EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT",
            userId: message.userId ,
            msg : message.data
          }
        },
      }
      etherpadFuncs.sendToRoom(msg)
}

const ep_profile_modal_ready= async function (message){
    var pad_users = await db.get("ep_profile_modal_contributed_"+ message.padId) || [];
    //sendUsersListToAllUsers(pad_users,message.padId)
    ///////////
    var all_users_list =[]

    var datetime = new Date();
    var today = datetime.toISOString().slice(0,10) 
    var yesterday = new Date(datetime)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday = yesterday.toISOString().slice(0,10) 
    //if(pad_users){
        async.forEach(pad_users ,async function(value , cb ){
        var user = await db.get("ep_profile_modal:"+value+"_"+message.padId) || {};
        var default_img ='/p/getUserProfileImage/'+value+"/"+message.padId+"?t="+(new Date().getTime())
    
        all_users_list.push({
            userId : value ,
            email : user.email||"" ,
            status : user.status ||"1" ,
            userName : user.username  || staticVars.defaultUserName,
            imageUrl : default_img , 
            about : user.about || "",
            homepage : shared.getValidUrl( user.homepage) || "" ,
            last_seen_date :(( user.last_seen_date == today) ? "today" : ( user.last_seen_date == yesterday) ? "yesterday" : user.last_seen_date ) || "" ,
            last_seen_timestamp : user.last_seen_timestamp || 0 ,
    
        })
    
        cb();
    
        },async function(err){// callback after foreach finished
          var email_contributed_users = await db.get("ep_profile_modal_email_contributed_"+message.padId) || [];
          console.log("before foreach number 2 ",email_contributed_users)  

          // again start a foreach for email 
          async.forEach(email_contributed_users ,async function(value , cb ){
            var user = await db.get("ep_profile_modal:"+value.email) || {};
            var default_img ='/p/getUserProfileImage/'+value.email+"/"+message.padId+"?t="+(new Date().getTime())
        
            all_users_list.push({
                userId : user.userId ,
                email : user.email||"" ,
                status : user.status ||"1" ,
                userName : user.username  || staticVars.defaultUserName,
                imageUrl : default_img , 
                about : user.about || "",
                homepage : shared.getValidUrl( user.homepage) || "" ,
                last_seen_date :(( user.last_seen_date == today) ? "today" : ( user.last_seen_date == yesterday) ? "yesterday" : user.last_seen_date ) || "" ,
                last_seen_timestamp : user.last_seen_timestamp || 0 ,
        
            })

          },async function(err){ // callback after foreach finished

            console.log("foreach number 2 ",email_contributed_users,all_users_list)  

            all_users_list.sort((a,b) => (a.last_seen_timestamp < b.last_seen_timestamp) ? 1 : ((b.last_seen_timestamp < a.last_seen_timestamp) ? -1 : 0)); 
    
            var msg = {
                type: "COLLABROOM",
                data: {
                type: "CUSTOM",
                payload : {
                    padId: message.padId,
                    action:"EP_PROFILE_USERS_LIST",
                    list :all_users_list ,
        
        
                }
                },
            }
            etherpadFuncs.sendToRoom(msg)
          })
          // again start a foreach for email 

    
          console.log("foreach number 1 ",pad_users,all_users_list)  

        })
    //}
    ///////////
    var datetime = new Date();
    var _timestamp = datetime.getTime()
    var _date = datetime.toISOString().slice(0,10) 
    ////// store pads of users
    var pads_of_user = await db.get("ep_profile_modal_pads_of_user_"+ message.userId) || [];
    var lastUserIndex = pads_of_user.findIndex(i => i.padId === padId );
    if(lastUserIndex !== -1 ){
      pads_of_user[lastUserIndex].data.last_seen_date = _date
      pads_of_user[lastUserIndex].data.last_seen_timestamp = _timestamp
    }else{
      pads_of_user.push({
      padId :message.padId,
        data : {
          "last_seen_timestamp" :_timestamp,
          "last_seen_date" : _date ,
          "created_at_timestamp" :_timestamp,
          "created_at_date" : _date ,
        }
      })
    }
    db.set("ep_profile_modal_pads_of_user_"+ message.userId,pads_of_user)



    ////// store pads of users




}