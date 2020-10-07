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

