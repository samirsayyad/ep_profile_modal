exports.initiate = function(clientVars){

    var modal = $("#ep_profile_users_profile_script").tmpl(clientVars);
    $("body").append(modal);
    //$('#ep_profile_users_profile').addClass('ep_profile_formModal_show')

}

exports.initiateListeners = function(){
    $(".avatar").on("click",function(){
        var userId = $(this).attr("data-userId")
        $.ajax({
            url: '/p/' + pad.getPadId() + '/pluginfw/ep_profile_modal/getUserInfo/'+userId,
            type: 'get',
            data: {},
            contentType: false,
            processData: false,
            beforeSend: function() {
                var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'
                                
            },
            error: function(xhr) { // if error occured

            },
            success: function(response){
                console.log(response)
                $("#ep_profile_users_profile_name").text(response.user.username)
                $("#ep_profile_users_profile_about").text(response.user.about)
                $("#ep_profile_users_profile_homepage").attr({"href":response.user.homepage})
                $("#ep_profile_users_profile_homepage").text(response.user.homepage)

                $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')
            }
        })
    })

    $("#ep_profile_users_profile_close").on("click",function(){
        $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show')

    })
}

