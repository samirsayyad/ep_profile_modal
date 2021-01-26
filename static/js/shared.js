// var helper = require('./helper');


const shared = (() => {
  const resetAllProfileImage = function (userId, padId) {
    $.ajax({
      url: `/static/${padId}/pluginfw/ep_profile_modal/resetProfileImage/${userId}`,
      type: 'get',
      data: {},
      contentType: false,
      processData: false,
      beforeSend() {
        helper.refreshLoadingImage(userId, padId);
      },
      error(xhr) { // if error occured
        helper.refreshUserImage(userId, padId);
      },
      success(response) {
        helper.refreshUserImage(userId, padId);
      },

    });
  };
  const sendSignOutMessage = function (userId, padId) {
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_send_signout_message',
      userId,
      padId,

    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const addTextChatMessage = function (msg) {
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
  const scrollDownToLastChatText = function scrollDownToLastChatText(selector) {
    const $element = $(selector);
    if ($element.length <= 0 || !$element[0]) return true;
    $element.animate({scrollTop: $element[0].scrollHeight}, {duration: 400, queue: false});
  };

  const loginByEmailAndUsernameWithoutValidation = function (username, email, suggestData) {
    window.user_status = 'login';
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
  const loginByEmailAndUsername = function (username, email) {
    if (username == '' || !isEmail(email)) {
      if (!isEmail(email)) {
        $('#ep_profile_modal_email').focus();
        $('#ep_profile_modal_email').addClass('ep_profile_modal_validation_error');
      }
      return false;
    } else {
      $('#ep_profile_modal_email').removeClass('ep_profile_modal_validation_error');

      window.user_status = 'login';
      // pad.collabClient.updateUserInfo({
      //     userId :  pad.getUserId() ,
      //     name: username,
      //     colorId: "#b4b39a"
      // } )
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
      // $('#ep_profile_modal').addClass('ep_profile_modal-show')
      helper.userLogin({
        email,
        username,
      });

      $('#online_ep_profile_modal_status').show();
      $('#offline_ep_profile_modal_status').hide();
      // $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
      // $("#ep_profile_modal_section_info_email").text(email)
      // $("#ep_profile_modal_section_info_name").text(username)
    }
  };


  const isEmail = function (email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email == '') { return true; } else { return regex.test(email); }
  };

  const IsValid = function (url) {
    const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return pattern.test(url);
  };


  const getFormData = function ($form) {
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};

    $.map(unindexed_array, (n, i) => {
      indexed_array[n.name] = n.value;
    });

    return indexed_array;
  };
  const setFormData = function ($form, indexed_array) {
    $.map(indexed_array, (n, i) => {
      $(`#${i}`).val(n);
    });
  };

  const isUsername = function (username) {
    const regex = /^([a-zA-Z0-9_.+-])/;
    return regex.test(username);
  };
  const showGeneralOverlay = function () {
    $('#ep_profile_general_overlay').addClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_general_overlay').css({display: 'block'});
  };

  const hideGeneralOverlay = function () {
    $('#ep_profile_general_overlay').removeClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_general_overlay').css({display: 'none'});
    $('#ep_profile_modal').removeClass('ep_profile_modal-show');
    $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show');
    $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
  };

  const getValidUrl = function (url) {
    if (url == '' || !url) return '';
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

  const getMonthName = function (monthNumber) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  };
  const getCustomeFormatDate = function (date) {
    if (date == 'today' || date == 'yesterday') return `Last seen ${date}`;
    date = date.split('-');
    return `Last seen ${date[2]} ${getMonthName(date[1])} ${date[0]}`;
  };
  const getCustomDate = function (date) {
    if (date == 'today' || date == 'yesterday') return `Last seen ${date}`;
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
    IsValid,
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
