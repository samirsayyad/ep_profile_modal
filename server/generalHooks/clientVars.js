/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
'use strict';

const db = require('ep_etherpad-lite/node/db/DB');
const shared = require('../helpers/shared');
const staticVars = require('../helpers/statics');

exports.clientVars = async (hook, context, callback) => {
  const padId = context.pad.id;
  let formPassed = null;
  let user =
    (await db.get(`ep_profile_modal:${context.clientVars.userId}_${padId}`)) ||
    false;
  if (!user) {
    user =
      (await db.get(`ep_profile_modal:${context.clientVars.userId}`)) || {};
    formPassed = false;
  } else {
    formPassed = user.form_passed || false;
  }
  const defaultImg = `/static/getUserProfileImage/
  ${context.clientVars.userId}/${padId}t=${context.clientVars.serverTimestamp}`;
  const datetime = new Date();
  user.last_seen_timestamp = datetime.getTime();
  user.last_seen_date = datetime.toISOString().slice(0, 10);
  db.set(`ep_profile_modal:${context.clientVars.userId}_${padId}`, user);
  //* collect user If just enter to pad */
  // // counting how many email input

  const emailVerified = false;

  //* collect user If just enter to pad */
  const padUsers =
    (await db.get(`ep_profile_modal_contributed_${padId}`)) || [];
  // // counting how many email input
  const emailContributedUsers =
    (await db.get(`ep_profile_modal_email_contributed_${padId}`)) || [];
  // // counting how many email input

  return {
    ep_profile_modal: {
      profileImageUrl: defaultImg,
      userEmail: user.email || '',
      userStatus: user.status || '1',
      userName: user.username || staticVars.defaultUserName,
      contributedAuthorsCount: padUsers.length + emailContributedUsers.length,
      about: user.about || '',
      homepage: shared.getValidUrl(user.homepage) || '',
      formPassed,
      verified: user.verified || emailVerified,
      // verified_users,
    },
  };
};
