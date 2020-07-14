
exports.aceInitialized = function(hook, context){
    console.log("user list ", pad.userList());
    var usersListHTML = createHTMLforUserList(44,pad.collabClient.getConnectedUsers())
    if(clientVars.ep_profile_modal.profile_json == null){
        $("#pad_title").append("<div class='userlist' id='userlist'>"+usersListHTML+" </div><div id='ep-profile-button'><img id='ep-profile-image'  src='../static/plugins/ep_profile_modal/static/img/user.png' /></div>")
        var modal = $("#ep_profile_askmodal_script").tmpl(clientVars);
        $("body").append(modal)
        //$("#userList").append()
    }else{
        $("#pad_title").append("<div class='userlist' id='userlist'><span id='userlist_count' class='userlist_count'>&#8725;"+pad.collabClient.getConnectedUsers().length+"</span> <img class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' /> </div><div id='ep-profile-button'><img id='ep-profile-image'  src='"+clientVars.ep_profile_modal.profile_image_url+"' /></div>")
        var modal = $("#ep_profile_modal_script").tmpl(clientVars);
        $("body").append(modal)
    }

// &#8725; 
}

function createHTMLforUserList(total , online){
    //console.log(total , online)
    var html = "<div id='usersIconList'>";
    $.each( online, function( key, value ) {
        //console.log(key,value)
        html += "<img class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}