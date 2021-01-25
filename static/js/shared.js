
var helper = require("./helper")

exports.resetAllProfileImage = function (userId,padId){
    $.ajax({
        url: '/static/' + padId + '/pluginfw/ep_profile_modal/resetProfileImage/'+userId ,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend: function() {
            helper.refreshLoadingImage(userId,padId)
                
        },
        error: function(xhr) { // if error occured
 
            helper.refreshUserImage(userId,padId)

        },
        success: function(response){
            helper.refreshUserImage(userId,padId)


        }
        
    })
}
exports.sendSignOutMessage = function(userId,padId){
    var message = {
        type : 'ep_profile_modal',
        action : "ep_profile_modal_send_signout_message" ,
        userId :  userId ,
        padId :  padId ,

      }
    pad.collabClient.sendMessage(message);  // Send the chat position message to the server

}
 exports.addTextChatMessage=function(msg) {
	var authorClass = 'author-' + msg.userId.replace(/[^a-y0-9]/g, function replace(c) {
		if (c === '.') return '-';
		return 'z' + c.charCodeAt(0) + 'z';
	});

	// create the time string
	var minutes = '' + new Date(msg.time).getMinutes();
	var hours = '' + new Date(msg.time).getHours();
	if (minutes.length === 1) minutes = '0' + minutes;
	if (hours.length === 1) hours = '0' + hours;
	var timeStr = hours + ':' + minutes;

	var html = "<p><span class='time " + authorClass + "'>" + timeStr + '</span> ' + msg.text + '</p>';

	$(document).find('#chatbox #chattext').append(html);
	exports.scrollDownToLastChatText('#chatbox #chattext');
}
exports.scrollDownToLastChatText = function scrollDownToLastChatText(selector) {
	var $element = $(selector);
	if ($element.length <= 0 || !$element[0]) return true;
	$element.animate({ scrollTop: $element[0].scrollHeight }, { duration: 400, queue: false });
};

exports.loginByEmailAndUsernameWithoutValidation =function(username , email,suggestData){
    window.user_status = "login"
    var message = {
        type : 'ep_profile_modal',
        action : "ep_profile_modal_login" ,
        email : email ,
        userId :  pad.getUserId() ,
        name: username,
        padId : pad.getPadId() ,
        suggestData : suggestData
      }
    pad.collabClient.sendMessage(message);  // Send the chat position message to the server
 
}
exports.loginByEmailAndUsername = function(username , email){
    if(username == "" || !exports.isEmail(email)){

        if (!exports.isEmail(email)  ){
            $("#ep_profile_modal_email").focus()
            $('#ep_profile_modal_email').addClass('ep_profile_modal_validation_error')

        }
        return false;
    }else{

        $('#ep_profile_modal_email').removeClass('ep_profile_modal_validation_error')

        window.user_status = "login"
        // pad.collabClient.updateUserInfo({
        //     userId :  pad.getUserId() ,
        //     name: username,
        //     colorId: "#b4b39a"
        // } )
        var message = {
            type : 'ep_profile_modal',
            action : "ep_profile_modal_login" ,
            email : email ,
            userId :  pad.getUserId() ,
            name: username,
            padId : pad.getPadId(),
            suggestData : false

          }
        pad.collabClient.sendMessage(message);  // Send the chat position message to the server
        //$('#ep_profile_modal').addClass('ep_profile_modal-show')
        helper.userLogin({
            email : email,
            username : username,
        })

        $("#online_ep_profile_modal_status").show()
		$("#offline_ep_profile_modal_status").hide()
        // $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
        // $("#ep_profile_modal_section_info_email").text(email)
        // $("#ep_profile_modal_section_info_name").text(username)
    }
}


exports.isEmail = function(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(email=="")
		return true
	else
		return regex.test(email);
}

exports.IsValid = function (url){
    var pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return pattern.test(url);
}


exports.getFormData = function ($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
exports.setFormData = function ($form,indexed_array){
    $.map(indexed_array, function(n, i){
        $("#"+i).val(n)
        
    });
}

exports.isUsername =function (username) {
    var regex = /^([a-zA-Z0-9_.+-])/;
    return regex.test(username);
}
exports.showGeneralOverlay = function(){
    $('#ep_profile_general_overlay').addClass('ep_profile_formModal_overlay_show')
    $('#ep_profile_general_overlay').css({"display":"block"})
}

exports.hideGeneralOverlay = function(){
    $('#ep_profile_general_overlay').removeClass('ep_profile_formModal_overlay_show')
    $('#ep_profile_general_overlay').css({"display":"none"})
    $('#ep_profile_modal').removeClass('ep_profile_modal-show')
    $('#ep_profile_modal_user_list').removeClass('ep_profile_modal-show')
    $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show')

}
               
exports.getValidUrl = function(url){
    if(url=="" || !url) return "";
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");

    if(/^(:\/\/)/.test(newUrl)){
        return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
        return `http://${newUrl}`;
    }

    return newUrl;
};

exports.getMonthName = function(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
}
exports.getCustomeFormatDate = function(date) {
    if (date == "today" || date == "yesterday" ) return "Last seen "+date;
    date = date.split("-");
    return "Last seen "+ date[2] + " " + exports.getMonthName(date[1]) + " " + date[0]
}
exports.getCustomDate = function(date) {
    if (date == "today" || date == "yesterday" ) return "Last seen "+date;
    date = date.split("-");
    return "Last seen "+ date[2] +"/"+ date[1] + "/" + date[0]
}
