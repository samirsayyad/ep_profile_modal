/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-useless-escape */
'use strict';

const __LOGIN = '2';
// var helper = require('./helper');

(() => {
  const resetAllProfileImage = (userId, padId) => {
    $.ajax({
      url: `/static/${padId}/pluginfw/ep_profile_modal/resetProfileImage/${userId}`,
      type: 'get',
      data: {},
      contentType: false,
      processData: false,
      beforeSend: () => {
        helper.refreshLoadingImage(userId, padId);
      },
      error: (xhr) => { // if error occured
        helper.refreshUserImage(userId, padId);
      },
      success: (response) => {
        helper.refreshUserImage(userId, padId);
      },

    });
  };
  const sendSignOutMessage = (userId, padId) => {
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_send_signout_message',
      userId,
      padId,

    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const scrollDownToLastChatText = (selector) => {
    const $element = $(selector);
    if ($element.length <= 0 || !$element[0]) return true;
    $element.animate({scrollTop: $element[0].scrollHeight}, {duration: 400, queue: false});
  };
  const addTextChatMessage = (msg) => {
    const authorClass = `author-${msg.userId.replace(/[^a-y0-9]/g, (c) => {
      if (c === '.') return '-';
      return `z${c.charCodeAt(0)}z`;
    })}`;

    // create the time string
    let minutes = `${new Date(msg.time).getMinutes()}`;
    let hours = `${new Date(msg.time).getHours()}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (hours.length === 1) hours = `0${hours}`;
    const timeStr = `${hours}:${minutes}`;

    const html = `<p><span class='time ${authorClass}'>${timeStr}</span> ${msg.text}</p>`;

    $(document).find('#chatbox #chattext').append(html);
    scrollDownToLastChatText('#chatbox #chattext');
  };


  const loginByEmailAndUsernameWithoutValidation = (username, email, suggestData) => {
    clientVars.ep_profile_modal.userStatus = __LOGIN;

    window.userStatus = 'login';
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_login',
      email,
      userId: pad.getUserId(),
      name: username,
      padId: pad.getPadId(),
      suggestData,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const isEmail = (email) => {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email === '') { return true; } else { return regex.test(email); }
  };

  const loginByEmailAndUsername = (username, email) => {
    if (username === '' || !isEmail(email)) {
      if (!isEmail(email)) {
        $('#ep_profile_modal_email').focus();
        $('#ep_profile_modal_email').addClass('ep_profile_modal_validation_error');
      }
      return false;
    } else {
      $('#ep_profile_modal_email').removeClass('ep_profile_modal_validation_error');
      clientVars.ep_profile_modal.userStatus = __LOGIN;

      window.userStatus = 'login';
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_login',
        email,
        userId: pad.getUserId(),
        name: username,
        padId: pad.getPadId(),
        suggestData: false,

      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      helper.userLogin({
        email,
        username,
      });

      $('#online_ep_profile_modal_status').show();
      $('#offline_ep_profile_modal_status').hide();
    }
  };


  const isValid = (url) => {
    // eslint-disable-next-line max-len
    const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return pattern.test(url);
  };


  const getFormData = ($form) => {
    const unindexedArray = $form.serializeArray();
    const indexedArray = {};

    $.map(unindexedArray, (n, i) => {
      indexedArray[n.name] = n.value;
    });

    return indexedArray;
  };
  const setFormData = ($form, indexedArray) => {
    $.map(indexedArray, (n, i) => {
      $(`#${i}`).val(n);
    });
  };

  const isUsername = (username) => {
    const regex = /^([a-zA-Z0-9_.+-])/;
    return regex.test(username);
  };
  const showGeneralOverlay = () => {
    $('#ep_profile_general_overlay').addClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_general_overlay').css({display: 'block'});
  };

  const hideGeneralOverlay = () => {
    $('#ep_profile_general_overlay').removeClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_general_overlay').css({display: 'none'});
    $('#ep_profile_modal').removeClass('ep_profile_modal-show');
    $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show');
    $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
  };

  const getValidUrl = (url) => {
    if (url === '' || !url) return '';
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
      return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
      return `http://${newUrl}`;
    }

    return newUrl;
  };

  const getMonthName = (monthNumber) => {
    const months = ['January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'];
    return months[monthNumber - 1];
  };
  const getCustomeFormatDate = (date) => {
    if (date === 'today' || date === 'yesterday') return `Last seen ${date}`;
    date = date.split('-');
    return `Last seen ${date[2]} ${getMonthName(date[1])} ${date[0]}`;
  };
  const getCustomDate = (date) => {
    if (date === 'today' || date === 'yesterday') return `Last seen ${date}`;
    date = date.split('-');
    return `Last seen ${date[2]}/${date[1]}/${date[0]}`;
  };

  return {
    resetAllProfileImage,
    sendSignOutMessage,
    addTextChatMessage,
    scrollDownToLastChatText,
    loginByEmailAndUsernameWithoutValidation,
    loginByEmailAndUsername,
    isEmail,
    isValid,
    getFormData,
    setFormData,
    isUsername,
    showGeneralOverlay,
    hideGeneralOverlay,
    getValidUrl,
    getMonthName,
    getCustomeFormatDate,
    getCustomDate,

  };
})();
