

exports.userLogin = function(data){
    window.user_status = "login"
    pad.collabClient.updateUserInfo({
        userId :  pad.getUserId() ,
        name: data.username,
        colorId: "#b4b39a"
    })

}
exports.userLogout = function(){
    
    window.user_status = "logout"
    pad.collabClient.updateUserInfo({
        userId :  pad.getUserId() ,
        name: "Anonymous",
        colorId: "#b4b39a"
    })

}
exports.refreshUserImage = function (userId ,padId ){
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
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat" ,"background-size": "72px"});
    $("#ep-profile-image").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
    });

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "69px" ,
        });
    }
}

exports.refreshLoadingImage = function (userId ,padId ){
    var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'
    var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
    if (avatar.length){
        avatar.css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
        });
    }
    $(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
    $(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "72px"});
    $("#ep-profile-image").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
    });

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "69px" ,
        });
    }
}

exports.refreshGeneralImage = function (userId ,padId ){
    var image_url ='/p/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
    var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
    if (avatar.length){
        avatar.css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
        });
    }
    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "69px" ,
        });
    }
}

 