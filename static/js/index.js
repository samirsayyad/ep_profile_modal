


const epProfileModel = require('../dist/js/ep.profile.modal.mini').init
console.log(epProfileModel, epProfileModel.documentReady)

exports.postAceInit = epProfileModel.postAceInit
exports.aceInitialized = epProfileModel.aceInitialized
exports.handleClientMessage_USER_NEWINFO = epProfileModel.handleClientMessage.handleClientMessage_USER_NEWINFO
exports.handleClientMessage_USER_LEAVE = epProfileModel.handleClientMessage.handleClientMessage_USER_LEAVE
exports.handleClientMessage_CUSTOM = epProfileModel.handleClientMessage.handleClientMessage_CUSTOM
exports.documentReady = epProfileModel.documentReady