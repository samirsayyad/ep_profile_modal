const eejs = require('ep_etherpad-lite/node/eejs');
const db = require('ep_etherpad-lite/node/db/DB');

exports.registerRoute = (hook_name, args, cb) => {
  args.app.get('/admin/ep_profile_modal', (req, res) => {
    const render_args = {
      errors: [],
    };
    res.send(eejs.require('ep_profile_modal/templates/admin/admin.html', render_args));
  });
  return [];
};

exports.eejsBlock_adminMenu = (hook_name, args, cb) => {
  const hasAdminUrlPrefix = (args.content.indexOf('<a href="admin/') !== -1);
  const hasOneDirDown = (args.content.indexOf('<a href="../') !== -1);
  const hasTwoDirDown = (args.content.indexOf('<a href="../../') !== -1);
  const urlPrefix = hasAdminUrlPrefix ? 'admin/' : hasTwoDirDown ? '../../' : hasOneDirDown ? '../' : '';
  args.content = `${args.content}<li><a href="${urlPrefix}ep_profile_modal">Profile modal plugin</a></li>`;
  return [];
};


exports.socketio = (hook_name, args, cb) => {
  io = args.io.of('/pluginfw/admin/ep_profile_modal');
  io.on('connection', (socket) => {
    // settings
    socket.on('load-settings', async () => {
      const settings = await db.get('ep_profile_modal_settings') || {};
      socket.emit('load-settings-result', settings);
    });
    socket.on('save-settings', async (data) => {
      console.log('we got this', data);
      await db.set('ep_profile_modal_settings', data) || {};
    });
    // settings
  });
  return [];
};
