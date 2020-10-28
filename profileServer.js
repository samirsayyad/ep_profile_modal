var db = require('ep_etherpad-lite/node/db/DB');
const defaultImg = "/static/plugins/ep_profile_modal/static/img/user-blue.png"
const defaultImgUserOff = "/static/plugins/ep_profile_modal/static/img/user.png"
var gravatar = require('gravatar');
const fetch = require('node-fetch');
const Busboy = require('busboy');
const    uuid = require('uuid');
const    path = require('path');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const AWS = require('aws-sdk');
const resizeImg = require('resize-img');
var sizeOf =  require('buffer-image-size');
var padMessageHandler = require("ep_etherpad-lite/node/handler/PadMessageHandler");
const emailService = require("./email")

exports.expressConfigure = async function (hookName, context) {

    context.app.get('/p/:padId/pluginfw/ep_profile_modal/getUserInfo/:userId', async function (req, res, next) {
        var padId = req.params.padId;
        var userId = req.params.userId;
        console.log("ep_profile_modal:"+userId+"_"+padId)
        var user = await db.get("ep_profile_modal:"+userId+"_"+padId) || {};
        user.homepage = getValidUrl(user.homepage) || ""
        return res.status(201).json({"user":user})

    })
    // comes from users email when they already recieved an email for this
    context.app.get('/p/emailConfirmation/:userId/:padId/:confirmCode', async function (req, res, next) {
        var userId = Buffer.from(req.params.userId, 'base64').toString('ascii') 
        var padId = Buffer.from(req.params.padId, 'base64').toString('ascii')
        var confirmCode = Buffer.from(req.params.confirmCode, 'base64').toString('ascii')

        var user = await db.get("ep_profile_modal:"+userId+"_"+padId) || {};
        if (user.confirmationCode === confirmCode){
            user.confirmationCode = 0
            user.verified = true 
            user.updateDate = new Date()
            user.verifiedDate = new Date()
            db.set("ep_profile_modal:"+userId+"_"+padId,user)
            db.set("ep_profile_modal_email_verified:"+userId+"_"+user.email ,true)
            //gathering verified user id of pads
            var verified_users = await db.get("ep_profile_modal_verified_"+padId);
            if(verified_users){
                if(verified_users.indexOf(userId) == -1){
                    verified_users.push(userId)
                }
            }else{
                verified_users = [ userId ]
            }
            db.set("ep_profile_modal_verified_"+padId , verified_users);
            //gathering verified user id of pads


        }
        return res.redirect(`/${padId}`)

    })
    context.app.get('/p/getUserProfileImage/:userId/:padId', async function (req, res, next) {
        var profile_json = null;
        var httpsUrl = null;
        var user = await db.get("ep_profile_modal:"+req.params.userId+"_"+req.params.padId) || {};
        console.log(user)
        if(user.status=="2"){ // logged in
            if (user.image && user.image !="reset"){
                var s3  = new AWS.S3({
                    accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
                    secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
                    endpoint: settings.ep_profile_modal.storage.endPoint, 
                    s3ForcePathStyle: true, // needed with minio?
                    signatureVersion: 'v4'
                });
                try{
                    var params = { Bucket: settings.ep_profile_modal.storage.bucket, Key: `${user.image}`  };
                    s3.getObject(params, function(err, data) {
                        console.log("data going to be ", params ,data , err)
                        if (data ){
                            res.writeHead(200, {'Content-Type': 'image/jpeg'});
                            res.write(data.Body, 'binary');
                            res.end(null, 'binary');
                        }else{
                            res.end(null, 'binary');
                
                        }
                        
                    });
                }catch(error){
                    console.log("error",error)
                }
            
            }else{
                var profile_url = gravatar.profile_url(user.email, {protocol: 'https' });
                profile_json = await fetch(profile_url) ;
                profile_json = await profile_json.json()
                if (profile_json !="User not found")
                    httpsUrl = gravatar.url(user.email, {protocol: 'https', s: '200'});
                else
                    profile_json = null
            
                return res.redirect((profile_json != null ) ?  httpsUrl : defaultImg )
    
            }
        }else{
            return res.redirect(defaultImgUserOff)

        }
      


    })

    // for sending email validation
    context.app.get('/p/:padId/pluginfw/ep_profile_modal/sendVerificationEmail/:userId/:userName/:email',async function (req, res, next) {

        var settings = await db.get("ep_profile_modal_settings") || {};

        if (settings.settingsDomain && settings.settingsEmailSmtp&& settings.settingsEmailPort&& settings.settingsEmailUser&& settings.settingsEmailPassword ){
            var padId = req.params.padId;
            var userId = req.params.userId;
  
            var user = await db.get("ep_profile_modal:"+userId+"_"+padId) || {};
            
            var userEmail = req.params.email || user.email ;
            var userName = req.params.userName || user.username ;
            console.log(userEmail,userName)
            if (userEmail){

                var email_verified =  await db.get("ep_profile_modal_email_verified:"+userId+"_"+userEmail) || false

                if (!email_verified){
                  var confirmCode = new Date().getTime().toString()
                  user.confirmationCode = confirmCode
                  user.email =userEmail
                  user.userName =userName

                  var link = `https://${settings.settingsDomain}/p/emailConfirmation/${Buffer.from(userId).toString('base64')}/${Buffer.from(padId).toString('base64')}/${Buffer.from(confirmCode).toString('base64')}`
                  var html =`<p><b>Hello ${userName}! </b></p>
                  <p> Please <a href='${link}'>click here</a> to verify your email address for ${settings.settingsDomain}/${padId} .</p>                  
                  <p>If this wasn’t you, ignore this message.</p>`
          
                  console.log(html)
                  emailService.sendMail(settings,{
                    to : userEmail ,
                    subject : `confirm email for ${settings.settingsDomain}/${padId}`,
                    html: html
                  })
                  .then((data)=>{
                      console.log(data,"from email",data.messageId)
                  })
                  .catch((err)=>{
                    console.log(err.message,"error from email")
                  })
          
                  db.set("ep_profile_modal:"+userId+"_"+padId , user) 
              }else{
                  console.log("email already verified")
              }
          
          
          
            }else{
                console.log("there is not valid email",email)

            }
        }else{
            console.log("setting not set")
        }

        return res.status(201).json({"status":"ok"})

    })
    // for reset profile image
    context.app.get('/p/:padId/pluginfw/ep_profile_modal/resetProfileImage/:userId',async function (req, res, next) {
        var padId = req.params.padId;
        var userId = req.params.userId;
        db.set("ep_profile_modal_image:"+userId , "reset");
        var user = await db.get("ep_profile_modal:"+userId+"_"+padId) || {};
            user.image = "reset"
        await db.set("ep_profile_modal:"+userId+"_"+padId,user) ;
        return res.status(201).json({"status":"ok"})

    })

    // for upload user image  
    context.app.post('/p/:padId/pluginfw/ep_profile_modal/upload/:userId',async function (req, res, next) {
        var padId = req.params.padId;
        var userId = req.params.userId;

        var s3  = new AWS.S3({
            accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
            secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
            endpoint: settings.ep_profile_modal.storage.endPoint, 
            s3ForcePathStyle: true, // needed with minio?
            signatureVersion: 'v4'
        });

        console.log({
            accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
            secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
            endpoint: settings.ep_profile_modal.storage.endPoint, 
            s3ForcePathStyle: true, // needed with minio?
            signatureVersion: 'v4'
        })

        try {
            var busboy = new Busboy({
                headers: req.headers,
                limits: {
                    fileSize: settings.ep_profile_modal.maxFileSize
                }
            });
        } catch (error) {
            console.log('ep_profile_modal ERROR', error);
            return next(error);
        }
        var done = function (error) {
            if (error) {
                console.log('ep_profile_modal UPLOAD ERROR', error);
                return;
            }
            if (isDone) return;
            isDone = true;
            req.unpipe(busboy);
            drainStream(req);
            busboy.removeAllListeners();
            var msg =error.stack.substring(0, error.stack.indexOf('\n'))

            return res.status(201).json({"error":msg})

        };

        var newFileName = uuid.v4();

        busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
            var fileType = path.extname(filename)
            var fileTypeWithoutDot = fileType.substr(1);
            var fileRead=[];
            var savedFilename = path.join(userId,padId, newFileName + fileType);
            file.on('limit', function () {
                return res.status(201).json({"error":"File is too large"})
            });
            file.on('error', function (error) {
                busboy.emit('error', error);
            });
            file.on('data', async function(chunk) {

                fileRead.push(chunk);

              });
            file.on('end', async function() {



                var finalBuffer = Buffer.concat(fileRead);
                var sizeImage = sizeOf(finalBuffer);
                var selctedWidth = 128, selectedHeight = 128;
                if (sizeImage){
                    var result_resize = getBestImageReszie(sizeImage.width,sizeImage.height,128)
                    console.log(sizeImage,result_resize)
                    selctedWidth = result_resize.width
                    selectedHeight = result_resize.height
                }
                try {
                    var newFile = await resizeImg(finalBuffer, {
                        width: selctedWidth ,
                        height: selectedHeight
                    });
                }catch(error){
                    var msg = error.message.substring(0, error.message.indexOf('\n'))

                    return res.status(201).json({"error":msg})

                }
                
                if (settings.ep_profile_modal.storage.type =="s3"){
                    var params_upload = {
                        bucket: settings.ep_profile_modal.storage.bucket,
                        Bucket: settings.ep_profile_modal.storage.bucket,
                        Key: savedFilename, // File name you want to save as in S3
                        Body: newFile
                    };
                    try{
                        console.log(params_upload)
    
                        s3.upload(params_upload, async function(err, data) {
                            if (err)
                                console.log(err, err.stack,"error")
                            else   
                                console.log(data);
        
                            if (data){
                                db.set("ep_profile_modal_image:"+userId , savedFilename);
                                var user = await db.get("ep_profile_modal:"+userId+"_"+padId) || {};
                                    user.image = savedFilename
                                    user.updateDate = new Date()

                                await db.set("ep_profile_modal:"+userId+"_"+padId,user) ;
                                var msg = {
                                    type: "COLLABROOM",
                                    data: {
                                      type: "CUSTOM",
                                      payload : {
                                        padId: padId,
                                        action:"EP_PROFILE_USER_IMAGE_CHANGE",
                                        userId: userId,
                                      }
                                    },
                                  }
                                sendToRoom(msg)
                                return res.status(201).json({"type":settings.ep_profile_modal.storage.type,"error":false,fileName :savedFilename ,fileType:fileType,data:data})
                            }else{
                                var msg =err.stack.substring(0, err.stack.indexOf('\n'))
    
                                return res.status(201).json({"error": msg})
                            }
                            
                        });
                    }catch(error){
                        var msg = error.message.substring(0, error.message.indexOf('\n'))
    
                        return res.status(201).json({"error":msg})
    
                    }
                }


            })

         
                
             
        })
        req.pipe(busboy);

    })

      
}

 
const getBestImageReszie = (originalWidth, originalHeight,size) =>{
    var ratio = originalWidth / originalHeight;
    var targetWidth = targetHeight = Math.min(size, Math.max(originalWidth, originalHeight));



    if (ratio < 1) {
        targetWidth = targetHeight * ratio;
    } else {
        targetHeight = targetWidth / ratio;
    }

    srcWidth = originalWidth;
    srcHeight = originalHeight;
    srcX = srcY = 0;
    return {width :targetWidth , height : targetHeight}
}

function getValidUrl (url = ""){
    if(url=="") return "";
    let newUrl = decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");
  
    if(/^(:\/\/)/.test(newUrl)){
        return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
        return `http://${newUrl}`;
    }
  
    return newUrl;
  };

const sendToRoom = (msg) =>{
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