'use strict';
const nodemailer = require('nodemailer');

module.exports = {
  sendMail: async (settings, message) => new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: settings.settingsEmailSmtp,
        port: settings.settingsEmailPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: settings.settingsEmailUser, // generated ethereal user
          pass: settings.settingsEmailPassword, // generated ethereal password
        },
      });
        // send mail with defined transport object
      const info = transporter.sendMail({
        from: `${settings.settingsEmailFromName} <
        ${settings.settingsEmailFromEmail}>`, // sender address
        to: message.to, // list of receivers
        subject: message.subject, // Subject line
        // text: message.text,"Hello world?", // plain text body
        html: message.html, // html body
      });
      resolve(info);
    } catch (err) {
      reject(err);
    }
  }),
};
