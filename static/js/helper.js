exports.createHTMLforUserList = function (total , online){
    console.log(total , online)
    var html = "<div id='usersIconList'>";
    $.each( online, function( key, value ) {
        //console.log(key,value)
        html += "<img data-id=\"user_"+value.userId+"\"  id=\"user_"+value.userId+"\" class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}

exports.increaseUserFromList = function (total , userId){
    
    if (!$(".userlist_img[data-id=\"user_"+userId+"\"]").length){
        var $image = $("<img data-id=\"user_"+userId+"\" id=\"user_"+userId+"\" class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />");
        $image.appendTo("#usersIconList")
        //$("#usersIconList").append($image)
        $image.hide().slideDown(200);
    
    }



}

exports.decreaseUserFromList = function (total , userId){
    
    console.log(userId , "decreaseUserFromList")
    console.log($("#user_"+userId))
    // $("#user_"+userId).remove();
    // $("#usersIconList").find("img.userlist_img#user_"+userId).remove();
    // $("#usersIconList").find("#user_"+userId).remove();
    // $("#usersIconList").find(".userlist_img#user_"+userId).remove();
    // $("#usersIconList").find("img#user_"+userId).remove();
    //$(".userlist_img[data-id=\"user_"+userId+"\"]").remove()
//     //$("#usersIconList img:#"+userId).remove()
    $(".userlist_img[data-id=\"user_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
        {
            $(this).remove();
        }
    )


}

