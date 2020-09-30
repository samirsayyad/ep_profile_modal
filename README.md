# ep_profile_modal
Profile modal


configuration : 
  "ep_profile_modal":{
      "storage": {
        "endPoint": "",
        "useSSL": true,
        "type": "s3",
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "",
        "bucket": "",
        "baseFolder":"",
        "baseURL": ""
      },
    "fileTypes": ["jpeg", "jpg", "bmp", "gif","png"  ],
      "maxFileSize": 50000000
      "email":{
        "smtp" : "",
        "port" : "",
        "user" : "",
        "pass" : "",
        "template" : {
          "fromName" : "",
          "fromEmail" : ""
        }
      }
    },