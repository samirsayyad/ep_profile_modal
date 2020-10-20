
var helper = require("./helper")

exports.resetAllProfileImage = function (userId,padId){
    $.ajax({
        url: '/p/' + padId + '/pluginfw/ep_profile_modal/resetProfileImage/'+userId ,
        type: 'get',
        data: {},
        contentType: false,
        processData: false,
        beforeSend: function() {
            var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'

            $("#ep-profile-image").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
            });
            $(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            $(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
            if (avatar.length){
                avatar.css({"background-position":"50% 50%",
                "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"});
            }


                
        },
        error: function(xhr) { // if error occured
            var image_url ='/p/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
            var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
            if (avatar.length){
                avatar.css({"background-position":"50% 50%",
                "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
                });
            }
            $(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            $(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            $("#ep-profile-image").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
            });
        },
        success: function(response){
            var image_url ='/p/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
            var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
            if (avatar.length){
                avatar.css({"background-position":"50% 50%",
                "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
                });
            }
            $(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            $(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
            $("#ep-profile-image").css({"background-position":"50% 50%",
            "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
            });

        }
        
    })
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
            padId : pad.getPadId()
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
    var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
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


exports.isUsername =function (username) {
    var regex = /^([a-zA-Z0-9_.+-])/;
    return regex.test(username);
}