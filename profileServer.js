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

exports.expressConfigure = async function (hookName, context) {
    context.app.get('/p/getUserProfileImage/:userId/', async function (req, res, next) {
        var profile_json = null;
        var httpsUrl = null;
        var user_image = await db.get("ep_profile_modal_image:"+req.params.userId);
        if (user_image){
            var s3  = new AWS.S3({
                accessKeyId: settings.ep_profile_modal.storage.accessKeyId,
                secretAccessKey: settings.ep_profile_modal.storage.secretAccessKey,
                endpoint: settings.ep_profile_modal.storage.endPoint, 
                s3ForcePathStyle: true, // needed with minio?
                signatureVersion: 'v4'
            });
            try{
                var params = { Bucket: settings.ep_profile_modal.storage.bucket, Key: `${user_image}`  };
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
            var user_status = await db.get("ep_profile_modal_status:"+req.params.userId);
            console.log(user_status , "status")
            if(user_status=="2"){
                var user_email = await db.get("ep_profile_modal_email:"+req.params.userId);
                var profile_url = gravatar.profile_url(user_email, {protocol: 'https' });
                profile_json = await fetch(profile_url) ;
                profile_json = await profile_json.json()
                if (profile_json !="User not found")
                    httpsUrl = gravatar.url(user_email, {protocol: 'https', s: '200'});
                else
                    profile_json = null
            }
            return res.redirect((profile_json != null ) ?  httpsUrl : ((user_status=="2") ? defaultImg:defaultImgUserOff ))

        }


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
            var savedFilename = path.join(userId, newFileName + fileType);
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