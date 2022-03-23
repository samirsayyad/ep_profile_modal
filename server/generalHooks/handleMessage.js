/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
'use strict';

const shared = require('../helpers/shared');
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const etherpadFuncs = require('../helpers/etherpadSharedFunc');
const db = require('ep_etherpad-lite/node/db/DB');

const prefill = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  user.image = message.data.image;
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};

const login = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  const defaultImg = `/static/getUserProfileImage/
  ${message.userId}/${message.padId}t=${new Date().getTime()}`;

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
        img: defaultImg,
        email: message.email,
        userName: message.name,
        user,

      },
    },
  };
  etherpadFuncs.sendToRoom(msg);


  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};

const info = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  const defaultImg = `/static/getUserProfileImage/
  ${message.userId}/${message.padId}t=${new Date().getTime()}`;
  let formPassed = true;
  user.about = message.data.ep_profile_modalForm_about_yourself;
  user.email = message.data.ep_profile_modalForm_email;
  user.homepage = shared.getValidUrl(message.data.ep_profile_modalForm_homepage);
  user.username = message.data.ep_profile_modalForm_name;
  user.createDate = (user.createDate) ? user.createDate : new Date();
  user.updateDate = new Date();

  user.status = '2';
  if (!user.image) {
    const profileUrl = gravatar.profile_url(user.email, {protocol: 'https'});
    let profileJson = await fetch(profileUrl);
    profileJson = await profileJson.json();
    if (profileJson === 'User not found') { formPassed = false; }
  }
  formPassed = (user.about === '' || user.email === '' ||
   user.homepage === '' || user.username === '') ? false : formPassed;
  user.formPassed = formPassed;

  // send everybody
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: message.padId,
        action: 'EP_PROFILE_USER_LOGIN_UPDATE',
        userId: message.userId,
        img: defaultImg,
        email: user.email,
        userName: user.username,
        user,
      },
    },
  };
  etherpadFuncs.sendToRoom(msg);
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, user);
};


const logout = async (message) => {
  const user = await db.get(`ep_profile_modal:${message.userId}_${message.padId}`) || {};
  user.status = '1';
  user.lastLogoutDate = new Date();
  let messageChatText = '';

  if (user.username !== '' && user.username) {
    messageChatText = `${user.username}${(user.about) ? `, ${user.about}` : ''} has left. 
    ${(user.homepage !== '' && user.homepage && typeof user.homepage !== undefined)
    ? ` Find them at ${shared.getValidUrl(user.homepage)}'${user.homepage}` : ''}`;
  }


  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        padId: message.padId,
        action: 'EP_PROFILE_USER_LOGOUT_UPDATE',
        userId: message.userId,
        messageChatText,
      },
    },
  };


  etherpadFuncs.sendToRoom(msg);
  await db.set(`ep_profile_modal:${message.userId}_${message.padId}`, {}); // empty session
  // remove user id from verified users
  const padUsers = await db.get(`ep_profile_modal_verified_${message.padId}`) || [];
  const indexOfUserId = padUsers.indexOf(message.userId);
  if (indexOfUserId !== -1) {
    padUsers.splice(indexOfUserId, 1);
    db.set(`ep_profile_modal_verified_${message.padId}`, padUsers);
  }
};


const statisticsHandling = async (message) => {
  let padUsers = await db.get(`ep_profile_modal_contributed_${message.padId}`) || [];
  const contrubutedUsers = await db.get(`ep_profile_modal_contributedList_${message.padId}`) || [];

  const emailContributedUsers =
  await db.get(`ep_profile_modal_email_contributed_${message.padId}`) || [];
  // // counting how many email input

  if (padUsers) {
    if (padUsers.indexOf(message.userId) === -1) {
      // as we are using etherpad userid as session,
      // we should not store user id if they input their email address
      if (!message.data.email && !message.data.verified) {
        padUsers.push(message.userId);
        db.set(`ep_profile_modal_contributed_${message.padId}`, padUsers);
      }
    }
    // as we are using etherpad userid as session,
    // we should not store user id if they input their email address
  } else if (!message.data.email && !message.data.verified) {
    padUsers = [message.userId];
    db.set(`ep_profile_modal_contributed_${message.padId}`, padUsers);
  }
  //* collect user If just enter to pad */


  // collect contributor list with last seen timestamp
  const contributor = contrubutedUsers.findIndex((o) => o.userId === message.userId);
  const datetime = new Date();
  if (contributor === -1) {
    const newContributor = {};
    newContributor.userId = message.userId;
    newContributor.data = {last_seen_timestamp: datetime.getTime(),
      last_seen_date: datetime.toISOString().slice(0, 10)};
    contrubutedUsers.push(newContributor);
  } else {
    contrubutedUsers[contributor].data =
    {last_seen_timestamp: datetime.getTime(), last_seen_date: datetime.toISOString().slice(0, 10)};
  }
  await db.set(`ep_profile_modal_contributedList_${message.padId}`, contrubutedUsers);

  // collect contributor list with last seen timestamp


  // /////////
  const _timestamp = datetime.getTime();
  const _date = datetime.toISOString().slice(0, 10);
  // //// store pads of users
  const padsOfUser = await db.get(`ep_profile_modal_pads_of_user_${message.userId}`) || [];
  const lastUserIndex = padsOfUser.findIndex((i) => i.padId === message.padId);
  if (lastUserIndex !== -1) {
    padsOfUser[lastUserIndex].data.last_seen_date = _date;
    padsOfUser[lastUserIndex].data.last_seen_timestamp = _timestamp;
  } else {
    padsOfUser.push({
      padId: message.padId,
      data: {
        last_seen_timestamp: _timestamp,
        last_seen_date: _date,
        created_at_timestamp: _timestamp,
        created_at_date: _date,
      },
    });
  }
  db.set(`ep_profile_modal_pads_of_user_${message.userId}`, padsOfUser);


  // //// store pads of users

  const verifiedUsers = await db.get(`ep_profile_modal_verified_${message.padId}`);

  // tell everybody that total user has been changed
  const msg = {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        totalUserCount: padUsers.length + emailContributedUsers.length,
        padId: message.padId,
        action: 'totalUserHasBeenChanged',
        verifiedUsers,
      },
    },
  };
  etherpadFuncs.sendToRoom(msg);
  // tell everybody that total user has been changed
};


exports.handleMessage = (hookName, context, callback) => {
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
    prefill(message);
  }

  if (message.action === 'ep_profile_modal_info') {
    info(message);
  }

  if (message.action === 'ep_profile_modal_login') {
    login(message);
  }

  if (message.action === 'ep_profile_modal_logout') {
    logout(message);
  }

  if (message.action === 'ep_profile_modal_ready') {
    statisticsHandling(message);
  }

  if (isProfileMessage === true) {
    return [];
  } else {
    return true;
  }
};
