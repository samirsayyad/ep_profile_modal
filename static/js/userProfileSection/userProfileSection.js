exports.initiate = function(clientVars){
    var modal = $("#ep_profile_users_profile_script").tmpl(clientVars);
    $("body").append(modal);

}