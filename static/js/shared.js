exports.resetAllProfileImage = function (hook,context){
    $.ajax({
        url: '/p/' + clientVars.padId + '/pluginfw/ep_profile_modal/resetProfileImage/'+userId ,
        type: 'post',
        data: fd,
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
            var image_url ='/p/getUserProfileImage/'+userId+"/"+ clientVars.padId  +"?t=" + new Date().getTime();
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
            var image_url ='/p/getUserProfileImage/'+userId+"/"+ clientVars.padId  +"?t=" + new Date().getTime();
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