exports.moduleList=(()=>{const e=(e,o,r)=>{let a;const s=document.location,t=""==s.port?"https:"==s.protocol?443:80:s.port,i=`${s.protocol}//${s.hostname}:${t}/`,l=location.pathname.split("/"),_=l.slice(0,l.length-2).join("/")+"/",p=_.substring(1)+"socket.io",d=i+"pluginfw/admin/ep_profile_modal";switch(o){case"admin/ep_profile_modal":a=io.connect(d,{path:_+"socket.io",resource:p}),a.on("load-settings-result",e=>{console.log(e),n.setFormData($("#settings-form"),e)}),$("#save-settings").on("click",()=>{const e=n.getFormData($("#settings-form"));console.log(e,"data"),a.emit("save-settings",e),alert("Succesfully saved.")}),a.emit("load-settings");break;case"admin/ep_profile_modal_analytics":a=io.connect(d,{path:_+"socket.io",resource:p}),a.on("load-pads-result",e=>{console.log("load-pads",e),$.each(e,(function(e,o){$("#pads").append(`<option value="${o}">${o}</option>`)}))}),a.on("load-analytics-result",e=>{console.log("load-analytics",e),$.each(e.pad_users_data,(function(e,o){o.userId&&$("#users").append(`\n              <tr style="height: 0;">\n                <td>${o.email||o.userId}</td>\n                <td>${o.username}</td>\n                <td>${o.createDate}</td>\n                <td>${o.last_seen_date}</td>\n                <td>${o.verifiedDate||"-"}</td>\n                <td>${o.verified?"Verified":"unconfirmed"}</td>\n              </tr>\n              `)}))}),$("#pads").on("change",(function(){a.emit("load-analytics",{pad:this.value})})),a.emit("load-pads");break;default:return[]}},o=(()=>{var e=function(e,o,r,a,s,t,i){let l;return s=s||"",t=t||"",a&&"Anonymous"==o?(l=`background: url(${r}) no-repeat 50% 50% ; background-size : 69px ;`,`<div  data-user-ids='${e}' data-anonymouseCount='1' data-id='user_list_${a}' class='ep_profile_user_row'><div style='${l}' class='ep_profile_user_img'></div><div class='ep_profile_user_list_profile_userDesc'><div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >${o}</div><div class='ep_profile_contributor_status'>${i}</div></div><p class='ep_profile_user_list_profile_desc'>${s}</p></div> </div>`):(l=`background: url(${r}) no-repeat 50% 50% ; background-size : 69px ;`,`<div data-id='user_list_${e}' class='ep_profile_user_row'><div style='${l}' class='ep_profile_user_img'></div><div class='ep_profile_user_list_profile_userDesc'><div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >${o}</div><a target='_blank' style='${""==t||"#"==t||null==t||null==t?"display : none":""}'  class='ep_profile_contributor_link_container' title='${n.getValidUrl(t)}' href='${n.getValidUrl(t)}'> </a><div class='ep_profile_contributor_status'>${i}</div></div><p class='ep_profile_user_list_profile_desc'>${s}</p></div> </div>`)};const o=function(e,o){const r=e.attr("data-anonymouseCount"),a=e.attr("data-user-ids").split(",");if(-1==a.indexOf(o)){a.push(o),e.attr("data-user-ids",a.join(","));const s=parseInt(r)+1;e.attr("data-anonymouseCount",s),e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text("Anonymous ×"+s)}},r=function(e,o){const r=e.attr("data-anonymouseCount");let a=e.attr("data-user-ids").split(",");a=$.grep(a,e=>e!=o),e.attr("data-user-ids",a.join(","));const s=parseInt(r)-1;return e.attr("data-anonymouseCount",s),s>1?e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text("Anonymous ×"+s):e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text("Anonymous"),s<1&&e.remove(),s},a=function(e,o){const r=e.attr("data-anonymouseCount");let a=e.attr("data-user-ids");a=$.grep(a,e=>e!=o),e.attr("data-user-ids",a);const s=parseInt(r)+1;e.attr("data-anonymouseCount",s),e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text("Anonymous ×"+s)},s=function(o,r,a,s,t){const i=e(o,"Anonymous",r,"off_Anonymous",a,s,"Today");let l=$("#ep_profile_user_list_offline");if(l.length){const e=$(".ep_profile_user_row[data-id='user_list_off_Anonymous']");e.length?t.insertBefore(e):l.append(t)}else{$("#ep_profile_user_list_container_off").prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"),l=$("#ep_profile_user_list_offline"),l.append(i)}},t=function(e){let o=$("#ep_profile_user_list_offline");if(o.length){const r=$(".ep_profile_user_row[data-id='user_list_off_Anonymous']");r.length?e.insertBefore(r):o.append(e)}else{$("#ep_profile_user_list_container_off").prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"),o=$("#ep_profile_user_list_offline"),o.append(e)}e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_contributor_status").text("Last seen today")};return{createHTMLforUserList:function(e,o,r,a){let s,t="<div id='usersIconList' class='ep_profile_inlineAvatars'>",i="";return $.each(o.reverse(),(e,o)=>{s=`background: url(/static/getUserProfileImage/${o.userId}/${r}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;`,i=a?"box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;":"",s+=i,t+=`<div class='avatar' data-userId="${o.userId}" data-id="user_${o.userId}"  id="user_${o.userId}" ><div data-userId="${o.userId}"  class='avatarImg' style='${s}' data-id="user_${o.userId}"></div></div>`}),t+=" </div>",`${t}<span class='slash_profile'>⧸</span><span id='userlist_count' class='userlist_count'>${e}</span><input  value='Share'  id='ep_profile_modal_share' type='button' class='ep_profile_modal_share'>`},increaseUserFromList:function(e,o){const r=`background: url(/static/getUserProfileImage/${e}/${o}) no-repeat 50% 50% ; background-size : 26px;background-color: #fff;`;if(!$(`.avatar[data-id="user_${e}"]`).length){const o=$(`<div class='avatar' data-userId="${e}"  data-id="user_${e}" id="user_${e}" ><div class='avatarImg' data-userId="${e}"  data-id="user_${e}" style='${r}'></div></div>`);o.prependTo("#usersIconList"),o.hide().slideDown(200)}},decreaseUserFromList:function(e,o){$(`.avatar[data-id="user_${e}"]`).animate({opacity:0},1e3,"linear",(function(){$(this).remove()}));const i=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(i.length)t(i);else{const o=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');if(o.length){const t=$('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');r(o,e),t.length?a(t,e):s(e,"../static/plugins/ep_profile_modal/static/dist/img/user.png",null,null,i)}else{let o=$("#ep_profile_user_list_offline");if(o.length)o.append($(`.ep_profile_user_row[data-id="user_list_${e}"]`));else{$("#ep_profile_user_list_container_off").prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'> </div>"),o=$("#ep_profile_user_list_offline"),$(`.ep_profile_user_row[data-id="user_list_${e}"]`).appendTo(o)}}}const l=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,n=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);n.length&&n.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${l})`,"background-repeat":"no-repeat","background-size":"69px"})},moveOnlineUserToOffline:t,decreaseFromOnlineAnonymous:r,increaseToOfflineAnonymous:a,createOfflineAnonymousElement:s,manageOnlineOfflineUsers:function(r,a,s,t){const i=$("#ep_profile_user_list_container"),l=$("#ep_profile_user_list_container_off");t&&$("#ep_profile_modal_load_more_contributors").css({display:"none"}),l.empty(),$.each(r,(r,t)=>{if($.grep(a,e=>e.userId==t.userId).length)if("Anonymous"==t.userName){const r=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');if(r.length)o(r,t.userId);else{var _=e(t.userId,t.userName,t.imageUrl,"on_Anonymous",t.about,t.homepage,"Online");i.append(_)}s==t.userId&&$(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({"margin-top":"28px"})}else{if($(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).length)s==t.userId?$(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).prependTo(i):$(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).appendTo(i);else{_=e(t.userId,t.userName,t.imageUrl,!1,t.about,t.homepage,"Online");try{i.append(_)}catch(e){console.log(e)}}s==t.userId&&$(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).css({"margin-top":"28px"})}else if(""!==t.last_seen_date&&"Anonymous"!=t.userName)if($(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).length)$(`.ep_profile_user_row[data-id="user_list_${t.userId}"]`).appendTo(l);else{_=e(t.userId,t.userName,t.imageUrl,!1,t.about,t.homepage,n.getCustomDate(t.last_seen_date));const o=$("#ep_profile_user_list_offline");o.length?o.append(_):$("#ep_profile_user_list_container_off").append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>   ${_}</div>`)}}),$.each(r,(o,r)=>{if(!$.grep(a,e=>e.userId==r.userId).length&&""!==r.last_seen_date&&"Anonymous"==r.userName){const o=$('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');if(o.length){const e=o.attr("data-anonymouseCount"),a=parseInt(e)+1,s=o.attr("data-user-ids").split(",");s.push(r.userId),o.attr("data-user-ids",s.join(",")),o.attr("data-anonymouseCount",a),o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+a)}else{const o=e(r.userId,"Anonymous",r.imageUrl,"off_Anonymous",r.about,r.homepage,n.getCustomDate(r.last_seen_date)),a=$("#ep_profile_user_list_offline");a.length?a.append(o):$("#ep_profile_user_list_container_off").append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>  ${o}</div>`)}}})},increaseToOnlineAnonymous:o,createOnlineUserElementInUserList:function(o,r,a,s,t){const i=$(`.ep_profile_user_row[data-id="user_list_${o}"]`);if(i.length)i.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text(r),i.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px"});else{const i=e(o,r,a,!1,t.about,t.homepage,"Online");if(o==s){const e=$("#ep_profile_user_list_date_title");e.length?$(i).insertAfter(e):$("#ep_profile_user_list_container").prepend(i)}else $("#ep_profile_user_list_container").append(i)}},isThereOnlineAnonymous:function(){const e=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');return!!e.length&&e},checkUserExistInOnlineAnonymous:function(e,o){return-1!=e.attr("data-user-ids").split(",").indexOf(o)},createOnlineAnonymousElement:function(o,r,a,s){const t=$("#ep_profile_user_list_container"),i=e(o,r,a,"on_Anonymous",s.about,s.homepage,"Online");t.append(i)},removeUserElementInUserList:function(e){$(`.ep_profile_user_row[data-id="user_list_${e}"]`).remove()},paginateContributors:function(r,a,s,t){const i=$("#ep_profile_user_list_container_pagination");t&&$("#ep_profile_modal_load_more_contributors").css({display:"none"}),$.each(r,(r,t)=>{const l=$.grep(a,e=>e.userId==t.userId);if(""!==t.last_seen_date&&"Anonymous"!=t.userName){var _=e(t.userId,t.userName,t.imageUrl,!1,t.about,t.homepage,l.length?"Online":n.getCustomDate(t.last_seen_date));i.append(_)}if(l.length&&"Anonymous"==t.userName){const r=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');if(r.length)o(r,t.userId);else{_=e(t.userId,t.userName,t.imageUrl,"on_Anonymous",t.about,t.homepage,"Online");i.append(_)}s==t.userId&&$(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({"margin-top":"28px"})}}),$.each(r,(o,r)=>{if(!$.grep(a,e=>e.userId==r.userId).length&&""!==r.last_seen_date&&"Anonymous"==r.userName){const o=$('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');if(o.length){const e=o.attr("data-anonymouseCount"),a=parseInt(e)+1,s=o.attr("data-user-ids").split(",");s.push(r.userId),o.attr("data-user-ids",s.join(",")),o.attr("data-anonymouseCount",a),o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+a)}else{const o=e(r.userId,"Anonymous",r.imageUrl,"off_Anonymous",r.about,r.homepage,n.getCustomDate(r.last_seen_date));i.append(o)}}})}}})(),r=(()=>{const e=function(){$("#ep_profile_formModal_overlay").removeClass("ep_profile_formModal_overlay_show"),$("#ep_profile_formModal_overlay").css({display:"none"}),o()},o=function(){const e=pad.getUserId(),o=pad.getPadId(),a=$("#ep_profile_formModal_msform"),s=r(a),t={};if(localStorage.setItem("formPassed","yes"),""==s.ep_profile_modalForm_name)return!1;let i="Please welcome "+s.ep_profile_modalForm_name;if(""!==s.ep_profile_modalForm_about_yourself&&(i+=", "+s.ep_profile_modalForm_about_yourself),""!==s.ep_profile_modalForm_homepage){i+=`, <a target='_blank' href='${n.getValidUrl(s.ep_profile_modalForm_homepage)}'>${s.ep_profile_modalForm_homepage}</a>`}t.text=`<span><b>${i}</b></span>`,t.target="profile",t.userId=e,t.time=new Date;const l={type:"ep_profile_modal",action:"EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT",userId:e,data:t,padId:o};pad.collabClient.sendMessage(l)},r=function(e){const o=e.serializeArray(),r={};return $.map(o,(e,o)=>{r[e.name]=e.value}),r};return{showModal:function(){$("#ep_profile_formModal").addClass("ep_profile_formModal_show"),$("#ep_profile_formModal_overlay").addClass("ep_profile_formModal_overlay_show"),$("#ep_profile_formModal_overlay").css({display:"block"}),setTimeout(()=>{$("#ep_profile_modalForm_name").focus()},1e3)},hideFormModalOverlay:e,handleOnCloseOverlay:o,resetModal:function(){$("#ep_profile_formModal_msform fieldset").each((function(e){0==e?$(this).show():$(this).hide()}))},getFormData:r,initModal:function(o){const a=$("#ep_profile_formModal_script").tmpl(o);let s,t,i,_;function p(){const e=pad.getUserId(),o=pad.getPadId(),a=$("#ep_profile_formModal_msform"),s={type:"ep_profile_modal",action:"ep_profile_modal_info",userId:e,data:r(a),padId:o};pad.collabClient.sendMessage(s)}function d(){const o=pad.getUserId(),r=pad.getPadId();$("#ep_profile_formModal").removeClass("ep_profile_formModal_show"),e(),p();const a=$("#ep_profile_modalForm_name").val();l.userLogin({email:$("#ep_profile_modalForm_email").val(),username:a}),setTimeout(()=>{l.refreshUserImage(o,r)},2200)}function u(e,r){if(_)return!1;const a=e.attr("data-section");if("name"==a){if(""==$("#ep_profile_modalForm_name").val())return $("#ep_profile_modalForm_name").css({border:"1px solid red"}),!1;var s=$("#ep_profile_modalForm_name").val();$("#ep_profile_modalForm_name").css({border:"0px solid gray"}),l.userLogin({username:s}),n.loginByEmailAndUsernameWithoutValidation(s,"",!1)}if("email"==a){const e=$("#ep_profile_modalForm_email").val();if(!n.isEmail(e)||""==e)return $("#ep_profile_modalForm_email").css({border:"1px solid red"}),!1;s=$("#ep_profile_modalForm_name").val();n.loginByEmailAndUsernameWithoutValidation(s,e,!0),function(e,o){var r=$("#ep_profile_modal_verification").text();$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/${o}/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){$("#ep_profile_modal_verification").text("Sending...")},error(e){$("#ep_profile_modal_verification").text("Error"),setTimeout(()=>{$("#ep_profile_modal_verification").text(r)},2e3)},success(e){$("#ep_profile_modal_verification").text("Verification email has been sent."),$("#ep_profile_modal_verification").attr("data-verification-status","true")}})}(e,s),$("#ep_profile_modalForm_email").css({border:"0px solid gray"})}if("homepage"==a){const e=$("#ep_profile_modal_homepage").val();if(console.log(n.IsValid(e)),!n.IsValid(e)||""==e)return $("#ep_profile_modal_homepage").css({border:"1px solid red"}),!1;$("#ep_profile_modal_homepage").css({border:"0px solid gray"}),p()}if("image"==a&&function(){const e=pad.getUserId(),r=new FormData,a=$("#profile_file_modal")[0].files[0];if(r.append("file",a),!a)return;$.ajax({url:`/static/${o.padId}/pluginfw/ep_profile_modal/upload/${e}`,type:"post",data:r,contentType:!1,processData:!1,beforeSend(){l.refreshLoadingImage(e,o.padId)},error(r){l.refreshUserImage(e,o.padId),$("#profile_modal_selected_image").attr("style",(e,o)=>o&&o.replace(/background-image[^;]+;?/g,""))},success(r){l.refreshUserImage(e,o.padId),$("#profile_modal_selected_image").attr("style",(e,o)=>o&&o.replace(/background-image[^;]+;?/g,""))}})}(),_=!0,e.hide(),r.length){r.show();const e=r.attr("data-section");"email"==e&&$("#ep_profile_modalForm_email").focus().select(),"homepage"==e&&$("#ep_profile_modal_homepage").focus().select(),"bio"==e&&$("#ep_profile_modalForm_about_yourself").focus().select()}else d();_=!1}$("body").append(a),$("#ep_profile_formModal_msform fieldset").on("keypress",(function(e){13==e.keyCode&&(e.preventDefault(),s=$(this),t=$(this).next(),u(s,t))})),$(".next").click((function(){s=$(this).parent(),t=$(this).parent().next(),u(s,t)})),$(".skip").click((function(){if(_)return!1;$("#ep_profile_modalForm_name").css({border:"1px solid gray"}),_=!0,s=$(this).parent(),t=$(this).parent().next(),s.hide(),t.show(),_=!1})),$(".close , #ep_profile_formModal_overlay , .ep_profile_formModal_topClose").click(()=>($("#ep_profile_formModal").removeClass("ep_profile_formModal_show"),e(),!1)),$(".previous").click((function(){if(_)return!1;_=!0,s=$(this).parent(),i=$(this).parent().prev(),s.hide(),i.show(),_=!1})),$(".submit").click(()=>(d(),!1)),$(".clear").click((function(){n.resetAllProfileImage($(this).attr("data-userId"),$(this).attr("data-padId"))})),$("#profile_file_modal").on("change",e=>{const o=$("#profile_file_modal")[0].files[0],r=URL.createObjectURL(o);$("#profile_modal_selected_image").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"64px"})})}}})(),a={initiate:function(e){const o=$("#ep_profile_users_profile_script").tmpl(e);$("body").append(o)},initiateListeners:function(){$("#usersIconList").on("click",".avatar",(function(){const e=$(this).attr("data-userId"),o=pad.getPadId();$.ajax({url:`/static/${o}/pluginfw/ep_profile_modal/getUserInfo/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){$("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%","background-image":"url(../static/plugins/ep_profile_modal/static/dist/img/loading.gif)","background-repeat":"no-repeat","background-size":"69px","background-color":"#3873E0"}),$("#ep_profile_users_profile_name").text(""),$("#ep_profile_users_profile_desc").text(""),$("#ep_profile_users_profile").addClass("ep_profile_formModal_show"),n.showGeneralOverlay()},error(e){$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show"),n.hideGeneralOverlay()},success(r){const a=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`;let s=r.user.username;null!=s&&""!=s||(s="Anonymous");const t=r.user.about||"",i=r.user.homepage||"";$("#ep_profile_users_profile_name").text(s),$("#ep_profile_users_profile_desc").text(t),""==i?$("#ep_profile_users_profile_homepage").hide():$("#ep_profile_users_profile_homepage").attr({href:n.getValidUrl(i),target:"_blank"}),$("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px","background-color":"#3873E0"})}})})),$("#ep_profile_users_profile_close").on("click",()=>{$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show"),n.hideGeneralOverlay()})}},s=function(e,s){return a.initiateListeners(),$("#ep_profile_modal_save").on("click",()=>{const e=pad.getUserId(),o=pad.getPadId(),r=$("#ep_profile_modal-username");if($("#ep_profile_modal-email"),$("#ep_profile_modal-about"),$("#ep_profile_modal-homepage"),""==r.val())return r.css({border:"1px solid red"}),!1;r.css({border:"0"});const a=$("#ep_profile_modal_one"),s={type:"ep_profile_modal",action:"ep_profile_modal_info",userId:e,data:n.getFormData(a),padId:o};pad.collabClient.sendMessage(s),pad.collabClient.updateUserInfo({userId:o,name:r.val(),colorId:"#b4b39a"}),"login"==window.user_status&&($("#ep_profile_modal").hasClass("ep_profile_modal-show")?($("#ep_profile_modal").removeClass("ep_profile_modal-show"),n.hideGeneralOverlay()):($("#ep_profile_modal").addClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide(),n.showGeneralOverlay()))}),$("#userlist_count").on("click",()=>{var e=$("#ep_profile_modal_user_list").attr("data-page")||1,r=$("#ep_profile_modal_user_list").attr("data-pageLoaded")||!1;console.log("ssssssssss",$("#ep_profile_modal_user_list").attr("data-pageLoaded")),"true"!==r&&$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${e}/`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){},error(e){$("#contributorsLoading").css({display:"none"})},success(e){$("#contributorsLoading").css({display:"none"}),$("#ep_profile_modal_user_list").attr("data-pageLoaded","true");const r=pad.collabClient.getConnectedUsers();o.manageOnlineOfflineUsers(e.data,r,pad.getUserId(),e.lastPage)}})}),$("#ep_profile_modal_load_more_contributors").on("click",()=>{var e=$("#ep_profile_modal_user_list").attr("data-page")||1;e++,$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${e}/`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){$("#loadMoreLoading").show(),$("#ep_profile_modal_load_more_contributors").css({display:"none"})},error(e){$("#loadMoreLoading").hide(),$("#ep_profile_modal_load_more_contributors").css({display:"block"})},success(r){$("#ep_profile_modal_load_more_contributors").css({display:"block"}),$("#loadMoreLoading").hide(),$("#ep_profile_modal_user_list").attr("data-page",e);const a=pad.collabClient.getConnectedUsers();o.paginateContributors(r.data,a,pad.getUserId(),r.lastPage)}})}),$("#userlist_count,#ep_profile_modal_user_list_close").on("click",()=>{$("#ep_profile_modal_user_list").hasClass("ep_profile_modal-show")?($("#ep_profile_modal_user_list").removeClass("ep_profile_modal-show"),n.hideGeneralOverlay()):(n.showGeneralOverlay(),$("#ep_profile_modal_user_list").addClass("ep_profile_modal-show"))}),$("#ep_profile_modal_verification").on("click",(function(){const e=$(this).attr("data-verification-status"),o=$(this).text();return"true"!=e&&$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/null/null`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){$("#ep_profile_modal_verification").text("Sending...")},error(e){$("#ep_profile_modal_verification").text("Error"),setTimeout(()=>{$("#ep_profile_modal_verification").text(o)},2e3)},success(e){$("#ep_profile_modal_verification").text("Verification email has been sent."),$("#ep_profile_modal_verification").attr("data-verification-status","true")}}),!1})),$("#ep_profile_modal_share").on("click",()=>{const e=document.createElement("input"),o=window.location.href;document.body.appendChild(e),e.value=o,e.select(),document.execCommand("copy"),document.body.removeChild(e),$.gritter.add({text:"Link copied to clipboard"})}),$("#ep-profile-button").on("click",()=>{"login"==window.user_status?$("#ep_profile_modal").hasClass("ep_profile_modal-show")?$("#ep_profile_modal").removeClass("ep_profile_modal-show"):($("#ep_profile_modal").addClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide(),n.showGeneralOverlay()):(r.resetModal(),r.showModal())}),$("#ep_profile_modal_close").on("click",()=>{$("#ep_profile_modal").hasClass("ep_profile_modal-show")?($("#ep_profile_modal").removeClass("ep_profile_modal-show"),n.hideGeneralOverlay()):(n.showGeneralOverlay(),$("#ep_profile_modal").addClass("ep_profile_modal-show"))}),$("#ep_profile_modal_close_ask").on("click",()=>{$("#ep_profile_modal_ask").hasClass("ep_profile_modal-show")?$("#ep_profile_modal_ask").removeClass("ep_profile_modal-show"):$("#ep_profile_modal_ask").addClass("ep_profile_modal-show")}),$("#ep_profile_modal_signout").on("click",()=>{const e=pad.getUserId(),o=pad.getPadId();window.user_status="out";const r={type:"ep_profile_modal",action:"ep_profile_modal_logout",email:$("#ep_profile_hidden_email").val(),userId:e,padId:o};pad.collabClient.sendMessage(r),$("#ep_profile_modal").removeClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").hide(),$("#offline_ep_profile_modal_status").show(),_.resetProfileModalFields(),n.hideGeneralOverlay(),$(`.avatar[data-id="user_${e}"]`).attr({style:""}),l.userLogout()}),$("#profile_file").on("change",e=>{const o=pad.getUserId(),r=new FormData,a=$("#profile_file")[0].files[0];r.append("file",a),a&&$.ajax({url:`/static/${clientVars.padId}/pluginfw/ep_profile_modal/upload/${o}`,type:"post",data:r,contentType:!1,processData:!1,beforeSend(){l.refreshLoadingImage(o,clientVars.padId)},error(e){l.refreshUserImage(o,clientVars.padId)},success(e){l.refreshUserImage(o,clientVars.padId)}})}),$("#ep_profile_modal_submit").on("click",()=>{const e=$("#ep_profile_modal_username").val(),o=$("#ep_profile_modal_email").val();n.loginByEmailAndUsername(e,o)}),$("#ep_profile_modal_login").on("click",()=>{const e=$("#ep_profile_modal-username").val(),o=$("#ep_profile_modal-email").val();n.loginByEmailAndUsername(e,o),$("#ep_profile_modal").removeClass("ep_profile_modal-show")}),$("#ep_profile_general_overlay").on("click",()=>{n.hideGeneralOverlay()}),[]},t=(e,s)=>{const t=pad.getUserId();r.initModal(clientVars),"yes"!=localStorage.getItem("formPassed")&&r.showModal(),a.initiate(clientVars),$("body").append(i);var i=$("#ep_profile_modal_script").tmpl(clientVars);$("body").append(i),i=$("#ep_profile_modal_user_list_script").tmpl(clientVars),$("body").append(i),i=$("#ep_profile_modal_general_script").tmpl(),$("body").append(i);const l=`background : url(/static/getUserProfileImage/${t}/${clientVars.padId}) no-repeat 50% 50% ; background-size :32px`,n=pad.collabClient.getConnectedUsers(),_=o.createHTMLforUserList(clientVars.ep_profile_modal.contributed_authors_count,n,clientVars.padId,clientVars.ep_profile_modal.verified);$("#pad_title").append(`<div class='ep_profile_modal_header'><div class='userlist' id='userlist'>${_}</div><div class='ep-profile-button' id='ep-profile-button'><div id='ep-profile-image' style='${l}' /></div></div>`),"2"==clientVars.ep_profile_modal.user_status?window.user_status="login":window.user_status="out";const p={type:"ep_profile_modal",action:"ep_profile_modal_ready",userId:t,padId:clientVars.padId,data:clientVars.ep_profile_modal};return pad.collabClient.sendMessage(p),"Anonymous"==clientVars.ep_profile_modal.userName&&pad.collabClient.updateUserInfo({userId:t,name:"Anonymous",colorId:"#b4b39a"}),[]},i={handleClientMessage_USER_NEWINFO:(e,r)=>{const a=pad.getPadId();return o.increaseUserFromList(r.payload.userId,a),[]},handleClientMessage_USER_LEAVE:(e,r)=>{const a=pad.getPadId();return o.decreaseUserFromList(r.payload.userId,a),[]},handleClientMessage_CUSTOM:(e,r,a)=>{const s=pad.getUserId();if("totalUserHasBeenChanged"==r.payload.action){const e=r.payload.totalUserCount;$("#userlist_count").text(e)}if("EP_PROFILE_USER_IMAGE_CHANGE"==r.payload.action&&l.refreshGeneralImage(r.payload.userId,r.payload.padId),"EP_PROFILE_USER_LOGOUT_UPDATE"==r.payload.action){var t=`/static/getUserProfileImage/${r.payload.userId}/${r.payload.padId}?t=${(new Date).getTime()}`;s==r.payload.userId?(l.refreshUserImage(s,r.payload.padId),l.logoutCssFix(s)):l.refreshGeneralImage(r.payload.userId,r.payload.padId),_.resetGeneralFields(r.payload.userId),(i=o.isThereOnlineAnonymous())?o.increaseToOnlineAnonymous(i,r.payload.userId):o.createOnlineAnonymousElement(r.payload.userId,"Anonymous",t,{}),o.removeUserElementInUserList(r.payload.userId)}if("EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT"==r.payload.action&&n.addTextChatMessage(r.payload.msg),"EP_PROFILE_USER_LOGIN_UPDATE"==r.payload.action){var i=o.isThereOnlineAnonymous();"Anonymous"==r.payload.userName?(i?o.increaseToOnlineAnonymous(i,r.payload.userId):o.createOnlineAnonymousElement(r.payload.userId,r.payload.userName,r.payload.img,r.payload.user),o.removeUserElementInUserList(r.payload.userId)):(i&&o.checkUserExistInOnlineAnonymous(i,r.payload.userId)&&o.decreaseFromOnlineAnonymous(i,r.payload.userId),o.createOnlineUserElementInUserList(r.payload.userId,r.payload.userName,r.payload.img,s,r.payload.user)),s==r.payload.userId?(l.refreshUserImage(s,r.payload.padId),_.syncAllFormsData(r.payload.userId,r.payload.user)):(l.refreshGeneralImage(r.payload.userId,r.payload.padId),_.syncGeneralFormsData(r.payload.userId,r.payload.user))}return[]}},l={userLogin:function(e){window.user_status="login",pad.collabClient.updateUserInfo({userId:pad.getUserId(),name:e.username,colorId:"#b4b39a"})},userLogout:function(){window.user_status="logout",pad.collabClient.updateUserInfo({userId:pad.getUserId(),name:"Anonymous",colorId:"#b4b39a"})},logoutCssFix:function(e){const o=$(`.avatarImg[data-id="user_${e}"]`);o.length&&o.css({margin:"0px","box-shadow":"none"})},refreshUserImage:function(e,o){const r=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,a=$(`.avatarImg[data-id="user_${e}"]`);a.length&&a.css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"}),$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat"}),$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"72px"}),$("#ep-profile-image").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"32px"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"})},refreshLoadingImage:function(e,o){const r="../static/plugins/ep_profile_modal/static/dist/img/loading.gif",a=$(`.avatarImg[data-id="user_${e}"]`);a.length&&a.css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"}),$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat"}),$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"72px"}),$("#ep-profile-image").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"32px"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"})},refreshGeneralImage:function(e,o){const r=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,a=$(`.avatarImg[data-id="user_${e}"]`);a.length&&a.css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"})}},n=(()=>{const e=function(e){const o=$(e);if(o.length<=0||!o[0])return!0;o.animate({scrollTop:o[0].scrollHeight},{duration:400,queue:!1})},o=function(e){return""==e||/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e)},r=function(e){return["January","February","March","April","May","June","July","August","September","October","November","December"][e-1]};return{resetAllProfileImage:function(e,o){$.ajax({url:`/static/${o}/pluginfw/ep_profile_modal/resetProfileImage/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend(){l.refreshLoadingImage(e,o)},error(r){l.refreshUserImage(e,o)},success(r){l.refreshUserImage(e,o)}})},sendSignOutMessage:function(e,o){const r={type:"ep_profile_modal",action:"ep_profile_modal_send_signout_message",userId:e,padId:o};pad.collabClient.sendMessage(r)},addTextChatMessage:function(o){const r="author-"+o.userId.replace(/[^a-y0-9]/g,e=>"."===e?"-":`z${e.charCodeAt(0)}z`);let a=""+new Date(o.time).getMinutes(),s=""+new Date(o.time).getHours();1===a.length&&(a="0"+a),1===s.length&&(s="0"+s);const t=`<p><span class='time ${r}'>${`${s}:${a}`}</span> ${o.text}</p>`;$(document).find("#chatbox #chattext").append(t),e("#chatbox #chattext")},scrollDownToLastChatText:e,loginByEmailAndUsernameWithoutValidation:function(e,o,r){window.user_status="login";const a={type:"ep_profile_modal",action:"ep_profile_modal_login",email:o,userId:pad.getUserId(),name:e,padId:pad.getPadId(),suggestData:r};pad.collabClient.sendMessage(a)},loginByEmailAndUsername:function(e,r){if(""==e||!o(r))return o(r)||($("#ep_profile_modal_email").focus(),$("#ep_profile_modal_email").addClass("ep_profile_modal_validation_error")),!1;{$("#ep_profile_modal_email").removeClass("ep_profile_modal_validation_error"),window.user_status="login";const o={type:"ep_profile_modal",action:"ep_profile_modal_login",email:r,userId:pad.getUserId(),name:e,padId:pad.getPadId(),suggestData:!1};pad.collabClient.sendMessage(o),l.userLogin({email:r,username:e}),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide()}},isEmail:o,IsValid:function(e){return/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(e)},getFormData:function(e){const o=e.serializeArray(),r={};return $.map(o,(e,o)=>{r[e.name]=e.value}),r},setFormData:function(e,o){$.map(o,(e,o)=>{$("#"+o).val(e)})},isUsername:function(e){return/^([a-zA-Z0-9_.+-])/.test(e)},showGeneralOverlay:function(){$("#ep_profile_general_overlay").addClass("ep_profile_formModal_overlay_show"),$("#ep_profile_general_overlay").css({display:"block"})},hideGeneralOverlay:function(){$("#ep_profile_general_overlay").removeClass("ep_profile_formModal_overlay_show"),$("#ep_profile_general_overlay").css({display:"none"}),$("#ep_profile_modal").removeClass("ep_profile_modal-show"),$("#ep_profile_modal_user_list").removeClass("ep_profile_modal-show"),$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show")},getValidUrl:function(e){if(""==e||!e)return"";let o=window.decodeURIComponent(e);return o=o.trim().replace(/\s/g,""),/^(:\/\/)/.test(o)?"http"+o:/^(f|ht)tps?:\/\//i.test(o)?o:"http://"+o},getMonthName:r,getCustomeFormatDate:function(e){return"today"==e||"yesterday"==e?"Last seen "+e:`Last seen ${(e=e.split("-"))[2]} ${r(e[1])} ${e[0]}`},getCustomDate:function(e){return"today"==e||"yesterday"==e?"Last seen "+e:`Last seen ${(e=e.split("-"))[2]}/${e[1]}/${e[0]}`}}})(),_={syncAllFormsData:function(e,o){if(void 0===o)return;const r=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(r.length){const e=r.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(o.username),r.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(o.about),o.homepage&&e.children(".ep_profile_contributor_link_container").attr({href:n.getValidUrl(o.homepage)}),e.children(".ep_profile_contributor_status").text("Online")}$("#ep_profile_modal-username").val(o.username),$("#ep_profile_modal-about").val(o.about),$("#ep_profile_modal-homepage").val(o.homepage),$("#ep_profile_modal-email").val(o.email),1==o.verified?($("#ep_profile_modal_verification").attr("data-verification-status","true"),$("#ep_profile_modal_verification").text("Verified")):($("#ep_profile_modal_verification").attr("data-verification-status","false"),$("#ep_profile_modal_verification").text("Send verification email"))},syncGeneralFormsData:function(e,o){const r=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(r.length){const e=r.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(o.username),r.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(o.about),e.children(".ep_profile_contributor_link_container").attr({href:n.getValidUrl(o.homepage)}),e.children(".ep_profile_contributor_status").text("Online")}},resetProfileModalFields:function(){$("#ep_profile_modal-username").val(""),$("#ep_profile_modal-about").val(""),$("#ep_profile_modal-homepage").val(""),$("#ep_profile_modal-email").val(""),$("#ep_profile_modalForm_name").val(""),$("#ep_profile_modalForm_email").val(""),$("#ep_profile_modal_homepage").val(""),$("#ep_profile_modalForm_about_yourself").val("")},resetGeneralFields:function(e){const o=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(o.length){const e=o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(""),o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(""),e.children(".ep_profile_contributor_link_container").attr({href:""}),e.children(".ep_profile_contributor_status").text("")}}};return{documentReady:e,contributors:o,profileForm:r,usersProfileSection:a,postAceInit:s,aceInitialized:t,handleClientMessage:i,helper:l,shared:n,syncData:_}})();
//# sourceMappingURL=ep.profile.modal.mini.js.map
