
exports.showModal = function(clientVars){

        var modal = $("#ep_profile_formModal_script").tmpl(clientVars);
        $("body").append(modal);
}