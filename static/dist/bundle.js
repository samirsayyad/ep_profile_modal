"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=e=>{window.userStatus="login",clientVars.ep_profile_modal.userStatus="2",pad.collabClient.updateUserInfo({userId:pad.getUserId(),name:e.username,colorId:"#b4b39a"})},o=(e,o)=>{const a=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,r=$(`.avatarImg[data-id="user_${e}"]`);r.length&&r.css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"}),$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat"}),$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"72px"}),$("#ep-profile-image").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"32px"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px"});const i=$(`.avatar[data-id="${e}"]`);i.length&&i.children(".ep_rocketchat_onlineUsersList_avatarImg").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"28px"})},a=(e,o)=>{const a="../static/plugins/ep_profile_modal/static/dist/img/loading.gif",r=$(`.avatarImg[data-id="user_${e}"]`);r.length&&r.css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"}),$(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat"}),$(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"72px"}),$("#ep-profile-image").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"32px"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px"})},r=(e,o)=>{const a=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,r=$(`.avatarImg[data-id="user_${e}"]`);r.length&&r.css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"28px","background-color":"#fff"});const s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px"})},s=(e,o,a)=>{clientVars.ep_profile_modal.userStatus="2",window.userStatus="login";const r={type:"ep_profile_modal",action:"ep_profile_modal_login",email:o,userId:pad.getUserId(),name:e,padId:pad.getPadId(),suggestData:a};pad.collabClient.sendMessage(r)},i=e=>""===e||/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e),l=(o,a)=>{if(""===o||!i(a))return i(a)||($("#ep_profile_modal_email").focus(),$("#ep_profile_modal_email").addClass("ep_profile_modal_validation_error")),!1;{$("#ep_profile_modal_email").removeClass("ep_profile_modal_validation_error"),clientVars.ep_profile_modal.userStatus="2",window.userStatus="login";const r={type:"ep_profile_modal",action:"ep_profile_modal_login",email:a,userId:pad.getUserId(),name:o,padId:pad.getPadId(),suggestData:!1};pad.collabClient.sendMessage(r),e({email:a,username:o}),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide()}},t=e=>{const o=e.serializeArray(),a={};return $.map(o,((e,o)=>{a[e.name]=e.value})),a},_=()=>{$("#ep_profile_general_overlay").addClass("ep_profile_formModal_overlay_show"),$("#ep_profile_general_overlay").css({display:"block"})},p=()=>{$("#ep_profile_general_overlay").removeClass("ep_profile_formModal_overlay_show"),$("#ep_profile_general_overlay").css({display:"none"}),$("#ep_profile_modal").removeClass("ep_profile_modal-show"),$("#ep_profile_modal_user_list").removeClass("ep_profile_modal-show"),$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show")},d=e=>{if(""===e||!e)return"";let o=window.decodeURIComponent(e);return o=o.trim().replace(/\s/g,""),/^(:\/\/)/.test(o)?`http${o}`:/^(f|ht)tps?:\/\//i.test(o)?o:`http://${o}`},n=e=>(console.log(e,"date"),"today"===e||"yesterday"===e?`Last seen ${e}`:`Last seen ${(e=e.split("-"))[2]}/${e[1]}/${e[0]}`),u=()=>{const e=e=>{const o=pad.getPadId();$.ajax({url:`/static/${o}/pluginfw/ep_profile_modal/getUserInfo/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{const e="../static/plugins/ep_profile_modal/static/dist/img/loading.gif";$("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%","background-image":`url(${e})`,"background-repeat":"no-repeat","background-size":"69px"}),$("#ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${e})`,"background-repeat":"no-repeat","background-size":"69px"}),$("#ep_profile_users_profile_name").text(""),$("#ep_profile_users_profile_desc").text(""),$("#ep_profile_users_profile").addClass("ep_profile_formModal_show"),_()},error:e=>{$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show"),p()},success:a=>{const r=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`;let s=a.user.username;null!=s&&""!==s||(s="Anonymous");const i=a.user.about||"",l=a.user.homepage||"";$("#ep_profile_users_profile_name").text(s),$("#ep_profile_users_profile_desc").text(i),""===l?$("#ep_profile_users_profile_homepage").hide():$("#ep_profile_users_profile_homepage").attr({href:d(l),target:"_blank"}),$("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"}),$("#ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"})}})};$("#usersIconList").on("avatarClick",((o,a)=>{!a||a.indexOf("a.")<0||e(a)})),$("#usersIconList").on("click",".avatar",(function(){const o=$(this).attr("data-userId");e(o)})),$("#ep_profile_users_profile_close").on("click",(()=>{$("#ep_profile_users_profile").removeClass("ep_profile_formModal_show"),p()}))},c=(e,o,a,r,s,i,l)=>{let t;return s=s||"",i=i||"",r&&"Anonymous"===o?(t=`background: url(${a}) no-repeat 50% 50% ; background-size : 69px ;`,`<div data-user-ids='${e}' data-anonymouseCount='1' data-id='user_list_${r}' class='ep_profile_user_row'><div style='${t}' class='ep_profile_user_img' id='ep_profile_user_img'></div><div class='ep_profile_user_list_profile_userDesc'><div class='ep_profile_user_list_username'>\n        <div class='ep_profile_user_list_username_text' id='ep_profile_users_profile_name'>\n        ${o}\n        </div><div class='ep_profile_contributor_status'>${l}</div></div><p class='ep_profile_user_list_profile_desc' id='ep_profile_users_profile_desc'>\n${s}</p></div> </div>`):(t=`background: url(${a}) no-repeat 50% 50% ; background-size : 69px ;`,`<div data-id='user_list_${e}' class='ep_profile_user_row'><div style='${t}' class='ep_profile_user_img'  id='ep_profile_user_img'></div><div class='ep_profile_user_list_profile_userDesc'><div class='ep_profile_user_list_username'>\n<div class='ep_profile_user_list_username_text' id='ep_profile_users_profile_name'>\n${o}</div><a target='_blank' style='\n${""===i||"#"===i||void 0===i||null==i?"display : none":""}'  class='ep_profile_contributor_link_container' title='\n        ${d(i)}' href='${d(i)}'> </a><div class='ep_profile_contributor_status'>${l}</div></div><p class='ep_profile_user_list_profile_desc' id='ep_profile_users_profile_desc'>\n        ${s}\n      </p></div> </div>`)},f=(e,o)=>{const a=e.attr("data-anonymouseCount"),r=e.attr("data-user-ids").split(",");if(-1===r.indexOf(o)){r.push(o),e.attr("data-user-ids",r.join(","));const s=parseInt(a)+1;e.attr("data-anonymouseCount",s),e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text(`Anonymous ×${s}`)}},m=(e,o,a,r)=>{const s=$("#ep_profile_user_list_container"),i=$("#ep_profile_user_list_container_off");r?$("#ep_profile_modal_load_more_contributors").css({display:"none"}):$("#ep_profile_modal_load_more_contributors").css({display:"block"}),$.each(e,((e,r)=>{if($.grep(o,(e=>e.userId===r.userId)).length)if("Anonymous"===r.userName){const e=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');if(e.length)f(e,r.userId);else{const e=c(r.userId,r.userName,r.imageUrl,"on_Anonymous",r.about,r.homepage,"Online");s.append(e)}a===r.userId&&$(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({"margin-top":"28px"})}else{if($(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).length)a===r.userId?$(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).prependTo(s):$(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).appendTo(s);else{const e=c(r.userId,r.userName,r.imageUrl,!1,r.about,r.homepage,"Online");try{s.append(e)}catch(e){console.log(e)}}a===r.userId&&$(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).css({"margin-top":"28px"})}if(""!==r.lastSeenDate&&"Anonymous"!==r.userName)if($(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).length)$(`.ep_profile_user_row[data-id="user_list_${r.userId}"]`).appendTo(i);else{console.log("value",r);const e=c(r.userId,r.userName,r.imageUrl,!1,r.about,r.homepage,n(r.lastSeenDate)),o=$("#ep_profile_user_list_offline");o.length?o.append(e):$("#ep_profile_user_list_container_off").append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>\n                ${e}</div>`)}})),$.each(e,((e,a)=>{if(!$.grep(o,(e=>e.userId===a.userId)).length&&"Anonymous"===a.userName){const e=$('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');if(e.length){const o=e.attr("data-anonymouseCount"),r=parseInt(o)+1,s=e.attr("data-user-ids").split(",");s.push(a.userId),e.attr("data-user-ids",s.join(",")),e.attr("data-anonymouseCount",r),e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text(`Anonymous ×${r}`)}else{const e=c(a.userId,"Anonymous",a.imageUrl,"off_Anonymous",a.about,a.homepage,n(a.lastSeenDate)),o=$("#ep_profile_user_list_offline");o.length?o.append(e):$("#ep_profile_user_list_container_off").append(`<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>\n                ${e}</div>`)}}}))},g=(e,o)=>{const a=e.attr("data-anonymouseCount");let r=e.attr("data-user-ids").split(",");r=$.grep(r,(e=>e!==o)),e.attr("data-user-ids",r.join(","));const s=parseInt(a)-1;return e.attr("data-anonymouseCount",s),s>1?e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text(`Anonymous ×${s}`):e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text("Anonymous"),s<1&&e.remove(),s},h=()=>{const e=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');return!!e.length&&e},b=(e,o,a,r)=>{const s=$("#ep_profile_user_list_container"),i=c(e,o,a,"on_Anonymous",r.about,r.homepage,"Online");s.append(i)},v=(e,o)=>{$(`.avatar[data-id="user_${e}"]`).animate({opacity:0},1e3,"linear",(function(){$(this).remove()}));const a=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(a.length)(e=>{const o=$("#ep_profile_user_list_offline");if(o.length){const a=$(".ep_profile_user_row[data-id='user_list_off_Anonymous']");a.length?e.insertBefore(a):o.append(e)}else $("#ep_profile_user_list_container_off").prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"),o.append(e);e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_contributor_status").text("Last seen today")})(a);else{const o=$('.ep_profile_user_row[data-id="user_list_on_Anonymous"]');if(o.length){const r=$('.ep_profile_user_row[data-id="user_list_off_Anonymous"]');g(o,e),r.length?((e,o)=>{const a=e.attr("data-anonymouseCount");let r=e.attr("data-user-ids");r=$.grep(r,(e=>e!==o)),e.attr("data-user-ids",r);const s=parseInt(a)+1;e.attr("data-anonymouseCount",s),e.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text(`Anonymous ×${s}`)})(r,e):((e,o,a,r,s)=>{const i=c(e,"Anonymous",o,"off_Anonymous",a,r,"Today"),l=$("#ep_profile_user_list_offline");if(l.length){const e=$(".ep_profile_user_row[data-id='user_list_off_Anonymous']");e.length?s.insertBefore(e):l.append(s)}else $("#ep_profile_user_list_container_off").prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>"),l.append(i)})(e,"../static/plugins/ep_profile_modal/static/dist/img/user.png",null,null,a)}else{let o=$("#ep_profile_user_list_offline");if(o.length)o.append($(`.ep_profile_user_row[data-id="user_list_${e}"]`));else{$("#ep_profile_user_list_container_off").prepend('<div class="ep_profile_user_list_date_title"\n              id="ep_profile_user_list_offline"></div>'),o=$("#ep_profile_user_list_offline"),$(`.ep_profile_user_row[data-id="user_list_${e}"]`).appendTo(o)}}}const r=`/static/getUserProfileImage/${e}/${o}?t=${(new Date).getTime()}`,s=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);s.length&&s.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${r})`,"background-repeat":"no-repeat","background-size":"69px"})},y=e=>{$(`.ep_profile_user_row[data-id="user_list_${e}"]`).remove()},I=()=>{$("#ep_profile_formModal").addClass("ep_profile_formModal_show"),$("#ep_profile_formModal_overlay").addClass("ep_profile_formModal_overlay_show"),$("#ep_profile_formModal_overlay").css({display:"block"}),setTimeout((()=>{$("#ep_profile_modalForm_name").focus()}),1e3)},k=e=>{const o=e.serializeArray(),a={};return $.map(o,((e,o)=>{a[e.name]=e.value})),a},w=()=>{const e=pad.getUserId(),o=pad.getPadId(),a=$("#ep_profile_formModal_msform"),r=k(a),s={};if(localStorage.setItem("formPassed","yes"),(()=>{const e=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().find("#innerdocbody");e.off("keypress"),e.off("mousedown")})(),""===r.ep_profile_modalForm_name||["",null,void 0].includes(localStorage.getItem("formStatus")))return!1;let i=`Please welcome ${r.ep_profile_modalForm_name}`;if(""!==r.ep_profile_modalForm_about_yourself&&(i+=`, ${r.ep_profile_modalForm_about_yourself}`),""!==r.ep_profile_modalForm_homepage){i+=`, ${d(r.ep_profile_modalForm_homepage)}`}s.messageChatText=`${i}`,s.target="profile",s.userId=e,s.time=new Date;const l={type:"ep_rocketchat",action:"ep_rocketchat_sendMessageToChat_login",userId:e,data:s,padId:o};pad.collabClient.sendMessage(l);const t=new CustomEvent("ep_push_notification",{detail:{eventName:"notifyAll",data:{userId:e,padId:o,title:"Welcome",body:i}}});window.dispatchEvent(t)},x=()=>{$("#ep_profile_formModal_overlay").removeClass("ep_profile_formModal_overlay_show"),$("#ep_profile_formModal_overlay").css({display:"none"}),w()},C=()=>{$("#ep_profile_formModal_msform fieldset").each((function(e){0===e?$(this).show():$(this).hide()}))},U=r=>{const l=$("#ep_profile_formModal_script").tmpl(r);let t,_,p,d;$("body").append(l),$(".skip").click((function(){if(d)return!1;$("#ep_profile_modalForm_name").css({border:"1px solid gray"}),d=!0,t=$(this).parent(),_=$(this).parent().next(),t.hide(),_.show(),d=!1})),$(".close , #ep_profile_formModal_overlay , .ep_profile_formModal_topClose").click((()=>($("#ep_profile_formModal").removeClass("ep_profile_formModal_show"),x(),!1))),$(".previous").click((function(){if(d)return!1;d=!0,t=$(this).parent(),p=$(this).parent().prev(),t.hide(),p.show(),d=!1})),$(".clear").click((function(){var e,r;e=$(this).attr("data-userId"),r=$(this).attr("data-padId"),$.ajax({url:`/static/${r}/pluginfw/ep_profile_modal/resetProfileImage/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{a(e)},error:a=>{o(e,r)},success:a=>{o(e,r)}})}));const n=()=>{const e=pad.getUserId(),o=pad.getPadId(),a=$("#ep_profile_formModal_msform"),r=k(a);if("Yes"===r.ep_profile_modalForm_push){const e=new CustomEvent("ep_push_notification",{detail:{eventName:"checkPermission"}});window.dispatchEvent(e)}const s={type:"ep_profile_modal",action:"ep_profile_modal_info",userId:e,data:r,padId:o};pad.collabClient.sendMessage(s)},u=()=>{const s=pad.getUserId(),i=pad.getPadId();$("#ep_profile_formModal").removeClass("ep_profile_formModal_show"),(()=>{const e=pad.getUserId(),s=new FormData,i=$("#profile_file_modal")[0].files[0];s.append("file",i),i&&$.ajax({url:`/static/${r.padId}/pluginfw/ep_profile_modal/upload/${e}`,type:"post",data:s,contentType:!1,processData:!1,beforeSend:()=>{a(e,r.padId)},error:a=>{o(e,r.padId),$("#profile_modal_selected_image").attr("style",((e,o)=>o&&o.replace(/background-image[^;]+;?/g,""))),413===a.status&&$.gritter.add({title:"Error",text:"ep_profile_modal: image size is large.",sticky:!0,class_name:"error"})},success:a=>{o(e,r.padId),$("#profile_modal_selected_image").attr("style",((e,o)=>o&&o.replace(/background-image[^;]+;?/g,"")))}})})(),x(),n();const l=$("#ep_profile_modalForm_name").val();e({email:$("#ep_profile_modalForm_email").val(),username:l}),setTimeout((()=>{o(s,i)}),2200)},c=(o,a)=>{if(d)return!1;const r=o.attr("data-section");if(localStorage.setItem("formStatus",r),"name"===r){if(""===$("#ep_profile_modalForm_name").val())return $("#ep_profile_modalForm_name").css({border:"1px solid red"}),!1;const o=$("#ep_profile_modalForm_name").val();$("#ep_profile_modalForm_name").css({border:"0px solid gray"}),e({username:o}),s(o,"",!1)}if("email"===r){const e=$("#ep_profile_modalForm_email").val();if(!i(e)||""===e)return $("#ep_profile_modalForm_email").css({border:"1px solid red"}),!1;const o=$("#ep_profile_modalForm_name").val();s(o,e,!0),((e,o)=>{const a=$("#ep_profile_modal_verification").text();$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/$\n        {pad.getUserId()}/${o}/${e}`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{$("#ep_profile_modal_verification").text("Sending...")},error:e=>{$("#ep_profile_modal_verification").text("Error"),setTimeout((()=>{$("#ep_profile_modal_verification").text(a)}),2e3)},success:e=>{$("#ep_profile_modal_verification").text("Verification email has been sent."),$("#ep_profile_modal_verification").attr("data-verification-status","true")}})})(e,o),$("#ep_profile_modalForm_email").css({border:"0px solid gray"})}if("homepage"===r){const e=$("#ep_profile_modal_homepage").val();if(!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(e)||""===e)return $("#ep_profile_modal_homepage").css({border:"1px solid red"}),!1;$("#ep_profile_modal_homepage").css({border:"0px solid gray"}),n()}if("push"===r&&($("#ep_profile_modalForm_push").val(!0),$("#ep_profile_modalForm_push").attr("checked","checked"),$("#ep_profile_modal_push").val("Yes"),n()),d=!0,o.hide(),a.length){a.show();const e=a.attr("data-section");"email"===e&&$("#ep_profile_modalForm_email").focus().select(),"homepage"===e&&$("#ep_profile_modal_homepage").focus().select(),"bio"===e&&$("#ep_profile_modalForm_about_yourself").focus().select()}else u();d=!1};$("#ep_profile_formModal_msform fieldset").on("keypress",(e=>{13===e.keyCode&&(e.preventDefault(),$(e.target).parent().find(".next").click())})),$(".next").click((function(){t=$(this).parent(),_=$(this).parent().next(),c(t,_)})),$(".submit").click((()=>(u(),!1))),$("#profile_file_modal").on("change",(e=>{const o=$("#profile_file_modal")[0].files[0],a=URL.createObjectURL(o);$("#profile_modal_selected_image").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"64px"})}))};exports.aceInitialized=(e,o)=>{var a,r,s;a=window,r="message",s=e=>{const o=e.data.eventName,a=e.data.data;"showEtherpadModal"===o&&I(),"showProfileDetailModal"===o&&$("#usersIconList").trigger("avatarClick",a.userId)},a.addEventListener?a.addEventListener(r,s,!1):a.attachEvent&&a.attachEvent(`on${r}`,s);const i=pad.getUserId();U(clientVars),"yes"!==localStorage.getItem("formPassed")&&(()=>{const e=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().find("#innerdocbody");e.on("keypress",(e=>{I()})),e.on("mousedown",(e=>{1===e.which&&I()}))})(),(e=>{const o=$("#ep_profile_users_profile_script").tmpl(e);$("body").append(o)})(clientVars);let l=$("#ep_profile_modal_script").tmpl(clientVars);$("body").append(l),l=$("#ep_profile_modal_user_list_script").tmpl(clientVars),$("body").append(l),l=$("#ep_profile_modal_general_script").tmpl(),$("body").append(l);const t=`\n      background : url(/static/getUserProfileImage/${i}/${clientVars.padId}) no-repeat 50% 50%;\n      background-size :32px\n    `,_=pad.collabClient.getConnectedUsers(),p=((e,o,a,r)=>{let s,i="<div id='usersIconList' class='ep_profile_inlineAvatars'>",l="";return $.each(o.reverse(),((e,o)=>{s=`background: url(/static/getUserProfileImage/${o.userId}/${a}) no-repeat 50% 50% ; background-size : 28px;background-color: #fff;`,l=r?"box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;":"",s+=l,i+=`<div class='avatar' data-userId="${o.userId}" data-id="user_${o.userId}"  id="user_${o.userId}" ><div data-userId="${o.userId}"  class='avatarImg' style='${s}' data-id="user_${o.userId}"></div></div>`})),i+=" </div>",`${i}<span class='slash_profile'>⧸</span><span\n    id='userlist_count' class='userlist_count'>${e}</span> <input  value='Share'\n      id='ep_profile_modal_share' type='button' class='ep_profile_modal_share'>`})(clientVars.ep_profile_modal.contributed_authors_count,_,clientVars.padId,clientVars.ep_profile_modal.verified);$("body").hasClass("mobileView")?$("#mainHeader .inlineAvatar").append(`\n        <div class='ep_profile_modal_header'>\n          <div class='ep-profile-button' id='ep-profile-button'>\n          <div id='ep-profile-image' style='${t}' /></div>\n        </div>\n      `):(0===$("#pad_title").length&&$("body").prepend("\n          <div id='pad_title'>\n            <div class=\"title_container\">\n              <span contenteditable style=\"color:#000\" id='title'>Loading...</span>\n            </div>\n            <button id='save_title'></button>\n          </div>\n        "),$("#pad_title").append(`\n        <div class='ep_profile_modal_header'>\n          <div class='userlist' id='userlist'>\n          ${p}\n          </div>\n          <div class='ep-profile-button' id='ep-profile-button'>\n          <div id='ep-profile-image' style='${t}' /></div>\n        </div>\n      `)),"2"===clientVars.ep_profile_modal.userStatus?window.userStatus="login":window.userStatus="out";const d={type:"ep_profile_modal",action:"ep_profile_modal_ready",userId:i,padId:clientVars.padId,data:clientVars.ep_profile_modal};return pad.collabClient.sendMessage(d),"Anonymous"===clientVars.ep_profile_modal.userName&&pad.collabClient.updateUserInfo({userId:i,name:"Anonymous",colorId:"#b4b39a"}),[]},exports.documentReady=(e,o,a)=>{let r;const s=document.location,i=""===s.port?"https:"===s.protocol?443:80:s.port,l=`${s.protocol}//${s.hostname}:${i}/`,_=location.pathname.split("/"),p=`${_.slice(0,_.length-2).join("/")}/`,d=`${p.substring(1)}socket.io`,n=`${l}pluginfw/admin/ep_profile_modal`;switch(o){case"admin/ep_profile_modal":r=io.connect(n,{path:`${p}socket.io`,resource:d}),r.on("load-settings-result",(e=>{var o;$("#settings-form"),o=e,$.map(o,((e,o)=>{$(`#${o}`).val(e)}))})),$("#save-settings").on("click",(()=>{const e=t($("#settings-form"));r.emit("save-settings",e),alert("Succesfully saved.")})),r.emit("load-settings");break;case"admin/ep_profile_modal_analytics":r=io.connect(n,{path:`${p}socket.io`,resource:d}),r.on("load-pads-result",(e=>{console.log("load-pads",e),$.each(e,((e,o)=>{$("#pads").append(`<option value="${o}">${o}</option>`)}))})),r.on("load-analytics-result",(e=>{console.log("load-analytics",e),$.each(e.pad_users_data,((e,o)=>{o.userId&&$("#users").append(`\n              <tr style="height: 0;">\n                <td>${o.email||o.userId}</td>\n                <td>${o.username}</td>\n                <td>${o.createDate}</td>\n                <td>${o.lastSeenDate}</td>\n                <td>${o.verifiedDate||"-"}</td>\n                <td>${o.verified?"Verified":"unconfirmed"}</td>\n              </tr>\n              `)}))})),$("#pads").on("change",(function(){r.emit("load-analytics",{pad:this.value})})),r.emit("load-pads");break;default:return[]}},exports.handleClientMessage_CUSTOM=(e,a,s)=>{const i=pad.getUserId();if("totalUserHasBeenChanged"===a.payload.action){const e=a.payload.totalUserCount;$("#userlist_count").text(e)}if("EP_PROFILE_USER_IMAGE_CHANGE"===a.payload.action&&r(a.payload.userId,a.payload.padId),"EP_PROFILE_USER_LOGOUT_UPDATE"===a.payload.action){const e=`/static/getUserProfileImage/${a.payload.userId}/${a.payload.padId}?t=${(new Date).getTime()}`;i===a.payload.userId?(o(i,a.payload.padId),(e=>{const o=$(`.avatarImg[data-id="user_${e}"]`);o.length&&o.css({margin:"0px","box-shadow":"none"})})(i)):r(a.payload.userId,a.payload.padId),(e=>{const o=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(o.length){const e=o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(""),o.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(""),e.children(".ep_profile_contributor_link_container").attr({href:""}),e.children(".ep_profile_contributor_status").text("")}})(a.payload.userId);const s=h();s?f(s,a.payload.userId):b(a.payload.userId,"Anonymous",e,{}),y(a.payload.userId)}if("EP_PROFILE_USER_LOGIN_UPDATE"===a.payload.action){const e=h();"Anonymous"===a.payload.userName?(e?f(e,a.payload.userId):b(a.payload.userId,a.payload.userName,a.payload.img,a.payload.user),y(a.payload.userId)):(e&&(l=e,t=a.payload.userId,-1!==l.attr("data-user-ids").split(",").indexOf(t)&&g(e,a.payload.userId)),((e,o,a,r,s)=>{const i=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(i.length)i.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text").text(o),i.children(".ep_profile_user_img").css({"background-position":"50% 50%","background-image":`url(${a})`,"background-repeat":"no-repeat","background-size":"69px"});else{const i=c(e,o,a,!1,s.about,s.homepage,"Online");if(e===r){const e=$("#ep_profile_user_list_date_title");e.length?$(i).insertAfter(e):$("#ep_profile_user_list_container").prepend(i)}else $("#ep_profile_user_list_container").append(i)}})(a.payload.userId,a.payload.userName,a.payload.img,i,a.payload.user)),i===a.payload.userId?(o(i,a.payload.padId),((e,o)=>{if(void 0===o)return;const a=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(a.length){const e=a.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(o.username),a.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(o.about),o.homepage&&e.children(".ep_profile_contributor_link_container").attr({href:d(o.homepage)}),e.children(".ep_profile_contributor_status").text("Online")}$("#ep_profile_modal-username").val(o.username),$("#ep_profile_modal-about").val(o.about),$("#ep_profile_modal-homepage").val(o.homepage),$("#ep_profile_modal-email").val(o.email),!0===o.verified?($("#ep_profile_modal_verification").attr("data-verification-status","true"),$("#ep_profile_modal_verification").text("Verified")):($("#ep_profile_modal_verification").attr("data-verification-status","false"),$("#ep_profile_modal_verification").text("Send verification email"))})(a.payload.userId,a.payload.user)):(r(a.payload.userId,a.payload.padId),((e,o)=>{const a=$(`.ep_profile_user_row[data-id="user_list_${e}"]`);if(a.length){const e=a.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username");e.children(".ep_profile_user_list_username_text").text(o.username),a.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_profile_desc").text(o.about),e.children(".ep_profile_contributor_link_container").attr({href:d(o.homepage)}),e.children(".ep_profile_contributor_status").text("Online")}})(a.payload.userId,a.payload.user))}var l,t;return[]},exports.handleClientMessage_USER_LEAVE=(e,o)=>{const a=pad.getPadId();return v(o.payload.userId,a),[]},exports.handleClientMessage_USER_NEWINFO=(e,o)=>{const a=pad.getPadId();return((e,o)=>{const a=`background: url(/static/getUserProfileImage/${e}/${o}) no-repeat 50% 50% ; background-size : 26px;background-color: #fff;`;if(!$(`.avatar[data-id="user_${e}"]`).length){const o=$(`<div class='avatar' data-userId="${e}"  data-id="user_${e}" id="user_${e}" ><div class='avatarImg' data-userId="${e}"  data-id="user_${e}" style='${a}'></div></div>`);o.prependTo("#usersIconList"),o.hide().slideDown(200)}})(o.payload.userId,a),[]},exports.postAceInit=(e,r)=>(u(),$("#ep_profile_modalForm_push").on("change",(e=>{const o=$("#ep_profile_modalForm_push"),a=o.is(":checked");o.attr("checked",a),o.val(a)})),$("#ep_profile_modal_save").on("click",(()=>{const e=pad.getUserId(),o=pad.getPadId(),a=$("#ep_profile_modal-username");if(""===a.val())return a.css({border:"1px solid red"}),!1;a.css({border:"0"});const r=$("#ep_profile_modal_one"),s=t(r);if(s.ep_profile_modalForm_push){const e=new CustomEvent("ep_push_notification",{detail:{eventName:"checkPermission"}});window.dispatchEvent(e)}const i={type:"ep_profile_modal",action:"ep_profile_modal_info",userId:e,data:s,padId:o};pad.collabClient.sendMessage(i),pad.collabClient.updateUserInfo({userId:o,name:a.val(),colorId:"#b4b39a"}),"login"===window.userStatus&&($("#ep_profile_modal").hasClass("ep_profile_modal-show")?($("#ep_profile_modal").removeClass("ep_profile_modal-show"),p()):($("#ep_profile_modal").addClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide(),_()))})),$("#userlist_count").on("click",(()=>{const e=$("#ep_profile_modal_user_list").attr("data-page")||1,o=$("#ep_profile_modal_user_list").attr("data-pageLoaded")||!1,a=$("#ep_profile_user_list_container");"true"!==o&&$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${e}/`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{$("#ep_profile_user_list_container").css({display:"none"}),$("#ep_profile_modal_load_more_contributors").css({display:"none"}),a.css({display:"none"})},error:e=>{$("#contributorsLoading").css({display:"none"}),a.css({display:"block"})},success:e=>{a.css({display:"block"}),$("#contributorsLoading").css({display:"none"}),$("#ep_profile_user_list_container").css({display:"block"}),$("#ep_profile_modal_user_list").attr("data-pageLoaded","true");const o=pad.collabClient.getConnectedUsers();m(e.data,o,pad.getUserId(),e.lastPage)}})})),$("#ep_profile_modal_load_more_contributors").on("click",(()=>{let e=$("#ep_profile_modal_user_list").attr("data-page")||1;e++,$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/getContributors/${e}/`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{$("#loadMoreLoading").show(),$("#ep_profile_modal_load_more_contributors").css({display:"none"})},error:e=>{$("#loadMoreLoading").hide(),$("#ep_profile_modal_load_more_contributors").css({display:"block"})},success:o=>{$("#ep_profile_modal_load_more_contributors").css({display:"block"}),$("#loadMoreLoading").hide(),$("#ep_profile_modal_user_list").attr("data-page",e);const a=pad.collabClient.getConnectedUsers();m(o.data,a,pad.getUserId(),o.lastPage)}})})),$("#userlist_count,#ep_profile_modal_user_list_close").on("click",(()=>{$("#ep_profile_modal_user_list").hasClass("ep_profile_modal-show")?($("#ep_profile_modal_user_list").removeClass("ep_profile_modal-show"),p()):(_(),$("#ep_profile_modal_user_list").addClass("ep_profile_modal-show"))})),$("#ep_profile_modal_verification").on("click",(function(){const e=$(this).attr("data-verification-status"),o=$(this).text();return"true"!==e&&$.ajax({url:`/static/${pad.getPadId()}/pluginfw/ep_profile_modal/sendVerificationEmail/${pad.getUserId()}/null/null`,type:"get",data:{},contentType:!1,processData:!1,beforeSend:()=>{$("#ep_profile_modal_verification").text("Sending...")},error:e=>{$("#ep_profile_modal_verification").text("Error"),setTimeout((()=>{$("#ep_profile_modal_verification").text(o)}),2e3)},success:e=>{$("#ep_profile_modal_verification").text("Verification email has been sent."),$("#ep_profile_modal_verification").attr("data-verification-status","true")}}),!1})),$("#ep_profile_modal_share").on("click",(()=>{const e=document.createElement("input"),o=window.location.href;document.body.appendChild(e),e.value=o,e.select(),document.execCommand("copy"),document.body.removeChild(e),$.gritter.add({text:"Link copied to clipboard"})})),$("#ep-profile-button").on("click",(()=>{"login"===window.userStatus?$("#ep_profile_modal").hasClass("ep_profile_modal-show")?$("#ep_profile_modal").removeClass("ep_profile_modal-show"):($("#ep_profile_modal").addClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").show(),$("#offline_ep_profile_modal_status").hide(),_()):(C(),I())})),$("#ep_profile_modal_close").on("click",(()=>{$("#ep_profile_modal").hasClass("ep_profile_modal-show")?($("#ep_profile_modal").removeClass("ep_profile_modal-show"),p()):(_(),$("#ep_profile_modal").addClass("ep_profile_modal-show"))})),$("#ep_profile_modal_close_ask").on("click",(()=>{$("#ep_profile_modal_ask").hasClass("ep_profile_modal-show")?$("#ep_profile_modal_ask").removeClass("ep_profile_modal-show"):$("#ep_profile_modal_ask").addClass("ep_profile_modal-show")})),$("#ep_profile_modal_signout").on("click",(()=>{C();const e=pad.getUserId(),o=pad.getPadId();localStorage.setItem("formStatus",""),clientVars.ep_profile_modal.userStatus="1",window.userStatus="out";const a={type:"ep_profile_modal",action:"ep_profile_modal_logout",email:$("#ep_profile_hidden_email").val(),userId:e,padId:o};clientVars.ep_profile_modal.userStatus="1",pad.collabClient.sendMessage(a),$("#ep_profile_modal").removeClass("ep_profile_modal-show"),$("#online_ep_profile_modal_status").hide(),$("#offline_ep_profile_modal_status").show(),$("#ep_profile_modal-username").val(""),$("#ep_profile_modal-about").val(""),$("#ep_profile_modal-homepage").val(""),$("#ep_profile_modal-email").val(""),$("#ep_profile_modalForm_name").val(""),$("#ep_profile_modalForm_email").val(""),$("#ep_profile_modal_homepage").val(""),$("#ep_profile_modalForm_about_yourself").val(""),p(),$(`.avatar[data-id="user_${e}"]`).attr({style:""}),window.userStatus="logout",clientVars.ep_profile_modal.userStatus="1",pad.collabClient.updateUserInfo({userId:pad.getUserId(),name:"Anonymous",colorId:"#b4b39a"})})),$("#profile_file").on("change",(e=>{const r=pad.getUserId(),s=new FormData,i=$("#profile_file")[0].files[0];s.append("file",i),i&&$.ajax({url:`/static/${clientVars.padId}/pluginfw/ep_profile_modal/upload/${r}`,type:"post",data:s,contentType:!1,processData:!1,beforeSend:()=>{a(r,clientVars.padId)},error:e=>{o(r,clientVars.padId)},success:e=>{o(r,clientVars.padId)}})})),$("#ep_profile_modal_submit").on("click",(()=>{const e=$("#ep_profile_modal_username").val(),o=$("#ep_profile_modal_email").val();l(e,o)})),$("#ep_profile_modal_login").on("click",(()=>{const e=$("#ep_profile_modal-username").val(),o=$("#ep_profile_modal-email").val();l(e,o),$("#ep_profile_modal").removeClass("ep_profile_modal-show")})),$("#ep_profile_general_overlay").on("click",(()=>{p()})),[]);//# sourceMappingURL=bundle.js.map