var defaultImg = "../static/plugins/ep_profile_modal/static/img/user.png"

exports.createHTMLforUserList = function (total , online){
    var html = "<div id='usersIconList'>";
    $.each( online.reverse(), function( key, value ) {
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

}

exports.decreaseUserFromList = function (userId){

    $(".userlist_img[data-id=\"user_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
        {
            $(this).remove();
        }
    )
    var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;
    if(selector_on.length){
        var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous\"]") ;
        decreaseFromOnlineAnonymous(selector_on,userId)
        if(selector_off.length){
            increaseToOfflineAnonymous(selector_off,userId)
        }else{
            createOfflineAnonymousElement(userId,defaultImg)
        }
    }else{
        $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo("#ep_profile_user_list_container_off")
    }
    


}


exports.manageOnlineOfflineUsers = function (all_users_list ,onlineUsers , currentUserId){
    //$('#ep_profile_user_list_container').empty();
    //$("#ep_profile_user_list_container *:not('#ep_profile_modal_default_current')").remove();

    $('#ep_profile_user_list_container_off').empty();

    $.each(all_users_list, function( key, value ) {
        //if (value.userId != currentUserId){
            var result = $.grep(onlineUsers, function(e){ return e.userId == value.userId; });
            console.log(value , result , " in ast khodroye melli")

            if ( result.length ){ // online
                if (value.userName == "Anonymous" ){
                    var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;

                    if(selector_on.length){

                        increaseToOnlineAnonymous(selector_on , value.userId )
                        
                    }else{
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,"on_Anonymous")
                        $("#ep_profile_user_list_container").append(userListHtml);
                    }
                }else{
                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl ,false)
                        console.log(userListHtml , "in mire too")
                        $("#ep_profile_user_list_container").append(userListHtml);
    
                    }else{
                        if (currentUserId == value.userId){
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").prependTo("#ep_profile_user_list_container")
                        }else {
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo("#ep_profile_user_list_container")
                        }
                        
                    }
                }

            }else{ // offline
                if (value.userName == "Anonymous" ){
                    var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous\"]") ;
                    if(selector_off.length){
                        var anonymouseCount = selector_off.data("data-anonymouseCount")
                        var new_anonymouseCount= parseInt(anonymouseCount)+1

                        var ids_data_off = selector_off.attr("data-user-ids")
                        //var ids_data_off_array = JSON.parse("[" + ids_data_off + "]");
                        var ids_data_off_array = ids_data_off.split(',');
                        console.log(ids_data_off_array)
                        ids_data_off_array.push(value.userId)
                        selector_off.attr("data-user-ids",ids_data_off_array.join(", "))

                        selector_off.attr('data-anonymouseCount',new_anonymouseCount);
                        selector_off.children(".ep_profile_user_username").text("Anonymous X"+new_anonymouseCount);
                    }else{
                        createOfflineAnonymousElement(value.userId , value.imageUrl)
                    }
                }else{
                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,false)
                        $("#ep_profile_user_list_container_off").append(userListHtml);
    
                    }else{
                        $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo("#ep_profile_user_list_container_off")
                    }
                }



                
            }
            
        
        //}
    })


}

var getHtmlOfUsersList = function(userId,username , img , anonymous_handler){
    if (anonymous_handler){
        return "<div  data-user-ids='"+userId+"' data-anonymouseCount=\"1\" data-id=\"user_list_"+anonymous_handler+"\" class=\"ep_profile_user_row\">"+
        "<img src=\""+ img + "\" class=\"ep_profile_user_img\">"+
        "<div class=\"ep_profile_user_username\"> "+username+" </div> </div>" ;
    }else{
        return "<div  data-user-ids='"+userId+"' data-anonymouseCount=\"1\" data-id=\"user_list_"+userId+"\" class=\"ep_profile_user_row\">"+
        "<img src=\""+ img + "\" class=\"ep_profile_user_img\">"+
        "<div class=\"ep_profile_user_username\"> "+username+" </div> </div>" ;
    }
   
}




var increaseToOnlineAnonymous = function(selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');
    console.log(ids_data_array)
    if (ids_data_array.indexOf(userId) == -1){
        ids_data_array.push(userId)
        selector_on.attr("data-user-ids",ids_data_array.join(", "))
        var new_anonymouseCount= parseInt(anonymouseCount)+1
        selector_on.attr('data-anonymouseCount',new_anonymouseCount);
        selector_on.children(".ep_profile_user_username").text("Anonymous X"+new_anonymouseCount);
    }

}

var decreaseFromOnlineAnonymous = function (selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');


    ids_data_array = $.grep(ids_data_array, function(value) {
        return value != userId;
      });    


    selector_on.attr("data-user-ids",ids_data_array.join(", "))
    var new_anonymouseCount= parseInt(anonymouseCount)-1
    selector_on.attr('data-anonymouseCount',new_anonymouseCount);
    (new_anonymouseCount > 1) ? selector_on.children(".ep_profile_user_username").text("Anonymous X"+new_anonymouseCount) : selector_on.children(".ep_profile_user_username").text("Anonymous");
    return new_anonymouseCount
}


var increaseToOfflineAnonymous = function(selector_off,userId){
    var anonymouseCount = selector_off.attr("data-anonymouseCount")
    var ids_data = selector_off.attr("data-user-ids")
    
    ids_data = $.grep(ids_data, function(value) {
        return value != userId;
      });

    selector_off.attr("data-user-ids",ids_data)
    var new_anonymouseCount= parseInt(anonymouseCount)+1
    selector_off.attr('data-anonymouseCount',new_anonymouseCount);
    selector_off.children(".ep_profile_user_username").text("Anonymous X"+new_anonymouseCount);
}


var decreaseFromOfflineAnonymous= function (selector_off,userId){
    var anonymouseCount = selector_off.attr("data-anonymouseCount")
    var ids_data = selector_off.attr("data-user-ids")
    //ids_data.pop(userId)

    ids_data = $.grep(ids_data, function(value) {
        return value != userId;
      });

    selector_off.attr("data-user-ids",ids_data)
    var new_anonymouseCount= parseInt(anonymouseCount)-1
    selector_off.attr('data-anonymouseCount',new_anonymouseCount);
    (new_anonymouseCount > 1) ? selector_off.children(".ep_profile_user_username").text("Anonymous X"+new_anonymouseCount) : selector_off.children(".ep_profile_user_username").text("Anonymous");
    return new_anonymouseCount
}


var createOfflineAnonymousElement = function (userId,img){
    var userListHtml = getHtmlOfUsersList(userId ,"Anonymous" , img,"off_Anonymous")
    $("#ep_profile_user_list_container_off").append(userListHtml);
}




exports.getHtmlOfUsersList = getHtmlOfUsersList;
exports.decreaseFromOnlineAnonymous =decreaseFromOnlineAnonymous;