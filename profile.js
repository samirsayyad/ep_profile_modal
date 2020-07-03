var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_editbarMenuRight = function (hook_name,args,cb){
	args.content += eejs.require('ep_profile_modal/templates/profileButton.ejs');
	return cb();

}
exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_profile_modal/templates/modal.html", {}, module);
  return cb();
}
