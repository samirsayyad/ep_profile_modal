const db = require('ep_etherpad-lite/node/db/DB');
const defaultImg = '/static/plugins/ep_profile_modal/static/dist/img/user-blue.png';
const defaultImgUserOff = '/static/plugins/ep_profile_modal/static/dist/img/user.png';
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const Busboy = require('busboy');
const uuid = require('uuid');
const path = require('path');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const AWS = require('aws-sdk');
const resizeImg = require('resize-img');
const sizeOf = require('buffer-image-size');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const emailService = require('../services/email');
const getContributors_limit = 25 ;
const staticVars = require('../helpers/statics');
const shared = require('../helpers/shared');
const async = require('../../../../src/node_modules/async');

exports.expressConfigure = (hookName, context) => {


  /////////       getContributors         //////////////////////
  context.app.get('/static/:padId/pluginfw/ep_profile_modal/getContributors/:page', async (req, res, next) => {
    const padId = req.params.padId;
    var page = parseInt(req.params.page) || 1;
    var pad_users = await db.get(`ep_profile_modal_contributed_${padId}`) || [];
    var all_users_list = [];
    var datetime = new Date();
    const today = datetime.toISOString().slice(0, 10);
    let yesterday = new Date(datetime);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.toISOString().slice(0, 10);
    var offset = (page - 1) * getContributors_limit;
    var maxPaginated = parseInt(offset) + parseInt(getContributors_limit)
    var lastPage = (pad_users.length > maxPaginated) ?  false : true 
    var slicedArray = pad_users.splice(offset, getContributors_limit);

    await async.map(slicedArray ,async(value) => {
      var user = await db.get(`ep_profile_modal:${value}_${padId}`) || {};
      var default_img = `/static/getUserProfileImage/${value}/${padId}?t=${new Date().getUTCDay()}`;

      all_users_list.push({
        userId: value,
        email: user.email || '',
        status: user.status || '1',
        userName: user.username || staticVars.defaultUserName,
        imageUrl: default_img,
        about: user.about || '',
        homepage: shared.getValidUrl(user.homepage) || '',
        last_seen_date: ((user.last_seen_date == today) ? 'today' : (user.last_seen_date == yesterday) ? 'yesterday' : user.last_seen_date) || '',
        last_seen_timestamp: user.last_seen_timestamp || 0,

      });
    });
    return res.status(201).json({data : all_users_list,lastPage:lastPage});

  });
  /////////       getContributors         //////////////////////


  context.app.get('/static/:padId/pluginfw/ep_profile_modal/getUserInfo/:userId', async (req, res, next) => {
    const padId = req.params.padId;
    const userId = req.params.userId;
    const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
    user.homepage = getValidUrl(user.homepage) || '';
    return res.status(201).json({user});
  });
  // comes from users email when they already recieved an email for this
  context.app.get('/static/emailConfirmation/:userId/:padId/:confirmCode', async (req, res, next) => {
    const settings = await db.get('ep_profile_modal_settings') || {};
    const userId = Buffer.from(req.params.userId, 'base64').toString('ascii');
    const padId = Buffer.from(req.params.padId, 'base64').toString('ascii');
    const confirmCode = Buffer.from(req.params.confirmCode, 'base64').toString('ascii');

    const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
    if (user.confirmationCode === confirmCode) {
      if (user.image !== '' && user.image !== 'reset' && user.image) { user.image = await moveImageToAccount(userId, padId, user.email, user.image) || user.image; }
      user.confirmationCode = 0;
      user.verified = true;
      user.updateDate = new Date();
      user.verifiedDate = new Date();
      db.set(`ep_profile_modal:${userId}_${padId}`, user);

      // for global session
      db.set(`ep_profile_modal:${userId}`, user); // for global session
      // for global session

      // gathering verified user id of pads
      let verified_users = await db.get(`ep_profile_modal_verified_${padId}`);
      if (verified_users) {
        if (verified_users.indexOf(userId) == -1) {
          verified_users.push(userId);
        }
      } else {
        verified_users = [userId];
      }
      db.set(`ep_profile_modal_verified_${padId}`, verified_users);
      // gathering verified user id of pads

      // gathering verified email of pads
      var verified_emails = await db.get(`ep_profile_modal_verified_email_${padId}`);
      if (verified_emails) {
        if (verified_emails.indexOf(user.email) == -1) {
          verified_emails.push(user.email);
        }
      } else {
        verified_emails = [user.email];
      }
      db.set(`ep_profile_modal_verified_email_${padId}`, verified_emails);
      // gathering verified email of pads

      // gathering verified emails
      var verified_emails = await db.get('ep_profile_modal_verified_emails');
      if (verified_emails) {
        if (verified_emails.indexOf(user.email) == -1) {
          verified_emails.push(user.email);
        }
      } else {
        verified_emails = [user.email];
      }
      db.set('ep_profile_modal_verified_emails', verified_emails);
      // gathering verified emails


      // upsert general data on each validation.
      const emailUser = await db.get(`ep_profile_modal:${user.email}`);
      if (emailUser) { user.pads = emailUser.pads || []; } // store pads of verified users
      if (user.pads) {
        if (user.pads.indexOf(padId) == -1) {
          user.pads.push(padId);
        }
      } else {
        user.pads = [padId];
      }
      db.set(`ep_profile_modal:${user.email}`, user);
      // upsert general data on each validation.


      // /// store users in email way
      // email collecting users
      const datetime = new Date();
      const _timestamp = datetime.getTime();
      const _date = datetime.toISOString().slice(0, 10);
      const email_contributed_users = await db.get(`ep_profile_modal_email_contributed_${padId}`) || [];
      const lastUserIndex = email_contributed_users.findIndex((i) => i.email === user.email);
      if (lastUserIndex !== -1) {
        email_contributed_users[lastUserIndex].data.last_seen_timestamp = _timestamp;
        email_contributed_users[lastUserIndex].data.last_seen_date = _date;
      } else {
        email_contributed_users.push({
          email: user.email,
          data: {
            last_seen_timestamp: _timestamp,
            last_seen_date: _date,
            created_at_timestamp: _timestamp,
            created_at_date: _date,
          },
        });
      }

      db.set(`ep_profile_modal_email_contributed_${padId}`, email_contributed_users);
      // remove user id from contributed users because we have email now
      const pad_users = await db.get(`ep_profile_modal_contributed_${padId}`);
      const indexOfUserId = pad_users.indexOf(userId);
      if (indexOfUserId != -1) {
        pad_users.splice(indexOfUserId, 1);
        db.set(`ep_profile_modal_contributed_${padId}`, pad_users);
      }
      // remove user id from contributed users because we have email now
      // // store users in email way
    }
    if (settings.redirectToPad)
      return res.redirect(`/${padId}`);
    else
      return res.redirect(`/`);

  });
  context.app.get('/static/getUserProfileImage/:userId/:padId', async (req, res, next) => {
    let profile_json = null;
    let httpsUrl = null;
    const user = await db.get(`ep_profile_modal:${req.params.userId}_${req.params.padId}`) || {};
    if (user.status == '2') { // logged in
      if (user.image && user.image != 'reset') {
        const s3 = new AWS.S3({
          accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
          secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
          endpoint: settings.ep_profile_modal.storage.endPoint,
          s3ForcePathStyle: true, // needed with minio?
          signatureVersion: 'v4',
        });
        try {
          const params = {Bucket: settings.ep_profile_modal.storage.bucket, Key: `${user.image}`};
          s3.getObject(params, (err, data) => {
            if (data) {
              res.writeHead(200, {'Content-Type': 'image/jpeg'});
              res.write(data.Body, 'binary');
              res.end(null, 'binary');
            } else {
              res.end(null, 'binary');
            }
          });
        } catch (error) {
        }
      } else {
        const profile_url = gravatar.profile_url(user.email, {protocol: 'https'});
        profile_json = await fetch(profile_url);
        profile_json = await profile_json.json();
        if (profile_json != 'User not found') { httpsUrl = gravatar.url(user.email, {protocol: 'https', s: '200'}); } else { profile_json = null; }

        return res.redirect((profile_json != null) ? httpsUrl : defaultImg);
      }
    } else {
      return res.redirect(defaultImgUserOff);
    }
  });
  // for sending email validation
  context.app.get('/static/:padId/pluginfw/ep_profile_modal/sendVerificationEmail/:userId/:userName/:email', async (req, res, next) => {
    const settings = await db.get('ep_profile_modal_settings') || {};

    if (settings.settingsDomain && settings.settingsEmailSmtp && settings.settingsEmailPort && settings.settingsEmailUser && settings.settingsEmailPassword) {
      const padId = req.params.padId;
      const userId = req.params.userId;

      const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
      let userEmail = '';
      if (validation(req.params.email)) {
        if (validation(user.email)) {
          userEmail = user.email;
        } else {
          userEmail = req.params.email;
        }
      } else {
        userEmail = user.email;
      }

      var userName = '';
      
      if(validation(req.params.userName)){
          if(validation(user.username)){
              userName = user.username ;
          }else{
              userName = req.params.userName ;
          }
      }else{
          userName = user.username ;
      }
            
      if (userEmail){
        if (!user.verified){
          const confirmCode = new Date().getTime().toString()
          user.confirmationCode = confirmCode
          user.email =userEmail
          user.username =userName

          var link = `https://${settings.settingsDomain}/static/emailConfirmation/${Buffer.from(userId).toString('base64')}/${Buffer.from(padId).toString('base64')}/${Buffer.from(confirmCode).toString('base64')}`
          var html = (settings.settingsHtmlBodyTemplate) ? eval(settings.settingsHtmlBodyTemplate) : `<p><b>Hello ${userName}! </b></p>
          <p> Please <a href='${link}'>click here</a> to verify your email address for ${settings.settingsDomain}/${padId} .</p>                  
          <p>If this wasn’t you, ignore this message.</p>`
  
          emailService.sendMail(settings,{
            to : userEmail ,
            subject : (settings.settingsHtmlSubjectTemplate) ?  settings.settingsHtmlSubjectTemplate:  `confirm email for ${settings.settingsDomain}/${padId}`,
            html: html
          })
          .then((data)=>{
          })
          .catch((err)=>{
          })
  
          db.set("ep_profile_modal:"+userId+"_"+padId , user) 
      }
    }
  }

  return res.status(201).json({status: 'ok'});
  });
  // for reset profile image
  context.app.get('/static/:padId/pluginfw/ep_profile_modal/resetProfileImage/:userId', async (req, res, next) => {
    const padId = req.params.padId;
    const userId = req.params.userId;
    db.set(`ep_profile_modal_image:${userId}`, 'reset');
    const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
    user.image = 'reset';
    await db.set(`ep_profile_modal:${userId}_${padId}`, user);
    return res.status(201).json({status: 'ok'});
  });
  // for upload user image
  context.app.post('/static/:padId/pluginfw/ep_profile_modal/upload/:userId', async (req, res, next) => {
    const padId = req.params.padId;
    const userId = req.params.userId;

    const s3 = new AWS.S3({
      accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
      secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
      endpoint: settings.ep_profile_modal.storage.endPoint,
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4',
    });

     try {
      var busboy = new Busboy({
        headers: req.headers,
        limits: {
          fileSize: settings.ep_profile_modal.maxFileSize,
        },
      });
    } catch (error) {
      return next(error);
    }
    const done = function (error) {
      if (error) {
        return;
      }
      if (isDone) return;
      isDone = true;
      req.unpipe(busboy);
      drainStream(req);
      busboy.removeAllListeners();
      const msg = error.stack.substring(0, error.stack.indexOf('\n'));

      return res.status(201).json({error: msg});
    };

    const newFileName = uuid.v4();

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      const fileType = path.extname(filename);
      const fileTypeWithoutDot = fileType.substr(1);
      const fileRead = [];
      const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
      if (user.verified) { var savedFilename = path.join(user.email, padId, newFileName + fileType); } else { var savedFilename = path.join(userId, padId, newFileName + fileType); }
      file.on('limit', () => res.status(201).json({error: 'File is too large'}));
      file.on('error', (error) => {
        busboy.emit('error', error);
      });
      file.on('data', async (chunk) => {
        fileRead.push(chunk);
      });
      file.on('end', async () => {
        const finalBuffer = Buffer.concat(fileRead);
        const sizeImage = sizeOf(finalBuffer);
        let selctedWidth = 128; let
          selectedHeight = 128;
        if (sizeImage) {
          const result_resize = getBestImageReszie(sizeImage.width, sizeImage.height, 128);
          selctedWidth = result_resize.width;
          selectedHeight = result_resize.height;
        }
        try {
          var newFile = await resizeImg(finalBuffer, {
            width: selctedWidth,
            height: selectedHeight,
          });
        } catch (error) {
          var msg = error.message.substring(0, error.message.indexOf('\n'));

          return res.status(201).json({error: msg});
        }

        if (settings.ep_profile_modal.storage.type == 's3') {
          const params_upload = {
            bucket: settings.ep_profile_modal.storage.bucket,
            Bucket: settings.ep_profile_modal.storage.bucket,
            Key: savedFilename, // File name you want to save as in S3
            Body: newFile,
          };
          try {

            s3.upload(params_upload, async (err, data) => {

              if (data) {
                db.set(`ep_profile_modal_image:${userId}`, savedFilename);
                const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
                user.image = savedFilename;
                user.updateDate = new Date();

                await db.set(`ep_profile_modal:${userId}_${padId}`, user);
                var msg = {
                  type: 'COLLABROOM',
                  data: {
                    type: 'CUSTOM',
                    payload: {
                      padId,
                      action: 'EP_PROFILE_USER_IMAGE_CHANGE',
                      userId,
                    },
                  },
                };
                sendToRoom(msg);
                return res.status(201).json({type: settings.ep_profile_modal.storage.type, error: false, fileName: savedFilename, fileType, data});
              } else {
                var msg = err.stack.substring(0, err.stack.indexOf('\n'));

                return res.status(201).json({error: msg});
              }
            });
          } catch (error) {
            var msg = error.message.substring(0, error.message.indexOf('\n'));

            return res.status(201).json({error: msg});
          }
        }
      });
    });
    req.pipe(busboy);
  });

  return context;
};


const moveImageToAccount = async (userId, padId, email, userImage) => {
  if (userImage.indexOf(email) == -1) {
    const s3 = new AWS.S3({
      accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
      secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
      endpoint: settings.ep_profile_modal.storage.endPoint,
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4',
    });
    const Key = userImage;
    const newKey = path.join(Key.replace(userId, email));

    // not worked
    // var resultCopy = await s3.copyObject({
    //     Bucket: settings.ep_profile_modal.storage.bucket,
    //     CopySource: `${settings.ep_profile_modal.storage.bucket}/${Key}`,  // old file Key
    //     Key:  newKey , // new file Key

    //   }).promise();
    // console.log(resultCopy)

    // download image
    const getObjectResult = await s3.getObject({
      Bucket: settings.ep_profile_modal.storage.bucket, Key,
    }).promise();
    // upload image
    await s3.upload({
      Bucket: settings.ep_profile_modal.storage.bucket,
      Key: newKey, // File name you want to save as in S3
      Body: getObjectResult.Body,
    }).promise();
    // delete
    await s3.deleteObject({
      Bucket: settings.ep_profile_modal.storage.bucket,
      Key,
    }).promise();

    return newKey;
  }
  return userImage;
};
const getBestImageReszie = (originalWidth, originalHeight, size) => {
  const ratio = originalWidth / originalHeight;
  let targetWidth = targetHeight = Math.min(size, Math.max(originalWidth, originalHeight));


  if (ratio < 1) {
    targetWidth = targetHeight * ratio;
  } else {
    targetHeight = targetWidth / ratio;
  }

  srcWidth = originalWidth;
  srcHeight = originalHeight;
  srcX = srcY = 0;
  return {width: targetWidth, height: targetHeight};
};
function getValidUrl(url = '') {
  if (url == '') return '';
  let newUrl = decodeURIComponent(url);
  newUrl = newUrl.trim().replace(/\s/g, '');

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
}
const sendToRoom = (msg) => {
  const bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if (bufferAllows) {
    setTimeout(() => { // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      try {
        padMessageHandler.handleCustomObjectMessage(msg, false, (error) => {
          // console.log(error)
          // TODO: Error handling.
        });
      } catch (error) {
      }
    }
    , 100);
  }
};
const validation = (variable) => {
  if (variable == 'null' || !variable || variable == undefined || variable == '' || variable == null) { return false; } else { return true; }
};
