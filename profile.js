var eejs = require('ep_etherpad-lite/node/eejs/');

function eejsBlock_editbarMenuRight(hook_name,args,cb){
	args.content += eejs.require('ep_profile_modal/templates/profileButton.ejs');
	return cb();

}
function eejsBlock_styles (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
  }

exports.eejsBlock_editbarMenuRight = eejsBlock_editbarMenuRight;
exports.eejsBlock_styles = eejsBlock_styles;