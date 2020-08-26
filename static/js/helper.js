var defaultImg = "../static/plugins/ep_profile_modal/static/img/user.png"

exports.createHTMLforUserList = function (total , online){
    var html = "<div id='usersIconList' class='ep_profile_inlineAvatars'>";
    $.each( online.reverse(), function( key, value ) {
        html += "<div class='avatar' data-id=\"user_"+value.userId+"\"  id=\"user_"+value.userId+"\" ><img class='avatarImg' data-id=\"user_"+value.userId+"\"  src='/p/getUserProfileImage/"+value.userId+"' /></div>"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}

exports.increaseUserFromList = function (userId){
    
    if (!$(".avatar[data-id=\"user_"+userId+"\"]").length){
        var $image = $("<div class='avatar'  data-id=\"user_"+userId+"\" id=\"user_"+userId+"\" ><img class='avatarImg' data-id=\"user_"+userId+"\" src='/p/getUserProfileImage/"+userId+"' /></div>");
        $image.prependTo("#usersIconList")
        $image.hide().slideDown(200);
    
    }

}

exports.decreaseUserFromList = function (userId){

    $(".avatar[data-id=\"user_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
        {
            $(this).remove();
        }
    )

    var selector_user = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ;

    if(selector_user.length){
        moveOnlineUserToOffline(selector_user)
    }else{
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

    


}


exports.manageOnlineOfflineUsers = function (all_users_list ,onlineUsers , currentUserId){
    
    var online_list_selector = $("#ep_profile_user_list_container") 
    var offline_list_selector = $("#ep_profile_user_list_container_off") 

    offline_list_selector.empty();
    $.each(all_users_list, function( key, value ) {
        //if (value.userId != currentUserId){
            var result = $.grep(onlineUsers, function(e){ return e.userId == value.userId; });
            if ( result.length ){ // online
                if (value.userName == "Anonymous" ){
                    var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;

                    if(selector_on.length){

                        increaseToOnlineAnonymous(selector_on , value.userId )
                        
                    }else{
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,"on_Anonymous")
                        online_list_selector.append(userListHtml);
                    }
                }else{


                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl ,false)
                        
                        try {
                            online_list_selector.append(userListHtml)
                        }catch(error){
                            console.log(error)
                        }
    
                    }else{
                        if (currentUserId == value.userId){
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").prependTo(online_list_selector)
                        }else {
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(online_list_selector)
                        }
                        
                    }
                }

            }else{ // offline
                if (value.userName == "Anonymous" ){
                    var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous\"]") ;
                    if(selector_off.length){
                        var anonymouseCount = selector_off.attr("data-anonymouseCount")
                        var new_anonymouseCount= parseInt(anonymouseCount)+1

                        var ids_data_off = selector_off.attr("data-user-ids")
                        var ids_data_off_array = ids_data_off.split(',');
                        ids_data_off_array.push(value.userId)
                        selector_off.attr("data-user-ids",ids_data_off_array.join(","))

                        selector_off.attr('data-anonymouseCount',new_anonymouseCount);
                        selector_off.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount);
                    }else{
                        createOfflineAnonymousElement(value.userId , value.imageUrl)
                    }
                }else{
                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,false)
                        offline_list_selector.append(userListHtml);
    
                    }else{
                        $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(offline_list_selector)
                    }
                }



                
            }
            
        
        //}
    })


}

var getHtmlOfUsersList = function(userId,username , img , anonymous_handler){
    if (anonymous_handler && username=="Anonymous"){
        return "<div  data-user-ids='"+userId+"' data-anonymouseCount=\"1\" data-id=\"user_list_"+anonymous_handler+"\" class=\"ep_profile_user_row\">"+
        "<img src=\""+ img + "\" class=\"ep_profile_user_img\">"+
        "<div class=\"ep_profile_user_username\"> "+username+" </div> </div>" ;
    }else{
        return "<div data-id=\"user_list_"+userId+"\" class=\"ep_profile_user_row\">"+
        "<img src=\""+ img + "\" class=\"ep_profile_user_img\">"+
        "<div class=\"ep_profile_user_username\"> "+username+" </div> </div>" ;
    }
   
}




var increaseToOnlineAnonymous = function(selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1){
        ids_data_array.push(userId)
        selector_on.attr("data-user-ids",ids_data_array.join(","))
        var new_anonymouseCount= parseInt(anonymouseCount)+1
        selector_on.attr('data-anonymouseCount',new_anonymouseCount);
        selector_on.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount);
    }

}

var decreaseFromOnlineAnonymous = function (selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');


    ids_data_array = $.grep(ids_data_array, function(value) {
        return value != userId;
      });    


    selector_on.attr("data-user-ids",ids_data_array.join(","))
    var new_anonymouseCount= parseInt(anonymouseCount)-1
    selector_on.attr('data-anonymouseCount',new_anonymouseCount);
    (new_anonymouseCount > 1) ? selector_on.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount) : selector_on.children(".ep_profile_user_username").text("Anonymous");
    if(new_anonymouseCount < 1){
        selector_on.remove()
    }
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
    selector_off.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount);
}


var decreaseFromOfflineAnonymous= function (selector_off,userId){
    var anonymouseCount = selector_off.attr("data-anonymouseCount")
    var ids_data = selector_off.attr("data-user-ids")

    ids_data = $.grep(ids_data, function(value) {
        return value != userId;
      });

    selector_off.attr("data-user-ids",ids_data)
    var new_anonymouseCount= parseInt(anonymouseCount)-1
    selector_off.attr('data-anonymouseCount',new_anonymouseCount);
    (new_anonymouseCount > 1) ? selector_off.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount) : selector_off.children(".ep_profile_user_username").text("Anonymous");
    return new_anonymouseCount
}


var createOfflineAnonymousElement = function (userId,img){
    var userListHtml = getHtmlOfUsersList(userId ,"Anonymous" , img,"off_Anonymous")
    $("#ep_profile_user_list_container_off").append(userListHtml);
}


var createOnlineUserElementInUserList = function (userId,userName,img,currentUserId){

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(!user_selector.length)
    {
        var userListHtml = getHtmlOfUsersList(userId ,userName, img,false)
        if (userId == currentUserId){ // it is owner 
            $("#ep_profile_user_list_container").prepend(userListHtml);
    
        }else{
            $("#ep_profile_user_list_container").append(userListHtml);
    
        }
    }else {
        user_selector.children(".ep_profile_user_username").text(userName);
        user_selector.children(".ep_profile_user_img").attr("src",img);

    }

}

var isThereOnlineAnonymous = function (){
    var selector =$(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;
    if (selector.length)
        return selector;
    else
        return false;
}
var checkUserExistInOnlineAnonymous = function(selector_on,userId){
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1){
        return false
    }else{
        return true
    }
}

var createOnlineAnonymousElement = function(userId , userName , imageUrl){
    var userListHtml = getHtmlOfUsersList(userId ,userName ,  imageUrl,"on_Anonymous")
    online_list_selector.append(userListHtml);
}

var moveOnlineUserToOffline =  function(userElemenet) {
    var offline_list_selector = $("#ep_profile_user_list_container_off") 
    offline_list_selector.append(userElemenet)
}

var removeUserElementInUserList = function(userId){
    $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").remove()
}

exports.removeUserElementInUserList = removeUserElementInUserList
exports.createOnlineAnonymousElement = createOnlineAnonymousElement ;
exports.isThereOnlineAnonymous = isThereOnlineAnonymous;
exports.checkUserExistInOnlineAnonymous = checkUserExistInOnlineAnonymous;
exports.createOnlineUserElementInUserList = createOnlineUserElementInUserList;
exports.increaseToOnlineAnonymous = increaseToOnlineAnonymous;
exports.getHtmlOfUsersList = getHtmlOfUsersList;
exports.decreaseFromOnlineAnonymous =decreaseFromOnlineAnonymous;