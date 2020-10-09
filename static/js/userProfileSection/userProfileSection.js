exports.initiate = function(clientVars){

    var modal = $("#ep_profile_users_profile_script").tmpl(clientVars);
    $("body").append(modal);
    //$('#ep_profile_users_profile').addClass('ep_profile_formModal_show')

}

exports.initiateListeners = function(){
    $(".avatar").on("click",function(){
        console.log("we clicked")
    })

    $("#ep_profile_users_profile_close").on("click",function(){
        $('#ep_profile_users_profile').removeClass('ep_profile_formModal_show')

    })
}

