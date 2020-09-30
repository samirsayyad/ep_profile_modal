"use strict";
const nodemailer = require("nodemailer");
const settings = require('ep_etherpad-lite/node/utils/Settings');

module.exports = {
    sendMail : async (message)=> {
        var params = settings.ep_profile_modal.email
        return new Promise((resolve,reject)=>{
            try {
              let transporter = nodemailer.createTransport({
                  host: params.smtp,
                  port: params.port,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: params.user, // generated ethereal user
                    pass: params.pass, // generated ethereal password
                  },
                });
              
                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: `${message.fromName} <${message.fromEmail}>`, // sender address
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


