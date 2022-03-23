/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
'use strict';

const db = require('ep_etherpad-lite/node/db/DB');
const defaultImg = '/static/plugins/ep_profile_modal/static/dist/img/user-blue.png';
const defaultImgUserOff = '/static/plugins/ep_profile_modal/static/dist/img/user.png';
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const busboy = require('busboy');
const uuid = require('uuid');
const path = require('path');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const AWS = require('aws-sdk');
const resizeImg = require('resize-img');
const sizeOf = require('buffer-image-size');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const emailService = require('../services/email');
const getContributorsLimit = 25;
const staticVars = require('../helpers/statics');
const shared = require('../helpers/shared');
const async = require('async');

exports.expressConfigure = (hookName, context) => {
  const moveImageToAccount = async (userId, padId, email, userImage) => {
    if (userImage.indexOf(email) === -1) {
      const s3 = new AWS.S3({
        accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
        secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
        endpoint: settings.ep_profile_modal.storage.endPoint,
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4',
      });
      const Key = userImage;
      const newKey = path.join(Key.replace(userId, email));
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
    let targetWidth = Math.min(size, Math.max(originalWidth, originalHeight));
    let targetHeight = Math.min(size, Math.max(originalWidth, originalHeight));


    if (ratio < 1) {
      targetWidth = targetHeight * ratio;
    } else {
      targetHeight = targetWidth / ratio;
    }
    return {width: targetWidth, height: targetHeight};
  };
  const getValidUrl = (url = '') => {
    if (url === '') return '';
    let newUrl = decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }

    return newUrl;
  };
  const sendToRoom = (msg) => {
    // Todo write some buffer handling for protection and
    // to stop DDoS -- myAuthorId exists in message.
    const bufferAllows = true;
    if (bufferAllows) {
      setTimeout(() => {
        padMessageHandler.handleCustomObjectMessage(msg, false, (error) => {
        });
      }
      , 100);
    }
  };
  const validation = (variable) => {
    if (variable === 'null' || !variable ||
    variable === undefined ||
    variable === '' || variable == null) { return false; } else { return true; }
  };

  // ///////       getContributors         //////////////////////
  context.app.get('/static/:padId/pluginfw/ep_profile_modal/getContributors/:page',
      async (req, res, next) => {
        const padId = req.params.padId;
        const page = parseInt(req.params.page) || 1;
        let contributorList = await db.get(`ep_profile_modal_contributedList_${padId}`) || [];
        const outputList = [];
        const datetime = new Date();
        const today = datetime.toISOString().slice(0, 10);
        let yesterday = new Date(datetime);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toISOString().slice(0, 10);


        const offset = (page - 1) * getContributorsLimit;
        const maxPaginated = parseInt(offset) + parseInt(getContributorsLimit);
        const lastPage = (contributorList.length > maxPaginated) ? false : true;


        if (contributorList.length) {
          contributorList =
          contributorList.sort((a, b) => b.last_seen_timestamp - a.last_seen_timestamp);
          const slicedArray = contributorList.splice(offset, getContributorsLimit);
          await async.map(slicedArray, async (row) => {
            const user = await db.get(`ep_profile_modal:${row.userId}_${padId}`) || {};
            const userImage = `/static/getUserProfileImage/
            ${row.userId}/${padId}?t=${new Date().getUTCDay()}`;

            outputList.push({
              userId: row.userId,
              email: user.email || '',
              status: user.status || '1',
              userName: user.username || staticVars.defaultUserName,
              imageUrl: userImage,
              about: user.about || '',
              homepage: shared.getValidUrl(user.homepage) || '',
              lastSeenDate: ((user.last_seen_date === today)
                ? 'today' : (user.last_seen_date === yesterday)
                    ? 'yesterday' : user.last_seen_date) || '',
              lastSeenTimestamp: user.last_seen_timestamp || 0,

            });
          });
        }

        return res.status(201).json({data: outputList, lastPage});
      });
  // ///////       getContributors         //////////////////////


  context.app.get('/static/:padId/pluginfw/ep_profile_modal/getUserInfo/:userId',
      async (req, res, next) => {
        const padId = req.params.padId;
        const userId = req.params.userId;
        const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
        user.homepage = getValidUrl(user.homepage) || '';
        return res.status(201).json({user});
      });
  // comes from users email when they already recieved an email for this
  context.app.get('/static/emailConfirmation/:userId/:padId/:confirmCode',
      async (req, res, next) => {
        const settings = await db.get('ep_profile_modal_settings') || {};
        const userId = Buffer.from(req.params.userId, 'base64').toString('ascii');
        const padId = Buffer.from(req.params.padId, 'base64').toString('ascii');
        const confirmCode = Buffer.from(req.params.confirmCode, 'base64').toString('ascii');

        const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
        if (user.confirmationCode === confirmCode) {
          if (user.image !== '' &&
       user.image !== 'reset' && user.image) {
            user.image =
            await moveImageToAccount(userId, padId, user.email, user.image) || user.image;
          }
          user.confirmationCode = 0;
          user.verified = true;
          user.updateDate = new Date();
          user.verifiedDate = new Date();
          db.set(`ep_profile_modal:${userId}_${padId}`, user);

          // for global session
          db.set(`ep_profile_modal:${userId}`, user); // for global session
          // for global session

          // gathering verified user id of pads
          let verifiedUsers = await db.get(`ep_profile_modal_verified_${padId}`);
          if (verifiedUsers) {
            if (verifiedUsers.indexOf(userId) === -1) {
              verifiedUsers.push(userId);
            }
          } else {
            verifiedUsers = [userId];
          }
          db.set(`ep_profile_modal_verified_${padId}`, verifiedUsers);
          // gathering verified user id of pads

          // gathering verified email of pads

          let padVerifiedEmails = await db.get(`ep_profile_modal_verified_email_${padId}`);
          if (padVerifiedEmails) {
            if (padVerifiedEmails.indexOf(user.email) === -1) {
              padVerifiedEmails.push(user.email);
            }
          } else {
            padVerifiedEmails = [user.email];
          }
          db.set(`ep_profile_modal_verified_email_${padId}`, padVerifiedEmails);
          // gathering verified email of pads

          // gathering verified emails
          let allVerifiedEmails = await db.get('ep_profile_modal_verified_emails');
          if (allVerifiedEmails) {
            if (allVerifiedEmails.indexOf(user.email) === -1) {
              allVerifiedEmails.push(user.email);
            }
          } else {
            allVerifiedEmails = [user.email];
          }
          db.set('ep_profile_modal_verified_emails', allVerifiedEmails);
          // gathering verified emails


          // upsert general data on each validation.
          const emailUser = await db.get(`ep_profile_modal:${user.email}`);
          if (emailUser) { user.pads = emailUser.pads || []; } // store pads of verified users
          if (user.pads) {
            if (user.pads.indexOf(padId) === -1) {
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
          const emailContributedUsers =
          await db.get(`ep_profile_modal_email_contributed_${padId}`) || [];
          const lastUserIndex = emailContributedUsers.findIndex((i) => i.email === user.email);
          if (lastUserIndex !== -1) {
            emailContributedUsers[lastUserIndex].data.last_seen_timestamp = _timestamp;
            emailContributedUsers[lastUserIndex].data.last_seen_date = _date;
          } else {
            emailContributedUsers.push({
              email: user.email,
              data: {
                last_seen_timestamp: _timestamp,
                last_seen_date: _date,
                created_at_timestamp: _timestamp,
                created_at_date: _date,
              },
            });
          }

          db.set(`ep_profile_modal_email_contributed_${padId}`, emailContributedUsers);
          // remove user id from contributed users because we have email now
          const padUsers = await db.get(`ep_profile_modal_contributed_${padId}`);
          const indexOfUserId = padUsers.indexOf(userId);
          if (indexOfUserId !== -1) {
            padUsers.splice(indexOfUserId, 1);
            db.set(`ep_profile_modal_contributed_${padId}`, padUsers);
          }
          // remove user id from contributed users because we have email now
          // // store users in email way
        }
        if (settings.redirectToPad) return res.redirect(`/${padId}`);
        else return res.redirect('/');
      });
  context.app.get('/static/getUserProfileImage/:userId/:padId', async (req, res, next) => {
    let profileJson = null;
    let httpsUrl = null;
    const user = await db.get(`ep_profile_modal:${req.params.userId}_${req.params.padId}`) || {};
    if (user.status === '2') { // logged in
      if (user.image && user.image !== 'reset') {
        const s3 = new AWS.S3({
          accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
          secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
          endpoint: settings.ep_profile_modal.storage.endPoint,
          s3ForcePathStyle: true, // needed with minio?
          signatureVersion: 'v4',
        });
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
      } else {
        const profileUrl = gravatar.profile_url(user.email, {protocol: 'https'});
        profileJson = await fetch(profileUrl);
        profileJson = await profileJson.json();
        if (profileJson !== 'User not found') {
          httpsUrl = gravatar.url(user.email, {protocol: 'https', s: '200'});
        } else { profileJson = null; }

        return res.redirect((profileJson != null) ? httpsUrl : defaultImg);
      }
    } else {
      return res.redirect(defaultImgUserOff);
    }
  });
  // for sending email validation
  context.app.get(
      '/static/:padId/pluginfw/ep_profile_modal/sendVerificationEmail/:userId/:userName/:email',
      async (req, res, next) => {
        const settings = await db.get('ep_profile_modal_settings') || {};

        if (settings.settingsDomain && settings.settingsEmailSmtp &&
      settings.settingsEmailPort && settings.settingsEmailUser &&
      settings.settingsEmailPassword) {
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

          let userName = '';

          if (validation(req.params.userName)) {
            if (validation(user.username)) {
              userName = user.username;
            } else {
              userName = req.params.userName;
            }
          } else {
            userName = user.username;
          }

          if (userEmail) {
            if (!user.verified) {
              const confirmCode = new Date().getTime().toString();
              user.confirmationCode = confirmCode;
              user.email = userEmail;
              user.username = userName;

              const link = `https://${settings.settingsDomain}/static/emailConfirmation/
              ${Buffer.from(userId).toString('base64')}/
              ${Buffer.from(padId).toString('base64')}/
              ${Buffer.from(confirmCode).toString('base64')}`;
              const html = (settings.settingsHtmlBodyTemplate)
                // eslint-disable-next-line no-eval
                ? eval(settings.settingsHtmlBodyTemplate) : `<p><b>Hello ${userName}! </b></p>
          <p> Please <a href='${link}'>click here</a> to verify your email address for 
          ${settings.settingsDomain}/${padId} .</p>                  
          <p>If this wasn’t you, ignore this message.</p>`;

              emailService.sendMail(settings, {
                to: userEmail,
                subject: (settings.settingsHtmlSubjectTemplate)
                  ? settings.settingsHtmlSubjectTemplate
                  : `confirm email for ${settings.settingsDomain}/${padId}`,
                html,
              })
                  .then((data) => {
                  })
                  .catch((err) => {
                  });

              db.set(`ep_profile_modal:${userId}_${padId}`, user);
            }
          }
        }

        return res.status(201).json({status: 'ok'});
      });
  // for reset profile image
  context.app.get(
      '/static/:padId/pluginfw/ep_profile_modal/resetProfileImage/:userId',
      async (req, res, next) => {
        const padId = req.params.padId;
        const userId = req.params.userId;
        db.set(`ep_profile_modal_image:${userId}`, 'reset');
        const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
        user.image = 'reset';
        await db.set(`ep_profile_modal:${userId}_${padId}`, user);
        return res.status(201).json({status: 'ok'});
      });
  // for upload user image
  context.app.post(
      '/static/:padId/pluginfw/ep_profile_modal/upload/:userId',
      async (req, res, next) => {
        const padId = req.params.padId;
        const userId = req.params.userId;

        const s3 = new AWS.S3({
          accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
          secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
          endpoint: settings.ep_profile_modal.storage.endPoint,
          s3ForcePathStyle: true, // needed with minio?
          signatureVersion: 'v4',
        });

        const bb = busboy({
          headers: req.headers,
          limits: {
            fileSize: settings.ep_profile_modal.maxFileSize,
          },
        });
        const newFileName = uuid.v4();

        bb.on('file', async (name, file, info) => {
          const {filename} = info;
          const fileType = path.extname(filename);
          const fileRead = [];
          const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
          let savedFilename;
          if (user.verified) {
            savedFilename = path.join(user.email, padId, newFileName + fileType);
          } else {
            savedFilename = path.join(userId, padId, newFileName + fileType);
          }
          file.on('limit', () => res.status(201).json({error: 'File is too large'}));
          file.on('error', (error) => {
            bb.emit('error', error);
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
              const resultResize = getBestImageReszie(sizeImage.width, sizeImage.height, 128);
              selctedWidth = resultResize.width;
              selectedHeight = resultResize.height;
            }
            const newFile = await resizeImg(finalBuffer, {
              width: selctedWidth,
              height: selectedHeight,
            });

            if (settings.ep_profile_modal.storage.type === 's3') {
              const paramsUpload = {
                bucket: settings.ep_profile_modal.storage.bucket,
                Bucket: settings.ep_profile_modal.storage.bucket,
                Key: savedFilename, // File name you want to save as in S3
                Body: newFile,
              };
              try {
                s3.upload(paramsUpload, async (err, data) => {
                  if (data) {
                    db.set(`ep_profile_modal_image:${userId}`, savedFilename);
                    const user = await db.get(`ep_profile_modal:${userId}_${padId}`) || {};
                    user.image = savedFilename;
                    user.updateDate = new Date();

                    await db.set(`ep_profile_modal:${userId}_${padId}`, user);
                    const msg = {
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
                    return res.status(201).json(
                        {type: settings.ep_profile_modal.storage.type,
                          error: false, fileName: savedFilename, fileType, data});
                  } else {
                    const msg = err.stack.substring(0, err.stack.indexOf('\n'));

                    return res.status(201).json({error: msg});
                  }
                });
              } catch (error) {
                const msg = error.message.substring(0, error.message.indexOf('\n'));

                return res.status(201).json({error: msg});
              }
            }
          });
        });
        req.pipe(bb);
      });

  return context;
};
