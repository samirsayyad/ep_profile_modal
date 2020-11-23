"use strict";
const nodemailer = require("nodemailer");
const settings = require('ep_etherpad-lite/node/utils/Settings');
var db = require('ep_etherpad-lite/node/db/DB');

module.exports = {
    sendMail : async (settings,message)=> {
        return new Promise(async(resolve,reject)=>{
            try {
              let transporter = nodemailer.createTransport({
                  host: settings.settingsEmailSmtp,
                  port: settings.settingsEmailPort,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: settings.settingsEmailUser, // generated ethereal user
                    pass: settings.settingsEmailPassword, // generated ethereal password
                  },
                });
                console.log(message)
                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: `${settings.settingsEmailFromName} <${settings.settingsEmailFromEmail}>`, // sender address
                  to: message.to, // list of receivers
                  subject: message.subject, // Subject line
                  //text: message.text,"Hello world?", // plain text body
                  html: message.html, // html body
                });
                resolve(info)
              
            }catch(err){
                reject(err)
            }
      
        })
      
      }
}


