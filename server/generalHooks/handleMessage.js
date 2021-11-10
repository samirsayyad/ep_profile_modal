const shared = require('../helpers/shared');
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const etherpadFuncs = require('../helpers/etherpadSharedFunc');
const db = require('ep_etherpad-lite/node/db/DB');
const async = require('../../../../src/node_modules/async');
const staticVars = require('../helpers/statics');


exports.handleMessage = (hook_name, context, callback) => {
  let isProfileMessage = false;
  if (context) {
    if (context.message && context.message) {
      if (context.message.type === 'COLLABROOM') {
        if (context.message.data) {
          if (context.message.data.type) {
            if (context.message.data.type === 'ep_profile_modal') {
              isProfileMessage = true;
            }
          }
        }
      }
    }
  }
  if (!isProfileMessage) {
    return false;
  }


  const message = context.message.data;

  if (message.action === 'ep_profile_modal_prefill') {
    ep_profile_modal_prefill(message);
  }

  if (message.action === 'ep_profile_modal_info') {
    ep_profile_modal_info(message);
  }

  if (message.action === 'ep_profile_modal_login') {
    ep_profile_modal_login(message);
    //ep_profile_modal_login_check_prompt(message, context.client);
  }

  // if(message.action==="ep_profile_modal_send_signout_message"){
  //     ep_profile_modal_send_signout_message(message)
  // }

  if (message.action === 'ep_profile_modal_logout') {
    ep_profile_modal_logout(message);
  }

  // if (message.action === 'EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT') {
  //   EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT(message);
  // }

  if (message.action === 'ep_profile_modal_ready') {
    //ep_profile_modal_ready(message);
    statisticsHandling(message);
  }

  if (isProfileMessage === true) {
    return [];
  } else {
    return truetrue;
  }
};


// const ep_profile_modal_send_signout_message = async function(message){
//     var user = await db.get("ep_profile_modal:"+message.userId+"_"+message.padId) || {};
// }

const ep_profile_modal_prefill = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  user.image = message.data.image;
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};

const ep_profile_modal_login = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  const default_img = `/static/getUserProfileImage/${message.userId}/${message.padId}t=${new Date().getTime()}`;

  user.createDate = (user.createDate) ? user.createDate : new Date();
  user.updateDate = new Date();
  user.email = message.email || '';
  user.status = '2';
  user.username = message.name || '';
  user.userId = message.userId;

  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: message.padId,
        action: 'EP_PROFILE_USER_LOGIN_UPDATE',
        userId: message.userId,
        img: default_img,
        email: message.email,
        userName: message.name,
        user,

      },
    },
  };
  etherpadFuncs.sendToRoom(msg);


  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};

const ep_profile_modal_login_check_prompt = async (message, client) => {
  // suggest data by checking email primary data prompt
  if (message.suggestData) {
    const emailUser = await db.get(`ep_profile_modal:${message.email}`);
    if (emailUser) {
      const msg = {
        type: 'COLLABROOM',
        data: {
          type: 'CUSTOM',
          payload: {
            padId: message.padId,
            userId: message.userId,
            action: 'EP_PROFILE_MODAL_PROMPT_DATA',
            data: {
              email: message.email,
              image: emailUser.image || null,
              about: emailUser.about,
              homepage: emailUser.homepage,
            },


          },
        },
      };
      etherpadFuncs.sendToUser(msg, client);
    }
  }
};
const ep_profile_modal_info = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  const default_img = `/static/getUserProfileImage/${message.userId}/${message.padId}t=${new Date().getTime()}`;
  let form_passed = true;
  user.about = message.data.ep_profile_modalForm_about_yourself;
  user.email = message.data.ep_profile_modalForm_email;
  user.homepage = shared.getValidUrl(message.data.ep_profile_modalForm_homepage);
  user.username = message.data.ep_profile_modalForm_name;
  user.createDate = (user.createDate) ? user.createDate : new Date();
  user.updateDate = new Date();

  user.status = '2';
  if (!user.image) {
    const profile_url = gravatar.profile_url(user.email, {protocol: 'https'});
    profile_json = await fetch(profile_url);
    profile_json = await profile_json.json();
    if (profile_json == 'User not found') { form_passed = false; }
  }
  form_passed = (user.about == '' || user.email == '' || user.homepage == '' || user.username == '') ? false : form_passed;
  user.form_passed = form_passed;

  // send everybody
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: message.padId,
        action: 'EP_PROFILE_USER_LOGIN_UPDATE',
        userId: message.userId,
        img: default_img,
        email: user.email,
        userName: user.username,
        user,
      },
    },
  };
  etherpadFuncs.sendToRoom(msg);
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};


const ep_profile_modal_logout = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  user.status = '1';
  user.lastLogoutDate = new Date();
  var messageChatText = ""

  if (user.username !== '' && user.username) {
    messageChatText = `${user.username}${(user.about) ? `, ${user.about}` : ''} has left. ${(user.homepage !== '' && user.homepage && typeof user.homepage !== undefined) ? ` Find them at ${shared.getValidUrl(user.homepage)}'${user.homepage}` : ''}`;
  }


  var msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: message.padId,
        action: 'EP_PROFILE_USER_LOGOUT_UPDATE',
        userId: message.userId,
        messageChatText : messageChatText
      },
    },
  };


  etherpadFuncs.sendToRoom(msg);
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, {}); // empty session
  // remove user id from verified users
  const pad_users = await db.get(`ep_profile_modal_verified_${message.padId}`) || [];
  const indexOfUserId = pad_users.indexOf(message.userId);
  if (indexOfUserId != -1) {
    pad_users.splice(indexOfUserId, 1);
    db.set(`ep_profile_modal_verified_${padId}`, pad_users);
  }
  // remove user id from verified users

  
};

// const EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT = async (message) => {
//   const msg = {
//     type: 'COLLABROOM',
//     data: {
//       type: 'CUSTOM',
//       payload: {
//         padId: message.padId,
//         action: 'EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT',
//         userId: message.userId,
//         msg: message.data,
//       },
//     },
//   };
//   etherpadFuncs.sendToRoom(msg);
// };

const ep_profile_modal_ready = async (message) => {
  //console.log('ep_profile_modal_ready', message);
  const pad_users = await db.get(`ep_profile_modal_contributed_${message.padId}`) || [];
  // sendUsersListToAllUsers(pad_users,message.padId)
  // /////////
  const all_users_list = [];

  var datetime = new Date();
  const today = datetime.toISOString().slice(0, 10);
  let yesterday = new Date(datetime);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString().slice(0, 10);
  // if(pad_users){
  async.forEach(pad_users, async (value, cb) => {
    const user = await db.get(`ep_profile_modal:${value}_${message.padId}`) || {};
    const default_img = `/static/getUserProfileImage/${value}/${message.padId}?t=${new Date().getTime()}`;

    all_users_list.push({
      userId: value,
      email: user.email || '',
      status: user.status || '1',
      userName: user.username || staticVars.defaultUserName,
      imageUrl: default_img,
      about: user.about || '',
      homepage: shared.getValidUrl(user.homepage) || '',
      last_seen_date: ((user.last_seen_date == today) ? 'today' : (user.last_seen_date == yesterday) ? 'yesterday' : user.last_seen_date) || '',
      last_seen_timestamp: user.last_seen_timestamp || 0,

    });

    cb();
  }, async (err) => { // callback after foreach finished
    const email_contributed_users = await db.get(`ep_profile_modal_email_contributed_${message.padId}`) || [];
    // again start a foreach for email
    async.forEach(email_contributed_users, async (value, cb) => {
      const user = await db.get(`ep_profile_modal:${value.email}`) || {};
      const default_img = `/static/getUserProfileImage/${value.email}/${message.padId}?t=${new Date().getTime()}`;

      all_users_list.push({
        userId: user.email,
        email: user.email || '',
        status: user.status || '1',
        userName: user.username || staticVars.defaultUserName,
        imageUrl: default_img,
        about: user.about || '',
        homepage: shared.getValidUrl(user.homepage) || '',
        last_seen_date: ((user.last_seen_date == today) ? 'today' : (user.last_seen_date == yesterday) ? 'yesterday' : user.last_seen_date) || '',
        last_seen_timestamp: user.last_seen_timestamp || 0,

      });
    }, async (err) => { // callback after foreach finished
      all_users_list.sort((a, b) => (a.userName == staticVars.defaultUserName) ? 1 : -1); // base on anonymous
      all_users_list.sort((a, b) => (a.last_seen_timestamp < b.last_seen_timestamp) ? 1 : ((b.last_seen_timestamp < a.last_seen_timestamp) ? -1 : 0)); // base on seen

      const msg = {
        type: 'COLLABROOM',
        data: {
          type: 'CUSTOM',
          payload: {
            padId: message.padId,
            action: 'EP_PROFILE_USERS_LIST',
            list: all_users_list,


          },
        },
      };
      etherpadFuncs.sendToRoom(msg);
    });
    // again start a foreach for email


    //console.log('foreach number 1 ', pad_users, all_users_list);
  });
  // }
  // /////////
  var datetime = new Date();
  const _timestamp = datetime.getTime();
  const _date = datetime.toISOString().slice(0, 10);
  // //// store pads of users
  const pads_of_user = await db.get(`ep_profile_modal_pads_of_user_${message.userId}`) || [];
  const lastUserIndex = pads_of_user.findIndex((i) => i.padId === padId);
  if (lastUserIndex !== -1) {
    pads_of_user[lastUserIndex].data.last_seen_date = _date;
    pads_of_user[lastUserIndex].data.last_seen_timestamp = _timestamp;
  } else {
    pads_of_user.push({
      padId: message.padId,
      data: {
        last_seen_timestamp: _timestamp,
        last_seen_date: _date,
        created_at_timestamp: _timestamp,
        created_at_date: _date,
      },
    });
  }
  db.set(`ep_profile_modal_pads_of_user_${message.userId}`, pads_of_user);


  // //// store pads of users
};


const statisticsHandling = async (message) => {
  let pad_users = await db.get(`ep_profile_modal_contributed_${message.padId}`) || [];
  let contrubutedUsers = await db.get(`ep_profile_modal_contributedList_${message.padId}`) || [];

  const email_contributed_users = await db.get(`ep_profile_modal_email_contributed_${message.padId}`) || [];
  // // counting how many email input

  if (pad_users) {
    if (pad_users.indexOf(message.userId) == -1) {
      if (!message.data.email && !message.data.verified) { // as we are using etherpad userid as session, we should not store user id if they input their email address
        pad_users.push(message.userId);
        db.set(`ep_profile_modal_contributed_${message.padId}`, pad_users);
      }
    }
  } else if (!message.data.email && !message.data.verified) { // as we are using etherpad userid as session, we should not store user id if they input their email address
    pad_users = [message.userId];
    db.set(`ep_profile_modal_contributed_${message.padId}`, pad_users);
  }
  //* collect user If just enter to pad */


  // collect contributor list with last seen timestamp 
  var contributor = contrubutedUsers.findIndex(o => o.userId === message.userId);
  const datetime = new Date();
  if (contributor == -1 ){
    var newContributor = {};
    newContributor.userId = message.userId;
    newContributor.data = { last_seen_timestamp : datetime.getTime() , last_seen_date : datetime.toISOString().slice(0, 10) };
    contrubutedUsers.push(newContributor);
  }else{
    contrubutedUsers[contributor].data = { last_seen_timestamp : datetime.getTime() , last_seen_date : datetime.toISOString().slice(0, 10) };
  }
  await db.set(`ep_profile_modal_contributedList_${message.padId}`,contrubutedUsers)

  // collect contributor list with last seen timestamp 



  // /////////
  const _timestamp = datetime.getTime();
  const _date = datetime.toISOString().slice(0, 10);
  // //// store pads of users
  const pads_of_user = await db.get(`ep_profile_modal_pads_of_user_${message.userId}`) || [];
  const lastUserIndex = pads_of_user.findIndex((i) => i.padId === padId);
  if (lastUserIndex !== -1) {
    pads_of_user[lastUserIndex].data.last_seen_date = _date;
    pads_of_user[lastUserIndex].data.last_seen_timestamp = _timestamp;
  } else {
    pads_of_user.push({
      padId: message.padId,
      data: {
        last_seen_timestamp: _timestamp,
        last_seen_date: _date,
        created_at_timestamp: _timestamp,
        created_at_date: _date,
      },
    });
  }
  db.set(`ep_profile_modal_pads_of_user_${message.userId}`, pads_of_user);


    // //// store pads of users

    const verified_users = await db.get(`ep_profile_modal_verified_${message.padId}`);

  // tell everybody that total user has been changed
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        totalUserCount: pad_users.length + email_contributed_users.length,
        padId: message.padId,
        action: 'totalUserHasBeenChanged',
        verified_users,
      },
    },
  };
  etherpadFuncs.sendToRoom(msg);
  // tell everybody that total user has been changed
};
