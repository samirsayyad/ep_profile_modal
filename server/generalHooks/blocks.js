var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/styles.html", {}, module);
    return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
    args.content = args.content + eejs.require("ep_profile_modal/templates/profileModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/askModal.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/contributors/contributors.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/general.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/profileForm/modalForm.html", {}, module);
    args.content += eejs.require("ep_profile_modal/templates/userProfileSection/userProfileSection.html", {}, module);

    return cb();
}