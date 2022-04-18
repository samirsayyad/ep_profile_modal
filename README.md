# ep_profile_modal

Profile plugin for Etherpad.

Extend current Etherpad profile flow (just take name and color)
Add the email field for getting to know better users, of course, have validation too.
Pick an image as your profile image and will show around the page. (AWS for upload is available now).
Profile card for each user in order to be able other users to know each other better even see each other picture!
Modal form for getting the user's info.

## Installing

```bash
$ npm install ep_profile_modal
```

## Settings

To set AWS and local upload in Etherpad settings.json:

```json
  "ep_profile_modal": {
      "storage": storage
        "endPoint": "",
        "useSSL": true,
        "type": "s3",
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "",
        "bucket": "",
        "baseFolder": "",
        "baseURL": ""
      },
    "fileTypes": ["jpeg", "jpg", "bmp", "gif", "png"],
      "maxFileSize": 50000000
    },
```

in relation to configure email settings and be safe for credential emails you need to input your email credential in the admin panel of Etherpad.
You will see it in the admin panel after installation.

## License

This project is licensed under the [MIT License] (./ LICENSE).

If you have any further questions, please do not hesitate to contact us.
<samir.saiad@gmail.com>
