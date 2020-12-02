
var db = require('ep_etherpad-lite/node/db/DB');
const shared = require("../helpers/shared")
const etherpadFuncs = require("../helpers/etherpadSharedFunc")
const staticVars = require("../helpers/statics")
exports.clientVars = async function  (hook, context, callback){
    padId = context.pad.id;
    var user = await db.get("ep_profile_modal:"+context.clientVars.userId+"_"+padId) || {};
    var default_img ='/p/getUserProfileImage/'+context.clientVars.userId+"/"+padId+"t="+context.clientVars.serverTimestamp
    var datetime = new Date();
    user.last_seen_timestamp = datetime.getTime()
    user.last_seen_date = datetime.toISOString().slice(0,10) 
    db.set("ep_profile_modal:"+context.clientVars.userId+"_"+padId,user)

    //* collect user If just enter to pad */
    //// counting how many email input
    
  
    var email_verified =false
  
  
    return callback({
        ep_profile_modal: {
            profile_image_url: default_img,
            user_email : user.email || "" ,
            user_status : user.status || "1" ,
            userName : user.username || staticVars.defaultUserName ,
            //contributed_authors_count : pad_users.length + email_contributed_users.length,
            about : user.about || "",
            homepage : shared.getValidUrl(user.homepage) || "" ,
            form_passed : user.form_passed || false ,
            verified : user.verified || email_verified ,
            //verified_users : verified_users
  
        }
    });
  }