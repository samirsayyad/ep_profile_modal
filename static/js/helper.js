exports.createHTMLforUserList = function (total , online){
    //console.log(total , online)
    var html = "<div id='usersIconList'>";
    $.each( online, function( key, value ) {
        //console.log(key,value)
        html += "<img class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}