
var db = require('ep_etherpad-lite/node/db/DB');
const shared = require("../helpers/shared")
const etherpadFuncs = require("../helpers/etherpadSharedFunc")
const staticVars = require("../helpers/statics")
exports.clientVars = async function  (hook, context, callback){
    padId = context.pad.id;
    var user = await db.get("ep_profile_modal:"+context.clientVars.userId+"_"+padId) || {};
    var default_img ='/p/getUserProfileImage/'+context.clientVars.userId+"/"+padId+"t="+context.clientVars.serverTimestamp

    //* collect user If just enter to pad */
    var pad_users = await db.get("ep_profile_modal_contributed_"+padId);
    //// counting how many email input
    var email_contributed_users = await db.get("ep_profile_modal_email_contributed_"+padId) || [];
    console.log(email_contributed_users,"email_contributed_users")

    //// counting how many email input
    
    console.log(pad_users,"pad_users")
    if (pad_users){
      if (pad_users.indexOf(context.clientVars.userId) == -1){
        if(!user.email && user.verified){ // as we are using etherpad userid as session, we should not store user id if they input their email address
          pad_users.push(context.clientVars.userId)
          db.set("ep_profile_modal_contributed_"+padId , pad_users);
        }
        // tell everybody that total user has been changed
          var msg = {
            type: "COLLABROOM",
            data: {
              type: "CUSTOM",
              payload : {
                totalUserCount : pad_users.length  + email_contributed_users.length,
                padId: padId,
                action:"totalUserHasBeenChanged",
        
              }
            },
          }
          etherpadFuncs.sendToRoom(msg)
        // tell everybody that total user has been changed
      }
    }else{
      if(!user.email && user.verified){ // as we are using etherpad userid as session, we should not store user id if they input their email address
        pad_users = [ context.clientVars.userId ]
        db.set("ep_profile_modal_contributed_"+padId , pad_users);
      }
    }
    //* collect user If just enter to pad */





    var verified_users = await db.get("ep_profile_modal_verified_"+padId);
  
    var datetime = new Date();
    user.last_seen_timestamp = datetime.getTime()
    user.last_seen_date = datetime.toISOString().slice(0,10) 
    db.set("ep_profile_modal:"+context.clientVars.userId+"_"+padId,user)
  
    var email_verified =false
  
  
    return callback({
        ep_profile_modal: {
            profile_image_url: default_img,
            user_email : user.email || "" ,
            user_status : user.status || "1" ,
            userName : user.username || staticVars.defaultUserName ,
            contributed_authors_count : pad_users.length + email_contributed_users.length,
            about : user.about || "",
            homepage : shared.getValidUrl(user.homepage) || "" ,
            form_passed : user.form_passed || false ,
            verified : user.verified || email_verified ,
            verified_users : verified_users
  
        }
    });
  }