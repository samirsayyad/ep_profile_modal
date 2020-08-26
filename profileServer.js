var db = require('ep_etherpad-lite/node/db/DB');
const defaultImg = "/static/plugins/ep_profile_modal/static/img/user-blue.png"
var gravatar = require('gravatar');
const fetch = require('node-fetch');


exports.expressConfigure = async function (hookName, context) {
    context.app.get('/p/getUserProfileImage/:userId/', async function (req, res, next) {
        var profile_json = null;
        var httpsUrl = null;
        var user_status = await db.get("ep_profile_modal_status:"+req.params.userId);
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

        return res.redirect((profile_json != null ) ?  httpsUrl : defaultImg)
    })
}