exports.initiate = function(clientVars){

    function ep_profile_show_user(userId , padId){ // call from inline avatar
        alert(userId + padId + "=:D")
    }
    var modal = $("#ep_profile_users_profile_script").tmpl(clientVars);
    $("body").append(modal);
    $('#ep_profile_users_profile').addClass('ep_profile_formModal_show')

}

exports.initiateListeners = function(){
    $(".avatar").on("click",function(){
        console.log("we clicked")
    })
}

