
exports.initiate = function(clientVars){

    var modal = $("#ep_profile_users_profile_script").tmpl(clientVars);
    $("body").append(modal);
    //$('#ep_profile_users_profile').addClass('ep_profile_formModal_show')

}

exports.initiateListeners = function(){
    $("#usersIconList").on("click",".avatar",function(){
        console.log("clicked")
        var userId = $(this).attr("data-userId")
        var padId = pad.getPadId()
        $.ajax({
            url: '/p/' + padId + '/pluginfw/ep_profile_modal/getUserInfo/'+userId,
            type: 'get',
            data: {},
            contentType: false,
            processData: false,
            beforeSend: function() {
                var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'
                $("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
                });  
                $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show')
           
            },
            error: function(xhr) { // if error occured

            },
            success: function(response){
                console.log(response)
                var image_url ='/p/getUserProfileImage/'+userId+"/"+padId +"?t=" + new Date().getTime();
                var username= response.user.username
                if (username ==null || username =="")
                    username = "Anonymous"
                $("#ep_profile_users_profile_name").text(username)
                $("#ep_profile_users_profile_desc").text(response.user.about)
                $("#ep_profile_users_profile_homepage").attr({"href":response.user.homepage})
                $("#ep_profile_users_profile_homepage").text(response.user.homepage)

                $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')


                $("#ep_profile_users_profile_userImage").css({"background-position":"50% 50%",
				"background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
                });
                

            }
        })
    })

    $("#ep_profile_users_profile_close").on("click",function(){
        $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show')

    })
}

