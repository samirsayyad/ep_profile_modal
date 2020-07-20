exports.createHTMLforUserList = function (total , online){
    console.log(total , online)
    var html = "<div id='usersIconList'>";
    $.each( online.reverse(), function( key, value ) {
        //console.log(key,value)
        html += "<img data-id=\"user_"+value.userId+"\"  id=\"user_"+value.userId+"\" class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}

exports.increaseUserFromList = function (userId){
    
    if (!$(".userlist_img[data-id=\"user_"+userId+"\"]").length){
        var $image = $("<img data-id=\"user_"+userId+"\" id=\"user_"+userId+"\" class='userlist_img' src='../static/plugins/ep_profile_modal/static/img/userlist.png' />");
        $image.prependTo("#usersIconList")
        //$("#usersIconList").append($image)
        $image.hide().slideDown(200);
    
    }

    // $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
    // {
    //     //$("#ep_profile_user_list_container").append($(this))
    //     $(this).appendTo("#ep_profile_user_list_container")

    //    // $(this).remove();
    // })

    //$("#userlist_count").text(total)

    



}

exports.decreaseUserFromList = function (userId){

    $(".userlist_img[data-id=\"user_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
        {
            $(this).remove();
        }
    )

    // .animate({opacity: 0}, 1000,"linear",function()
    // {
    //     //$("#ep_profile_user_list_container_off").append($(this))
        
    //    // $(this).remove();
    // })
    $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo("#ep_profile_user_list_container_off")


}



exports.manageOnlineOfflineUsers = function (allVars ,onlineUsers){

    $.each(allVars.ep_profile_modal.all_users_list, function( key, value ) {
        if (value.userId != allVars.userId){
            var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl)
            if ( onlineUsers.indexOf(value.userId) ){ // loginned
                
                $("#ep_profile_user_list_container").append(userListHtml);
            }else{
                $("#ep_profile_user_list_container_off").append(userListHtml);
            }
            
        
        }
    })


}

function getHtmlOfUsersList(userId,username , img){
    return "<div data-id=\"user_list_"+userId+"\" class=\"ep_profile_user_row\">"+
    "<img src=\""+ img + "\" class=\"ep_profile_user_img\">"+
    "<div class=\"ep_profile_user_username\"> "+username+" </div> </div>" ;
}