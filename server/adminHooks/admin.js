const eejs = require('ep_etherpad-lite/node/eejs');
const db = require('ep_etherpad-lite/node/db/DB');
const padManager = require('ep_etherpad-lite/node/db/PadManager');
const async = require('async');

exports.registerRoute = (hookName, args, cb) => {
  args.app.get('/admin/ep_profile_modal', (req, res) => {
    const renderArgs = {
      errors: [],
    };
    res.send(
        eejs.require('ep_profile_modal/templates/admin/admin.html', renderArgs),
    );
  });
  args.app.get('/admin/ep_profile_modal_analytics', (req, res) => {
    const renderArgs = {
      errors: [],
    };
    res.send(
        eejs.require(
            'ep_profile_modal/templates/admin/analytics.html',
            renderArgs,
        ),
    );
  });
  return [];
};

exports.eejsBlock_adminMenu = (hookName, args, cb) => {
  const hasAdminUrlPrefix = args.content.indexOf('<a href="admin/') !== -1;
  const hasOneDirDown = args.content.indexOf('<a href="../') !== -1;
  const hasTwoDirDown = args.content.indexOf('<a href="../../') !== -1;
  const urlPrefix = hasAdminUrlPrefix
    ? 'admin/'
    : hasTwoDirDown
      ? '../../'
      : hasOneDirDown
        ? '../'
        : '';
  args.content = `${args.content}<li><a href="
  ${urlPrefix}ep_profile_modal">Profile modal plugin setting</a></li>`;
  args.content = `${args.content}<li><a href="
  ${urlPrefix}ep_profile_modal_analytics">Profile modal plugin analytics</a></li>`;
  return [];
};

exports.socketio = (hookName, args, cb) => {
  const io = args.io.of('/pluginfw/admin/ep_profile_modal');
  io.on('connection', (socket) => {
    // settings
    socket.on('load-settings', async () => {
      const settings = (await db.get('ep_profile_modal_settings')) || {};
      socket.emit('load-settings-result', settings);
    });
    socket.on('save-settings', async (data) => {
      (await db.set('ep_profile_modal_settings', data)) || {};
    });

    socket.on('load-analytics', async (data) => {
      const padUsers =
        (await db.get(`ep_profile_modal_contributed_${data.pad}`)) || [];
      const emailContributedUsers =
        (await db.get(`ep_profile_modal_email_contributed_${data.pad}`)) || [];
      const padUsersData = [];
      async.forEach(
          padUsers,
          async (userId) => {
            const user =
            (await db.get(`ep_profile_modal:${userId}_${data.pad}`)) || false;
            padUsersData.push(user);
          },
          async () => {
            socket.emit('load-analytics-result', {
              padUsers,
              emailContributedUsers,
              padUsersData,
            });
          },
      );
    });
    socket.on('load-pads', async () => {
      const {padIDs} = await padManager.listAllPads();
      socket.emit('load-pads-result', padIDs);
    });

    // settings
  });
  return [];
};
