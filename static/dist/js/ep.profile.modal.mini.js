exports.moduleList = (()=>{
// var shared = require('../shared');

const documentReady = (() => {
  const documentReady = (hooks, context, cb) => {
   
    let socket;
    const loc = document.location;
    const port = loc.port == '' ? (loc.protocol == 'https:' ? 443 : 80) : loc.port;
    const url = `${loc.protocol}//${loc.hostname}:${port}/`;
    const pathComponents = location.pathname.split('/');
    // Strip admin/plugins
    const baseURL = `${pathComponents.slice(0, pathComponents.length - 2).join('/')}/`;
    const resource = `${baseURL.substring(1)}socket.io`;

    const room = `${url}pluginfw/admin/ep_profile_modal`;

    let changeTimer;


    switch (context){
      case "admin/ep_profile_modal" : {
        // connect 
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});
        socket.on('load-settings-result', (data) => {
          console.log(data);
          shared.setFormData($('#settings-form'), data);
        });

        $('#save-settings').on('click', () => {
          const data = shared.getFormData($('#settings-form'));
          socket.emit('save-settings', data);
          alert('Succesfully saved.');
        });

        socket.emit('load-settings');
        break;

      }
      case "admin/ep_profile_modal_analytics" :{
        socket = io.connect(room, {path: `${baseURL}socket.io`, resource});
 

        socket.on('load-pads-result', (data) => {
          console.log("load-pads",data);
          $.each(data, function(index,value){
            $('#pads').append(`<option value="${value}">${value}</option>`)
          })
       
        });
        socket.on('load-analytics-result', (data) => {
          console.log("load-analytics",data);
          // $.each(data.email_contributed_users, function(index,value){
          //   $('#users').append(`
          //   <tr>
          //     <td>${value.email}</td>
          //     <td>${value.data.created_at_date}</td>
          //     <td>-</td>
          //   </tr>
          //   `)
          // })

          $.each(data.pad_users_data, function(index,value){
            if(value.userId){
              $('#users').append(`
              <tr style="height: 0;">
                <td>${value.email || value.userId}</td>
                <td>${value.username}</td>
                <td>${value.createDate}</td>
                <td>${value.last_seen_date}</td>
                <td>${value.verifiedDate || "-"}</td>
                <td>${(value.verified) ? "Verified" : "unconfirmed"}</td>
              </tr>
              `)
            }

          })

        });
        

        $('#pads').on('change', function() {
          socket.emit('load-analytics',{pad:this.value});

          
        });

        socket.emit('load-pads');
        break;

      }
      default : {
        return [];
      }

    }

  };
  return documentReady;
})();

// var shared = require('../shared');


const contributors = (() => {
  const defaultImg = '../static/plugins/ep_profile_modal/static/dist/img/user.png';

  const createHTMLforUserList = function (total, online, padId, userVerify) { // generate avatar too
    let html = "<div id='usersIconList' class='ep_profile_inlineAvatars'>";
    let style;
    let borderStyle = '';
    $.each(online.reverse(), (key, value) => {
      style = `background: url(/static/getUserProfileImage/${value.userId}/${padId}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;`;
      // if (verified_users && verified_users.length && verified_users !== 'null' && verified_users !== null) {
      //   if (verified_users.indexOf(value.userId) == -1) { borderStyle = ''; } else { borderStyle = 'box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;'; }
      // }
      if(userVerify) { borderStyle = 'box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;'; } else  { borderStyle = ''; } 

      style += borderStyle;
      html += `<div class='avatar' data-userId="${value.userId}" data-id="user_${value.userId}"  id="user_${value.userId}" ><div data-userId="${value.userId}"  class='avatarImg' style='${style}' data-id="user_${value.userId}"></div></div>`;
    });
    html += ' </div>';
    return `${html}<span class='slash_profile'>⧸</span><span id='userlist_count' class='userlist_count'>${total}</span>` +
			'<input  value=\'Share\'  id=\'ep_profile_modal_share\' type=\'button\' class=\'ep_profile_modal_share\'>';
  };

  const increaseUserFromList = function (userId, padId) {
    const style = `background: url(/static/getUserProfileImage/${userId}/${padId}) no-repeat 50% 50% ; background-size : 26px;background-color: #fff;`;


    if (!$(`.avatar[data-id="user_${userId}"]`).length) {
      const $image = $(`<div class='avatar' data-userId="${userId}"  data-id="user_${userId}" id="user_${userId}" ><div class='avatarImg' data-userId="${userId}"  data-id="user_${userId}" style='${style}'></div></div>`);
      $image.prependTo('#usersIconList');
      $image.hide().slideDown(200);
    }
  };

  const decreaseUserFromList = function (userId, padId) {
    $(`.avatar[data-id="user_${userId}"]`).animate({opacity: 0}, 1000, 'linear', function () {
      $(this).remove();
    }
    );

    const selector_user = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (selector_user.length) {
      moveOnlineUserToOffline(selector_user);
      // selector_user.animate({opacity: 0}, 1000,"linear",function()
      // {
      //     $(this).remove();
      // }
      // )
    } else {
      const selector_on = $('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');
      if (selector_on.length) {
        const selector_off = $('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');
        decreaseFromOnlineAnonymous(selector_on, userId);
        if (selector_off.length) {
          increaseToOfflineAnonymous(selector_off, userId);
        } else {
          createOfflineAnonymousElement(userId, defaultImg, null, null, selector_user);
        }
      } else {
        let offline_list_selector = $('#ep_profile_user_list_offline');
        if (offline_list_selector.length) {
          offline_list_selector.append($(`.ep_profile_user_row[data-id="user_list_${userId}"]`));
        } else {
          const offline_container = $('#ep_profile_user_list_container_off');
          offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'> </div>");
          offline_list_selector = $('#ep_profile_user_list_offline');
          $(`.ep_profile_user_row[data-id="user_list_${userId}"]`).appendTo(offline_list_selector);
        }
        // $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo("#ep_profile_user_list_container_off")
      }
    }

    // user img update
    const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const user_selector = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (user_selector.length) {
      user_selector.children('.ep_profile_user_img').css({'background-position': '50% 50%',
        'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
    }
  };

  const paginateContributors = function(all_users_list,onlineUsers,currentUserId,lastPage){
    
    const ep_profile_user_list_container_pagination = $('#ep_profile_user_list_container_pagination');
    if(lastPage){
      $("#ep_profile_modal_load_more_contributors").css({"display":"none"})
    }
    $.each(all_users_list, (key, value) => {
      const result = $.grep(onlineUsers, (e) => e.userId == value.userId);

      if (value.last_seen_date !== '' && value.userName != 'Anonymous') {
        var userListHtml = getHtmlOfUsersList(
          value.userId, value.userName,
          value.imageUrl, false, value.about, value.homepage, 
          (result.length) ? 'Online' : shared.getCustomDate(value.last_seen_date) 
        );
  
        ep_profile_user_list_container_pagination.append(userListHtml);
    
      } 

      if (result.length) { // online
        if (value.userName == 'Anonymous') {
          const selector_on = $('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');

          if (selector_on.length) {
            increaseToOnlineAnonymous(selector_on, value.userId);
          } else {
            var userListHtml = getHtmlOfUsersList(value.userId, value.userName, value.imageUrl, 'on_Anonymous', value.about, value.homepage, 'Online');
            ep_profile_user_list_container_pagination.append(userListHtml);
          }
          if (currentUserId == value.userId) { $(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({'margin-top': '28px'}); } // design
        }
      }
      

    })

    // just for anonymouse to be end of list
    $.each(all_users_list, (key, value) => {
      // if (value.userId != currentUserId){
      const result = $.grep(onlineUsers, (e) => e.userId == value.userId);
      if (!result.length) { // offline
        if (value.userName == 'Anonymous') {
          const selector_off = $('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');
          if (selector_off.length) {
            const anonymouseCount = selector_off.attr('data-anonymouseCount');
            const new_anonymouseCount = parseInt(anonymouseCount) + 1;

            const ids_data_off = selector_off.attr('data-user-ids');
            const ids_data_off_array = ids_data_off.split(',');
            ids_data_off_array.push(value.userId);
            selector_off.attr('data-user-ids', ids_data_off_array.join(','));

            selector_off.attr('data-anonymouseCount', new_anonymouseCount);
            selector_off.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username').text(`Anonymous ×${new_anonymouseCount}`);
          } else {
            // createOfflineAnonymousElement(value.userId , value.imageUrl,value.about,value.homepage,)
            const userListHtml = getHtmlOfUsersList(value.userId, 'Anonymous', value.imageUrl, 'off_Anonymous', value.about, value.homepage);
            ep_profile_user_list_container_pagination.append(userListHtml);

          }
        }
      }
    });
  }
  const manageOnlineOfflineUsers = function (all_users_list, onlineUsers, currentUserId , lastPage) {
    const online_list_selector = $('#ep_profile_user_list_container');
    const offline_list_selector = $('#ep_profile_user_list_container_off');
    if(lastPage){
      $("#ep_profile_modal_load_more_contributors").css({"display":"none"})
    }else{
      $("#ep_profile_modal_load_more_contributors").css({"display":"block"})
    }
    //offline_list_selector.empty();
    $.each(all_users_list, (key, value) => {
      // if (value.userId != currentUserId){
      const result = $.grep(onlineUsers, (e) => e.userId == value.userId);
      if (result.length) { // online
        if (value.userName == 'Anonymous') {
          const selector_on = $('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');

          if (selector_on.length) {
            increaseToOnlineAnonymous(selector_on, value.userId);
          } else {
            var userListHtml = getHtmlOfUsersList(value.userId, value.userName, value.imageUrl, 'on_Anonymous', value.about, value.homepage, 'Online');
            online_list_selector.append(userListHtml);
          }
          if (currentUserId == value.userId) { $(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({'margin-top': '28px'}); } // design
        } else {
          if (!$(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).length) {
            var userListHtml = getHtmlOfUsersList(value.userId, value.userName, value.imageUrl, false, value.about, value.homepage, 'Online');
            try {
              online_list_selector.append(userListHtml);
            } catch (error) {
              console.log(error);
            }
          } else if (currentUserId == value.userId) {
            $(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).prependTo(online_list_selector);
            // $(".ep_profile_user_list_date_title_header").prependTo(online_list_selector)
          } else {
            $(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).appendTo(online_list_selector);
          }
          if (currentUserId == value.userId) { $(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).css({'margin-top': '28px'}); } // design
        }
      } else { // offline
        if (value.last_seen_date !== '') {
          if (value.userName != 'Anonymous') {
            if (!$(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).length) {
              var userListHtml = getHtmlOfUsersList(value.userId, value.userName, value.imageUrl, false, value.about, value.homepage, shared.getCustomDate(value.last_seen_date));
              const selector_offlines_date = $('#ep_profile_user_list_offline');
              if (selector_offlines_date.length) {
                selector_offlines_date.append(userListHtml);
              } else {
                $('#ep_profile_user_list_container_off').append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>   ${userListHtml}</div>`);
              }
            } else {
              $(`.ep_profile_user_row[data-id="user_list_${value.userId}"]`).appendTo(offline_list_selector);
            }
          }
        }
      }


      // }
    });

    // just for anonymouse to be end of list
    $.each(all_users_list, (key, value) => {
      // if (value.userId != currentUserId){
      const result = $.grep(onlineUsers, (e) => e.userId == value.userId);
      if (!result.length) { // offline
        if (value.userName == 'Anonymous') {
          const selector_off = $('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');
          if (selector_off.length) {
            const anonymouseCount = selector_off.attr('data-anonymouseCount');
            const new_anonymouseCount = parseInt(anonymouseCount) + 1;

            const ids_data_off = selector_off.attr('data-user-ids');
            const ids_data_off_array = ids_data_off.split(',');
            ids_data_off_array.push(value.userId);
            selector_off.attr('data-user-ids', ids_data_off_array.join(','));

            selector_off.attr('data-anonymouseCount', new_anonymouseCount);
            selector_off.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username').text(`Anonymous ×${new_anonymouseCount}`);
          } else {
            // createOfflineAnonymousElement(value.userId , value.imageUrl,value.about,value.homepage,)
            const userListHtml = getHtmlOfUsersList(value.userId, 'Anonymous', value.imageUrl, 'off_Anonymous', value.about, value.homepage, shared.getCustomDate(value.last_seen_date));
            const selector_offlines_date = $('#ep_profile_user_list_offline');
            if (selector_offlines_date.length) {
              selector_offlines_date.append(userListHtml);
            } else {
              $('#ep_profile_user_list_container_off').append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>  ${userListHtml}</div>`);
            }
          }
        }
      }
    });
  };

  var getHtmlOfUsersList = function (userId, username, img, anonymous_handler, about, homepage, seenStatus) {
    about = about || '';
    homepage = homepage || '';
    let style;
    if (anonymous_handler && username == 'Anonymous') {
      style = `background: url(${img}) no-repeat 50% 50% ; background-size : 69px ;`;

      return (`<div  data-user-ids='${userId}' data-anonymouseCount='1' data-id='user_list_${anonymous_handler}' class='ep_profile_user_row'>` +
					`<div style='${style}' class='ep_profile_user_img'></div>` +
					'<div class=\'ep_profile_user_list_profile_userDesc\'>' +
							`<div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >${username}</div>` +
							`<div class='ep_profile_contributor_status'>${seenStatus}</div>` +
							'</div>' +
							`<p class='ep_profile_user_list_profile_desc'>${about}</p>` +
					'</div> </div>');
    } else {
      style = `background: url(${img}) no-repeat 50% 50% ; background-size : 69px ;`;
      return (`<div data-id='user_list_${userId}' class='ep_profile_user_row'>` +
					`<div style='${style}' class='ep_profile_user_img'></div>` +
					'<div class=\'ep_profile_user_list_profile_userDesc\'>' +
							`<div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >${username}</div>` +
							`<a target='_blank' style='${(homepage == "" || homepage == "#" || homepage == undefined || homepage == null ) ? "display : none" : ""}'  class='ep_profile_contributor_link_container' title='${shared.getValidUrl(homepage)}' href='${shared.getValidUrl(homepage)}'> </a>` +
							`<div class='ep_profile_contributor_status'>${seenStatus}</div>` +
							'</div>' +
							`<p class='ep_profile_user_list_profile_desc'>${about}</p>` +
					'</div> </div>');
    }
  };


  const increaseToOnlineAnonymous = function (selector_on, userId) {
    const anonymouseCount = selector_on.attr('data-anonymouseCount');
    const ids_data = selector_on.attr('data-user-ids');
    const ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1) {
      ids_data_array.push(userId);
      selector_on.attr('data-user-ids', ids_data_array.join(','));
      const new_anonymouseCount = parseInt(anonymouseCount) + 1;
      selector_on.attr('data-anonymouseCount', new_anonymouseCount);
      selector_on.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username')
          .children('.ep_profile_user_list_username_text').text(`Anonymous ×${new_anonymouseCount}`);
    }
  };

  const decreaseFromOnlineAnonymous = function (selector_on, userId) {
    const anonymouseCount = selector_on.attr('data-anonymouseCount');
    const ids_data = selector_on.attr('data-user-ids');
    let ids_data_array = ids_data.split(',');


    ids_data_array = $.grep(ids_data_array, (value) => value != userId);


    selector_on.attr('data-user-ids', ids_data_array.join(','));
    const new_anonymouseCount = parseInt(anonymouseCount) - 1;
    selector_on.attr('data-anonymouseCount', new_anonymouseCount);
    if (new_anonymouseCount > 1) {
      selector_on.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username')
          .children('.ep_profile_user_list_username_text').text(`Anonymous ×${new_anonymouseCount}`);
    } else {
      selector_on.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username')
          .children('.ep_profile_user_list_username_text').text('Anonymous');
    }

    if (new_anonymouseCount < 1) {
      selector_on.remove();
    }
    return new_anonymouseCount;
  };


  const increaseToOfflineAnonymous = function (selector_off, userId) {
    const anonymouseCount = selector_off.attr('data-anonymouseCount');
    let ids_data = selector_off.attr('data-user-ids');

    ids_data = $.grep(ids_data, (value) => value != userId);

    selector_off.attr('data-user-ids', ids_data);
    const new_anonymouseCount = parseInt(anonymouseCount) + 1;
    selector_off.attr('data-anonymouseCount', new_anonymouseCount);
    selector_off.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username').children('.ep_profile_user_list_username_text')
        .text(`Anonymous ×${new_anonymouseCount}`);
  };


  // var decreaseFromOfflineAnonymous= function (selector_off,userId){
  //     var anonymouseCount = selector_off.attr("data-anonymouseCount")
  //     var ids_data = selector_off.attr("data-user-ids")

  //     ids_data = $.grep(ids_data, function(value) {
  //         return value != userId;
  //       });

  //     selector_off.attr("data-user-ids",ids_data)
  //     var new_anonymouseCount= parseInt(anonymouseCount)-1
  //     selector_off.attr('data-anonymouseCount',new_anonymouseCount);
  //     (new_anonymouseCount > 1) ? selector_off.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount) : selector_off.children(".ep_profile_user_username").text("Anonymous");
  //     return new_anonymouseCount
  // }


  const createOfflineAnonymousElement = function (userId, img, about, homepage, userElement) {
    const userListHtml = getHtmlOfUsersList(userId, 'Anonymous', img, 'off_Anonymous', about, homepage, 'Today');
    // $("#ep_profile_user_list_container_off").append(userListHtml);
    let offline_list_selector = $('#ep_profile_user_list_offline');
    if (offline_list_selector.length) {
      const user_selector = $(".ep_profile_user_row[data-id='user_list_off_Anonymous']"); // because need anonymous offline be last one
      if (user_selector.length) {
        userElement.insertBefore(user_selector);
      } else {
        offline_list_selector.append(userElement);
      }
    } else {
      const offline_container = $('#ep_profile_user_list_container_off');
      offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>");
      offline_list_selector = $('#ep_profile_user_list_offline');
      offline_list_selector.append(userListHtml);
    }
  };


  const createOnlineUserElementInUserList = function (userId, userName, img, currentUserId, user) {
    const user_selector = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (!user_selector.length) {
      const userListHtml = getHtmlOfUsersList(userId, userName, img, false, user.about, user.homepage, 'Online');
      if (userId == currentUserId) { // it is owner
        const titleOfContributors = $('#ep_profile_user_list_date_title');
        if (titleOfContributors.length) {
          $(userListHtml).insertAfter(titleOfContributors);
        } else {
          $('#ep_profile_user_list_container').prepend(userListHtml);
        }
      } else {
        $('#ep_profile_user_list_container').append(userListHtml);
      }
    } else {
      user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username').children('.ep_profile_user_list_username_text')
          .text(userName);
      user_selector.children('.ep_profile_user_img').css({'background-position': '50% 50%',
        'background-image': `url(${img})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});
      // attr("src",img);
    }
  };

  const isThereOnlineAnonymous = function () {
    const selector = $('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');
    if (selector.length) { return selector; } else { return false; }
  };
  const checkUserExistInOnlineAnonymous = function (selector_on, userId) {
    const ids_data = selector_on.attr('data-user-ids');
    const ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1) {
      return false;
    } else {
      return true;
    }
  };

  const createOnlineAnonymousElement = function (userId, userName, imageUrl, user) {
    const online_list_selector = $('#ep_profile_user_list_container');
    const userListHtml = getHtmlOfUsersList(userId, userName, imageUrl, 'on_Anonymous', user.about, user.homepage, 'Online');
    online_list_selector.append(userListHtml);
  };

  const moveOnlineUserToOffline = function (userElement) {
    let offline_list_selector = $('#ep_profile_user_list_offline');
    if (offline_list_selector.length) {
      const user_selector = $(".ep_profile_user_row[data-id='user_list_off_Anonymous']"); // because need anonymous offline be last one
      if (user_selector.length) {
        userElement.insertBefore(user_selector);
      } else {
        offline_list_selector.append(userElement);
      }
    } else {
      const offline_container = $('#ep_profile_user_list_container_off');
      offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>");
      offline_list_selector = $('#ep_profile_user_list_offline');
      offline_list_selector.append(userElement);
    }

    userElement.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username').children('.ep_profile_contributor_status').text('Last seen today');
  };

  const removeUserElementInUserList = function (userId) {
    $(`.ep_profile_user_row[data-id="user_list_${userId}"]`).remove();
  };

  return {
    createHTMLforUserList,
    increaseUserFromList,
    decreaseUserFromList,
    moveOnlineUserToOffline,
    decreaseFromOnlineAnonymous,
    increaseToOfflineAnonymous,
    createOfflineAnonymousElement,
    manageOnlineOfflineUsers,
    increaseToOnlineAnonymous,
    createOnlineUserElementInUserList,
    isThereOnlineAnonymous,
    checkUserExistInOnlineAnonymous,
    createOnlineAnonymousElement,
    removeUserElementInUserList,
    paginateContributors,
  };
})();

// var shared = require('../shared');
// var helper = require('../helper');

const profileForm = (() => {
  const allEventListener= function(){
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody');

    innerdocbody.on("keypress",function(e) {
      showModal()
    });
    innerdocbody.on("mousedown",function(event) {
      if(event.which == 1){
        showModal()
      }
    
      
      
  });
  }




  const removeEventListener =function(){
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const innerdocbody = padInner.contents().find('#innerdocbody')
    innerdocbody.off("keypress");
    innerdocbody.off("mousedown");

  }
  const showModal = function () {
    $('#ep_profile_formModal').addClass('ep_profile_formModal_show');
    $('#ep_profile_formModal_overlay').addClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'block'});

    setTimeout(() => { $('#ep_profile_modalForm_name').focus(); }, 1000);
  };
  const hideFormModalOverlay = function () {
    $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show');
    $('#ep_profile_formModal_overlay').css({display: 'none'});

    handleOnCloseOverlay();
  };
  const handleOnCloseOverlay = function () {
    const userId = pad.getUserId();
    const padId = pad.getPadId();
    const $form = $('#ep_profile_formModal_msform');
    const data = getFormData($form);
    const msg = {};
    localStorage.setItem("formPassed","yes")
    removeEventListener()
    console.log(localStorage.getItem("formStatus"),'ssssss')
    if (data.ep_profile_modalForm_name == '' || ['',null,undefined].includes(localStorage.getItem("formStatus"))) { return false; }
    // var message = {
    //     type : 'ep_profile_modal',
    //     action : "ep_profile_modal_send_chat_message" ,
    //     userId :  userId,
    //     data: data,
    //     padId : padId
    //     }
    // pad.collabClient.sendMessage(message);  // Send the chat position message to the server
    let text = `Please welcome ${data.ep_profile_modalForm_name}`;
    if (data.ep_profile_modalForm_about_yourself !== '') { text += `, ${data.ep_profile_modalForm_about_yourself}`; }
    if (data.ep_profile_modalForm_homepage !== '') {
      const url = shared.getValidUrl(data.ep_profile_modalForm_homepage);
      text += `, ${url}`;
      // text += `, ${message.data.ep_profile_modalForm_homepage} `
    }

    msg.messageChatText = `${text}`;
    msg.target = 'profile';
    msg.userId = userId;
    msg.time = new Date();

    // shared.addTextChatMessage(msg);
    const message = {
      type: 'ep_rocketchat',
      action: 'ep_rocketchat_sendMessageToChat_login',
      userId,
      data: msg,
      padId,
    };
    pad.collabClient.sendMessage(message); // Send the chat position message to the server
  };
  const resetModal = function () {
    const fieldsets = $('#ep_profile_formModal_msform fieldset');
    fieldsets.each(function (index) {
      if (index == 0) $(this).show(); else $(this).hide();
    });
  };
  const getFormData = function ($form) {
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};

    $.map(unindexed_array, (n, i) => {
      indexed_array[n.name] = n.value;
    });

    return indexed_array;
  };
  const initModal = function (clientVars) {
    const modal = $('#ep_profile_formModal_script').tmpl(clientVars);
    $('body').append(modal);

    // jQuery time
    let current_fs, next_fs, previous_fs; // fieldsets
    let left, opacity, scale; // fieldset properties which we will animate
    let animating; // flag to prevent quick multi-click glitches

    $('#ep_profile_formModal_msform fieldset').on('keypress', function (e) {
      if (e.keyCode == 13) {
        // Cancel the default action on keypress event
        e.preventDefault();
        current_fs = $(this);
        next_fs = $(this).next();
        nextHandler(current_fs, next_fs);
      }
    });
    $('.next').click(function () {
      current_fs = $(this).parent();
      next_fs = $(this).parent().next();
      nextHandler(current_fs, next_fs);
    });

    $('.skip').click(function () {
      if (animating) return false;
      $('#ep_profile_modalForm_name').css({border: '1px solid gray'});

      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      // activate next step on progressbar using the index of next_fs
      // $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      // show the next fieldset
      current_fs.hide();
      next_fs.show();
      animating = false;
    });


    $('.close , #ep_profile_formModal_overlay , .ep_profile_formModal_topClose').click(() => {
      $('#ep_profile_formModal').removeClass('ep_profile_formModal_show');

      hideFormModalOverlay();

      return false;
    });
    $('.previous').click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      // de-activate current step on progressbar
      // $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
      current_fs.hide();
      previous_fs.show();
      animating = false;
    });

    $('.submit').click(() => {
      submitHandle();
      return false;
    });
    $('.clear').click(function () {
      shared.resetAllProfileImage($(this).attr('data-userId'), $(this).attr('data-padId'));
    });

    function sendFormDataToServer() {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      const $form = $('#ep_profile_formModal_msform');
      const data = getFormData($form);
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_info',
        userId,
        data,
        padId,
      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
    }
    function submitHandle() {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      $('#ep_profile_formModal').removeClass('ep_profile_formModal_show');

      uploadImg();
      
      hideFormModalOverlay();

      sendFormDataToServer();

      const username = $('#ep_profile_modalForm_name').val();

      helper.userLogin({
        email: $('#ep_profile_modalForm_email').val(),
        username,
      });
      setTimeout(() => {
        helper.refreshUserImage(userId, padId);
      }, 2200);
      // sync profile section to up
    }


    function nextHandler(current_fs, next_fs) {
      if (animating) return false;

      const currentSection = current_fs.attr('data-section');
      localStorage.setItem("formStatus",currentSection)
      if (currentSection == 'name') {
        if ($('#ep_profile_modalForm_name').val() == '') {
          $('#ep_profile_modalForm_name').css({border: '1px solid red'});
          return false;
        }
        var username = $('#ep_profile_modalForm_name').val();
        $('#ep_profile_modalForm_name').css({border: '0px solid gray'});
        // submit username once user input and press next
        helper.userLogin({
          username,
        });
        shared.loginByEmailAndUsernameWithoutValidation(username, '', false);
      }
      if (currentSection == 'email') {
        const userEmail = $('#ep_profile_modalForm_email').val();
        if (!shared.isEmail(userEmail) || userEmail == '') {
          $('#ep_profile_modalForm_email').css({border: '1px solid red'});
          return false;
        }
        var username = $('#ep_profile_modalForm_name').val();
        shared.loginByEmailAndUsernameWithoutValidation(username, userEmail, true);
        sendEmailVerification(userEmail, username);
        $('#ep_profile_modalForm_email').css({border: '0px solid gray'});
      }

      if (currentSection == 'homepage') {
        const userLink = $('#ep_profile_modal_homepage').val();
        //console.log(shared.IsValid(userLink));
        if (!shared.IsValid(userLink) || userLink == '') {
          $('#ep_profile_modal_homepage').css({border: '1px solid red'});
          return false;
        }
        $('#ep_profile_modal_homepage').css({border: '0px solid gray'});
        sendFormDataToServer();
      }

      // if (currentSection == 'image') {
      //   uploadImg();
      // }


      animating = true;
      current_fs.hide();
      if (next_fs.length) {
        next_fs.show();

        // focus handling
        const nextSelection = next_fs.attr('data-section');
        if (nextSelection == 'email') { $('#ep_profile_modalForm_email').focus().select(); }
        if (nextSelection == 'homepage') { $('#ep_profile_modal_homepage').focus().select(); }
        if (nextSelection == 'bio') { $('#ep_profile_modalForm_about_yourself').focus().select(); }
      } else { // seems last fieldset
        submitHandle();
      }
      animating = false;
    }


    function sendEmailVerification(email, username) {
      var oldText = $("#ep_profile_modal_verification").text()
      $.ajax({
        url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/${username}/${email}`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend() {
          // setting a timeout
          const image_url = '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';

          $('#ep_profile_modal_verification').text('Sending...');
        },
        error(xhr) { // if error occured
          $('#ep_profile_modal_verification').text('Error');
          setTimeout(() => {
            $('#ep_profile_modal_verification').text(oldText);
          }, 2000);
        },
        success(response) {
          $('#ep_profile_modal_verification').text('Verification email has been sent.');
          $('#ep_profile_modal_verification').attr('data-verification-status', 'true');
        },

      });
    }


    function uploadImg() {
      const userId = pad.getUserId();
      const fd = new FormData();
      const files = $('#profile_file_modal')[0].files[0];
      fd.append('file', files);
      if (!files) return;
      $.ajax({
        url: `/static/${clientVars.padId}/pluginfw/ep_profile_modal/upload/${userId}`,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        beforeSend() {
          // setting a timeout

          helper.refreshLoadingImage(userId, clientVars.padId);
        },
        error(xhr) { // if error occured
          helper.refreshUserImage(userId, clientVars.padId);
          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));

          switch (xhr.status) {
            case 413:
              $.gritter.add({
                'title': 'Error',
                'text': 'ep_profile_modal: image size is large.',
                'sticky': true,
                'class_name': 'error'
              });
                 // Take action, referencing xhr.responseText as needed.
          }
        },
        success(response) {
          helper.refreshUserImage(userId, clientVars.padId);

          $('#profile_modal_selected_image').attr('style', (i, style) => style && style.replace(/background-image[^;]+;?/g, ''));
        },

      });
    }


    // upload image profile
    $('#profile_file_modal').on('change', (e) => {
      const files = $('#profile_file_modal')[0].files[0];

      const url = URL.createObjectURL(files);
      $('#profile_modal_selected_image').css({'background-position': '50% 50%',
        'background-image': `url(${url})`, 'background-repeat': 'no-repeat', 'background-size': '64px'});
    });
  };


  return {
    showModal,
    hideFormModalOverlay,
    handleOnCloseOverlay,
    resetModal,
    getFormData,
    initModal,
    allEventListener,
  };
})();

// var shared = require('../shared');

const usersProfileSection = (() => {
  const initiate = function (clientVars) {
    const modal = $('#ep_profile_users_profile_script').tmpl(clientVars);
    $('body').append(modal);
    // $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')
  };

  const initiateListeners = function () {


    const avatarListerner = (userId)=>{
      const padId = pad.getPadId();
      $.ajax({
        url: `/static/${padId}/pluginfw/ep_profile_modal/getUserInfo/${userId}`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend() {
          const image_url = '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
          $('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
            'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});//, 'background-color': '#3873E0'
          //$('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
          $('#ep_profile_users_profile_name').text("");
          $('#ep_profile_users_profile_desc').text("");

          $('#ep_profile_users_profile').addClass('ep_profile_formModal_show');
          shared.showGeneralOverlay();


        },
        error(xhr) { // if error occured
          $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
          shared.hideGeneralOverlay();
        },
        success(response) {
          const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
          let username = response.user.username;
          if (username == null || username == '') { username = 'Anonymous'; }
          const about = response.user.about || '';
          const homepage = response.user.homepage || '';

          $('#ep_profile_users_profile_name').text(username);
          $('#ep_profile_users_profile_desc').text(about);
          if (homepage =="" ){
            $('#ep_profile_users_profile_homepage').hide()
          }else{
            $('#ep_profile_users_profile_homepage').attr({href: shared.getValidUrl(homepage), target: '_blank'});
          }
  
          $('#ep_profile_users_profile_userImage').css({'background-position': '50% 50%',
            'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '69px'});//, 'background-color': '#3873E0'
        },
      });
    }


    $('#usersIconList').on('avatarClick',function(e,userIdParam){ // coming from external plugins
      if (!userIdParam || (userIdParam.indexOf("a.") < 0) ) return;
      avatarListerner(userIdParam)
    });

    $('#usersIconList').on('click', '.avatar', function () {
      const userId = $(this).attr('data-userId');
      avatarListerner(userId)
    });


    $('#ep_profile_users_profile_close').on('click', () => {
      $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show');
      shared.hideGeneralOverlay();
    });
  };

  return {
    initiate,
    initiateListeners,
  };
})();

// var usersProfileSection = require('./userProfileSection/userProfileSection');
// var shared = require('./shared');
// var helper = require('./helper');
// var profileForm = require('./profileForm/main');
// var syncData = require('./syncData');
const __LOGOUT= '1';
const __LOGIN= '2';


const postAceInit = (() => {
  const postAceInit = function (hook, context) {
    // console.log("samir",pad )
    // console.log("samir",pad.collabClient )
    // console.log("samir",pad.collabClient.getConnectedUsers())
    // /static/getUserProfileImage/${clientVars.userId}?t=${clientVars.serverTimestamp}

    usersProfileSection.initiateListeners();

    $('#ep_profile_modal_save').on('click', () => {
      const userId = pad.getUserId();
      const padId = pad.getPadId();
      const username = $('#ep_profile_modal-username');
      const email = $('#ep_profile_modal-email');
      const about = $('#ep_profile_modal-about');
      const homepage = $('#ep_profile_modal-homepage');
      // var pushNotification = $("#ep_profile_modal_push_notification").checked;
      // validations
      if (username.val() == '') {
        username.css({border: '1px solid red'});
        return false;
      }
      username.css({border: '0'});

      // const userEmail = email.val();
      // if (!shared.isEmail(userEmail) || userEmail == '') {
      //   email.css({border: '1px solid red'});
      //   return false;
      // }
      // email.css({border: '0'});

      // const userLink = homepage.val();
      // if (!shared.IsValid(userLink) && userLink !== '') {
      //   homepage.css({border: '1px solid red'});
      //   return false;
      // }
      // homepage.css({border: 'unset'});

      // validations

      const $form = $('#ep_profile_modal_one');
      const data = shared.getFormData($form);

      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_info',
        userId,
        data,
        padId,
      };
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      pad.collabClient.updateUserInfo({
        userId: padId,
        name: username.val(),
        colorId: '#b4b39a',
      });

      // //
      if (window.user_status == 'login') {
        if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
          $('#ep_profile_modal').removeClass('ep_profile_modal-show');
          shared.hideGeneralOverlay();
        } else {
          $('#ep_profile_modal').addClass('ep_profile_modal-show');

          $('#online_ep_profile_modal_status').show();
          $('#offline_ep_profile_modal_status').hide();

          shared.showGeneralOverlay();
        }
      }
      // else{
      // 	($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
      // 	$('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
      // 	:
      // 	$('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
      // }
    });

    $('#userlist_count').on('click',()=>{
      var page = $("#ep_profile_modal_user_list").attr("data-page") || 1;
      var pageLoaded = $("#ep_profile_modal_user_list").attr("data-pageLoaded") || false;
      const online_list_selector = $('#ep_profile_user_list_container');

      if(pageLoaded!=="true"){
        $.ajax({
          url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${page}/`,
          type: 'get',
          data: {},
          contentType: false,
          processData: false,
          beforeSend() {
            // setting a timeout
            //$('#contributorsLoading').show();
            $('#ep_profile_user_list_container').css({"display":"none"})
            $("#ep_profile_modal_load_more_contributors").css({"display":"none"})
            online_list_selector.css({"display":"none"})
          },
          error(xhr) { // if error occured
            $('#contributorsLoading').css({"display":"none"});
            online_list_selector.css({"display":"block"})
          },
          success(response) {
            online_list_selector.css({"display":"block"})
            $('#contributorsLoading').css({"display":"none"});
            $('#ep_profile_user_list_container').css({"display":"block"})
            $("#ep_profile_modal_user_list").attr("data-pageLoaded","true")
            const onlineUsers = pad.collabClient.getConnectedUsers();
            contributors.manageOnlineOfflineUsers(response.data, onlineUsers, pad.getUserId(),response.lastPage);
          },

        });
      }

      
    })

    $("#ep_profile_modal_load_more_contributors").on("click",()=>{
      var page = $("#ep_profile_modal_user_list").attr("data-page") || 1;
      page++;
      $.ajax({
        url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${page}/`,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend() {
          // setting a timeout
          $('#loadMoreLoading').show();
          $("#ep_profile_modal_load_more_contributors").css({"display":"none"})
          
        },
        error(xhr) { // if error occured
          $('#loadMoreLoading').hide();
          $("#ep_profile_modal_load_more_contributors").css({"display":"block"})

        },
        success(response) {
          $("#ep_profile_modal_load_more_contributors").css({"display":"block"})
          $('#loadMoreLoading').hide();
          $("#ep_profile_modal_user_list").attr("data-page",page)
          const onlineUsers = pad.collabClient.getConnectedUsers();
          contributors.manageOnlineOfflineUsers(response.data, onlineUsers, pad.getUserId(),response.lastPage);
        },

      });
 
    })

    $('#userlist_count,#ep_profile_modal_user_list_close').on('click', () => {
      if ($('#ep_profile_modal_user_list').hasClass('ep_profile_modal-show')) {
        $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show');
        shared.hideGeneralOverlay();
      } else {
        shared.showGeneralOverlay();
        $('#ep_profile_modal_user_list').addClass('ep_profile_modal-show');
      }
    });

    $('#ep_profile_modal_verification').on('click', function () {
      const verificationStatus = $(this).attr('data-verification-status');
      const oldText = $(this).text();
      if (verificationStatus != 'true') {
        $.ajax({
          url: `/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/null/null`,
          type: 'get',
          data: {},
          contentType: false,
          processData: false,
          beforeSend() {
            // setting a timeout
            const image_url = '../static/plugins/ep_profile_modal/static/dist/img/loading.gif';

            $('#ep_profile_modal_verification').text('Sending...');
          },
          error(xhr) { // if error occured
            $('#ep_profile_modal_verification').text('Error');
            setTimeout(() => {
              $('#ep_profile_modal_verification').text(oldText);
            }, 2000);
          },
          success(response) {
            $('#ep_profile_modal_verification').text('Verification email has been sent.');
            $('#ep_profile_modal_verification').attr('data-verification-status', 'true');
          },

        });
      }
      return false;
    });
    $('#ep_profile_modal_share').on('click', () => {
      const dummy = document.createElement('input');
      const text = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      $.gritter.add({
        text: 'Link copied to clipboard',
      });
    });

    $('#ep-profile-button').on('click', () => {
      if (window.user_status == 'login') {
        if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
          $('#ep_profile_modal').removeClass('ep_profile_modal-show');
        } else {
          $('#ep_profile_modal').addClass('ep_profile_modal-show');
          $('#online_ep_profile_modal_status').show();
          $('#offline_ep_profile_modal_status').hide();
          shared.showGeneralOverlay();
        }
      } else {
        // ($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))?
        // $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
        // :
        // $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
        profileForm.resetModal();

        profileForm.showModal();
      }
    });

    $('#ep_profile_modal_close').on('click', () => {
      if ($('#ep_profile_modal').hasClass('ep_profile_modal-show')) {
        $('#ep_profile_modal').removeClass('ep_profile_modal-show');
        shared.hideGeneralOverlay();
      } else {
        shared.showGeneralOverlay();
        $('#ep_profile_modal').addClass('ep_profile_modal-show');
      }
    });
    $('#ep_profile_modal_close_ask').on('click', () => {
      ($('#ep_profile_modal_ask').hasClass('ep_profile_modal-show'))
        ? $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
        :		$('#ep_profile_modal_ask').addClass('ep_profile_modal-show');
    });


    $('#ep_profile_modal_signout').on('click', () => {
      profileForm.resetModal();

      const userId = pad.getUserId();
      const padId = pad.getPadId();
      localStorage.setItem("formStatus",'')
      clientVars.ep_profile_modal.user_status = __LOGOUT

      window.user_status = 'out';
      const message = {
        type: 'ep_profile_modal',
        action: 'ep_profile_modal_logout',
        email: $('#ep_profile_hidden_email').val(),
        userId,
        padId,

      };
      clientVars.ep_profile_modal.user_status = __LOGOUT
      pad.collabClient.sendMessage(message); // Send the chat position message to the server
      $('#ep_profile_modal').removeClass('ep_profile_modal-show');
      $('#online_ep_profile_modal_status').hide();
      $('#offline_ep_profile_modal_status').show();
      // $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
      syncData.resetProfileModalFields();
      // $('#ep_profile_modal').addClass('ep_profile_modal-show')
      // shared.showGeneralOverlay()
      shared.hideGeneralOverlay();
      // shared.sendSignOutMessage(userId,padId)
      $(`.avatar[data-id="user_${userId}"]`).attr({style: ''});
      helper.userLogout();
    });


    // upload image profile
    $('#profile_file').on('change', (e) => {
      const userId = pad.getUserId();
      const fd = new FormData();
      const files = $('#profile_file')[0].files[0];
      fd.append('file', files);
      if (!files) return;
      $.ajax({
        url: `/static/${clientVars.padId}/pluginfw/ep_profile_modal/upload/${userId}`,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        beforeSend() {
          // setting a timeout
          helper.refreshLoadingImage(userId, clientVars.padId);
        },
        error(xhr) { // if error occured
          helper.refreshUserImage(userId, clientVars.padId);
        },
        success(response) {
          helper.refreshUserImage(userId, clientVars.padId);
        },

      });
    });

    $('#ep_profile_modal_submit').on('click', () => {
      const username = $('#ep_profile_modal_username').val();
      const email = $('#ep_profile_modal_email').val();

      shared.loginByEmailAndUsername(username, email);
    });

    $('#ep_profile_modal_login').on('click', () => {
      const username = $('#ep_profile_modal-username').val();
      const email = $('#ep_profile_modal-email').val();

      shared.loginByEmailAndUsername(username, email);
      $('#ep_profile_modal').removeClass('ep_profile_modal-show');
    });

    $('#ep_profile_general_overlay').on('click', () => {
      shared.hideGeneralOverlay();
    });

    return [];
  };
  return postAceInit;
})();

// var contributors = require('./contributors/contributors');
// var profileForm = require('./profileForm/main');
// var usersProfileSection = require('./userProfileSection/userProfileSection');


const aceInitialized = (() => {
  const aceInitialized = (hook, context) => {

    const bindEvent= function(element, eventName, eventHandler) {
      if (element.addEventListener){
          element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
          element.attachEvent('on' + eventName, eventHandler);
      }
    }
    bindEvent(window,'message',
    function(e) {
      const eventName = e.data.eventName;
      if(eventName=='showEtherpadModal'){
        profileForm.showModal()
      }
    })


    const userId = pad.getUserId();
    // if (!window.matchMedia('(max-width: 720px)').matches) {
    profileForm.initModal(clientVars);
    // if (clientVars.ep_profile_modal.form_passed !== true) {
    //   profileForm.showModal();
    // }
    if (localStorage.getItem("formPassed") != "yes")
      profileForm.allEventListener()
    //   profileForm.showModal();
    
    // / user profile section
    usersProfileSection.initiate(clientVars);
    // / user profile section

    //template generate 
    $('body').append(modal);
    // /
    var modal = $('#ep_profile_modal_script').tmpl(clientVars);
    $('body').append(modal);
    // /
    modal = $('#ep_profile_modal_user_list_script').tmpl(clientVars);
    $('body').append(modal);
    // /general
    modal = $('#ep_profile_modal_general_script').tmpl();
    $('body').append(modal);
    //template generate 

    const style = `background : url(/static/getUserProfileImage/${userId}/${clientVars.padId}) no-repeat 50% 50% ; background-size :32px`;
    const onlineUsers = pad.collabClient.getConnectedUsers();
    const usersListHTML = contributors.createHTMLforUserList(clientVars.ep_profile_modal.contributed_authors_count, onlineUsers, clientVars.padId, clientVars.ep_profile_modal.verified);

    $('#pad_title').append(`<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>${usersListHTML}</div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image' style='${style}' /></div></div>`);

    if (clientVars.ep_profile_modal.user_status == '2') {
      window.user_status = 'login';
    } else {
      window.user_status = 'out';
      // if (clientVars.ep_profile_modal.form_passed == true) {
      //   setTimeout(() => {
      //     profileForm.showModal();

      //     // $('#ep_profile_modal_ask').addClass('ep_profile_modal-show')
      //   }, 1000);
      // }
    }
    // We were telling to server that we are ready to get data that due to large data need to be request base over HTTP + just for analytics
    const message = {
      type: 'ep_profile_modal',
      action: 'ep_profile_modal_ready',
      userId,
      padId: clientVars.padId,
      data: clientVars.ep_profile_modal,
    };
    pad.collabClient.sendMessage(message);
    if (clientVars.ep_profile_modal.userName == 'Anonymous') {
      pad.collabClient.updateUserInfo({
        userId,
        name: 'Anonymous',
        colorId: '#b4b39a',
      });
    }
    // }


    return [];
  };

  return aceInitialized;
})();

// var helper = require('./helper');
// var contributors = require('./contributors/contributors');
// var syncData = require('./syncData');
// var shared = require('./shared');


const handleClientMessage = (() => {
  const handleClientMessage_USER_NEWINFO = (hook, context) => {
    const padId = pad.getPadId();

    contributors.increaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_USER_LEAVE = (hook, context) => {
    const padId = pad.getPadId();

    contributors.decreaseUserFromList(context.payload.userId, padId);
    return [];
  };
  const handleClientMessage_CUSTOM = (hook, context, cb) => {
    const current_user_id = pad.getUserId();

    if (context.payload.action == 'totalUserHasBeenChanged') {
      const totalUserCount = context.payload.totalUserCount;
      $('#userlist_count').text(totalUserCount);
      // var style = "background : url(/static/getUserProfileImage/"+current_user_id+"/"+ clientVars.padId +") no-repeat 50% 50% ; background-size :32px"
      // var onlineUsers = pad.collabClient.getConnectedUsers();
      // var usersListHTML = contributors.createHTMLforUserList( context.payload.totalUserCount,onlineUsers,context.payload.padId,
      // context.payload.verified_users)
      // $("#pad_title").append("<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>"+usersListHTML+"</div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image' style='"+style+"' /></div></div>")
      // var tmplObject = {
      // 	onlineUsers : onlineUsers.reverse(),
      // 	totalUserCount : context.payload.totalUserCount ,
      // 	padId : context.payload.padId,
      // 	verified_users : context.payload.verified_users
      // }
      // modal = $("#ep_profile_modal_user_list_script").tmpl(tmplObject,
      // 	{
      // 	  isInArray: function (items , needle) {
      // 		return items.indexOf(needle);
      // 	  }
      // 	});
    }

    // if (context.payload.action == 'EP_PROFILE_MODAL_PROMPT_DATA') { // when we quess user by exist data prompt
    //   // if (confirm('Do you want to prefill your existing data?')) {
    //   // 	//for set image
    //   // 	if (context.payload.data.image){
    //   // 		var message = {
    //   // 			type : 'ep_profile_modal',
    //   // 			action : "ep_profile_modal_prefill" ,
    //   // 			userId :  context.payload.userId,
    //   // 			data: context.payload.data,
    //   // 			padId : context.payload.padId
    //   // 		  }
    //   // 		pad.collabClient.sendMessage(message);  // Send the chat position message to the server
    //   // 	}

    //   // 	$("#ep_profile_modal_homepage").val(context.payload.data.homepage)
    //   // 	$("#ep_profile_modalForm_about_yourself").val(context.payload.data.about)
    //   // 	$("#profile_modal_selected_image").css({"background-position":"50% 50%",
    //   // 	"background-image":"url("+context.payload.data.image+")" , "background-repeat":"no-repeat","background-size": "64px"
    //   // 	});
    //   // 	// Save it!
    //   // }else{
    //   // 	var message = {
    //   // 		type : 'ep_profile_modal',
    //   // 		action : "ep_profile_modal_prefill" ,
    //   // 		userId :  context.payload.userId,
    //   // 		data: {
    //   // 			image:""
    //   // 		},
    //   // 		padId : context.payload.padId
    //   // 	  }
    //   // 	pad.collabClient.sendMessage(message);
    //   // }
    //   // var image_url = `/static/getUserProfileImage/${context.payload.userId}/${context.payload.padId}?t=${new Date().getTime()}`;
    //   // $('#ep_profile_modal_homepage').val(context.payload.data.homepage);
    //   // $('#ep_profile_modalForm_about_yourself').val(context.payload.data.about);
    //   // $('#profile_modal_selected_image').css({'background-position': '50% 50%',
    //   //   'background-image': `url(${image_url})`, 'background-repeat': 'no-repeat', 'background-size': '64px'});
    // }
    
    // if (context.payload.action == 'EP_PROFILE_USERS_LIST') {
    //   const onlineUsers = pad.collabClient.getConnectedUsers();
    //   contributors.manageOnlineOfflineUsers(context.payload.list, onlineUsers, pad.getUserId());
    // }

    if (context.payload.action == 'EP_PROFILE_USER_IMAGE_CHANGE') { // when user A change image and user B want to know
      helper.refreshGeneralImage(context.payload.userId, context.payload.padId);
    }

    if (context.payload.action == 'EP_PROFILE_USER_LOGOUT_UPDATE') {
      var image_url = `/static/getUserProfileImage/${context.payload.userId}/${context.payload.padId}?t=${new Date().getTime()}`;

      if (current_user_id == context.payload.userId) {
        helper.refreshUserImage(current_user_id, context.payload.padId);
        helper.logoutCssFix(current_user_id);

        //			$("#ep_profile_modal_section_info_name").text(context.payload.userName);
      } else {
        helper.refreshGeneralImage(context.payload.userId, context.payload.padId);
      }

      syncData.resetGeneralFields(context.payload.userId);

      // making user as anonymous
      var online_anonymous_selector = contributors.isThereOnlineAnonymous();
      if (online_anonymous_selector) {
        contributors.increaseToOnlineAnonymous(online_anonymous_selector, context.payload.userId);
      } else {
        contributors.createOnlineAnonymousElement(context.payload.userId, 'Anonymous', image_url, {});
      }

      contributors.removeUserElementInUserList(context.payload.userId);
    }

    // if (context.payload.action == 'EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT') {
    //   shared.addTextChatMessage(context.payload.msg);
    // }
    if (context.payload.action == 'EP_PROFILE_USER_LOGIN_UPDATE') {
      // ///////////////// related to user list when user has been loginned
      var online_anonymous_selector = contributors.isThereOnlineAnonymous();
      if (context.payload.userName == 'Anonymous') {
        if (online_anonymous_selector) {
          contributors.increaseToOnlineAnonymous(online_anonymous_selector, context.payload.userId);
        } else {
          contributors.createOnlineAnonymousElement(context.payload.userId, context.payload.userName, context.payload.img, context.payload.user);
        }

        contributors.removeUserElementInUserList(context.payload.userId);
      } else {
        if (online_anonymous_selector) {
          if (contributors.checkUserExistInOnlineAnonymous(online_anonymous_selector, context.payload.userId)) {
            contributors.decreaseFromOnlineAnonymous(online_anonymous_selector, context.payload.userId);
          }
        }
        contributors.createOnlineUserElementInUserList(context.payload.userId, context.payload.userName, context.payload.img, current_user_id, context.payload.user);
      }


      // change owner loginned img at top of page
      if (current_user_id == context.payload.userId) {
        helper.refreshUserImage(current_user_id, context.payload.padId);
        syncData.syncAllFormsData(context.payload.userId, context.payload.user);

        // $("#ep_profile_modal_section_info_name").text(context.payload.userName);
      } else {
        helper.refreshGeneralImage(context.payload.userId, context.payload.padId);
        syncData.syncGeneralFormsData(context.payload.userId, context.payload.user);
      }
    }

    return [];
  };
  return {
    handleClientMessage_USER_NEWINFO,
    handleClientMessage_USER_LEAVE,
    handleClientMessage_CUSTOM,

  };
})();

const helper = (() => {
  const userLogin = function (data) {
    window.user_status = 'login';
    clientVars.ep_profile_modal.user_status = __LOGIN

    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: data.username,
      colorId: '#b4b39a',
    });
  };
  const userLogout = function () {
    window.user_status = 'logout';
    clientVars.ep_profile_modal.user_status = __LOGOUT

    
    pad.collabClient.updateUserInfo({
      userId: pad.getUserId(),
      name: 'Anonymous',
      colorId: '#b4b39a',
    });
  };
  const logoutCssFix = function (userId) {
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({'margin': '0px', 'box-shadow': 'none'});
    }
  };
  const refreshUserImage = function (userId, padId) {
    const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }

    const rocketChatOnlineUser = $(
      `.avatar[data-id="${userId}"]`
    );
    if (rocketChatOnlineUser.length) {
      rocketChatOnlineUser
          .children('.ep_rocketchat_onlineUsersList_avatarImg')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '28px',
          });
    }
  };

  const refreshLoadingImage = function (userId, padId) {
    const image_url =
			'../static/plugins/ep_profile_modal/static/dist/img/loading.gif';
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    $('.ep_profile_modal_section_image_big_ask').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
    });
    $('.ep_profile_modal_section_image_big').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '72px',
    });
    $('#ep-profile-image').css({
      'background-position': '50% 50%',
      'background-image': `url(${image_url})`,
      'background-repeat': 'no-repeat',
      'background-size': '32px',
    });

    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  const refreshGeneralImage = function (userId, padId) {
    const image_url = `/static/getUserProfileImage/${userId}/${padId}?t=${new Date().getTime()}`;
    const avatar = $(`.avatarImg[data-id="user_${userId}"]`);
    if (avatar.length) {
      avatar.css({
        'background-position': '50% 50%',
        'background-image': `url(${image_url})`,
        'background-repeat': 'no-repeat',
        'background-size': '28px',
        'background-color': '#fff',
      });
    }
    const user_selector = $(
        `.ep_profile_user_row[data-id="user_list_${userId}"]`
    );
    if (user_selector.length) {
      user_selector
          .children('.ep_profile_user_img')
          .css({
            'background-position': '50% 50%',
            'background-image': `url(${image_url})`,
            'background-repeat': 'no-repeat',
            'background-size': '69px',
          });
    }
  };

  return {
    userLogin,
    userLogout,
    logoutCssFix,
    refreshUserImage,
    refreshLoadingImage,
    refreshGeneralImage,
  };
})();

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
    clientVars.ep_profile_modal.user_status = __LOGIN

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
      clientVars.ep_profile_modal.user_status = __LOGIN

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
    console.log("date",date)
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

// var shared = require('./shared');


const syncData = (() => {
  const syncAllFormsData = function (userId, data) {
    if (data === undefined)
      return;
    // users List
    const user_selector = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (user_selector.length) {
      const usernameBox = user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username');
      usernameBox.children('.ep_profile_user_list_username_text').text(data.username);

      user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_profile_desc').text(data.about);
      if (data.homepage) {
        const homepageElem = usernameBox.children('.ep_profile_contributor_link_container');
        homepageElem.attr({href: shared.getValidUrl(data.homepage)});
      }
      usernameBox.children('.ep_profile_contributor_status').text('Online');
    }
    // users list


    // profile card

    // $("#ep_profile_users_profile_name").text(data.username)
    // $("#ep_profile_users_profile_desc").text(data.about)
    // $("#ep_profile_users_profile_homepage").attr({"href":data.homepage})
    // $("#ep_profile_users_profile_homepage").text(data.homepage)

    // profile card

    // profile modal

    $('#ep_profile_modal-username').val(data.username);
    $('#ep_profile_modal-about').val(data.about);
    $('#ep_profile_modal-homepage').val(data.homepage);
    $('#ep_profile_modal-email').val(data.email);
    if (data.verified == true) {
      $('#ep_profile_modal_verification').attr('data-verification-status', 'true');
      $('#ep_profile_modal_verification').text('Verified');
    } else {
      $('#ep_profile_modal_verification').attr('data-verification-status', 'false');
      $('#ep_profile_modal_verification').text('Send verification email');
    }

    // if(data.push_notification == false)
    //     $("#ep_profile_modal_push_notification").attr('checked','')
    // else
    //     $("#ep_profile_modal_push_notification").attr('checked','checked')

    // profile modal
  };
  const syncGeneralFormsData = function (userId, data) {
    const user_selector = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (user_selector.length) {
      const usernameBox = user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username');
      usernameBox.children('.ep_profile_user_list_username_text').text(data.username);

      user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_profile_desc').text(data.about);

      const homepageElem = usernameBox.children('.ep_profile_contributor_link_container');
      homepageElem.attr({href: shared.getValidUrl(data.homepage)});


      usernameBox.children('.ep_profile_contributor_status').text('Online');
    }
  };


  const resetProfileModalFields = function () {
    $('#ep_profile_modal-username').val('');
    $('#ep_profile_modal-about').val('');
    $('#ep_profile_modal-homepage').val('');
    $('#ep_profile_modal-email').val('');

    $('#ep_profile_modalForm_name').val('');
    $('#ep_profile_modalForm_email').val('');
    $('#ep_profile_modal_homepage').val('');
    $('#ep_profile_modalForm_about_yourself').val('');
  };
  const resetGeneralFields = function (userId) {
    const user_selector = $(`.ep_profile_user_row[data-id="user_list_${userId}"]`);
    if (user_selector.length) {
      const usernameBox = user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_username');
      usernameBox.children('.ep_profile_user_list_username_text').text('');
      user_selector.children('.ep_profile_user_list_profile_userDesc').children('.ep_profile_user_list_profile_desc').text('');
      const homepageElem = usernameBox.children('.ep_profile_contributor_link_container');
      homepageElem.attr({href: ''});
      usernameBox.children('.ep_profile_contributor_status').text('');
    }
  };

  return {
    syncAllFormsData,
    syncGeneralFormsData,
    resetProfileModalFields,
    resetGeneralFields,
  };
})();
return {
documentReady
,contributors
,profileForm
,usersProfileSection
,postAceInit
,aceInitialized
,handleClientMessage
,helper
,shared
,syncData
}
})();