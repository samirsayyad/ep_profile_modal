const path = require('path');

const jsfiles = [
  './static/js/admin/admin.js',
	'./static/js/userProfileSection/userProfileSection.js',
	'./static/js/profileForm/main.js',
	'./static/js/contributors/contributors.js',
	'./static/js/postAceInit.js',
	'./static/js/aceInitialized.js',
	'./static/js/handleClientMessage.js',
	'./static/js/helper.js',
	'./static/js/shared.js',
	'./static/js/syncData.js',

];

module.exports = {
  entry: jsfiles,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
	},
	externals: {
		'fs-extra': 'commonjs2 fs-extra',
		'postAceInit': 'postAceInit',
		'aceInitialized': 'aceInitialized',
		'handleClientMessage_USER_NEWINFO': 'handleClientMessage_USER_NEWINFO',
		'handleClientMessage_USER_LEAVE': 'handleClientMessage_USER_LEAVE',
		'handleClientMessage_CUSTOM': 'handleClientMessage_CUSTOM',
		'documentReady': 'documentReady',
  }
};