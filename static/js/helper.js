var defaultImg = "../static/plugins/ep_profile_modal/static/img/user.png"

exports.createHTMLforUserList = function (total , online,padId){

    var html = "<div id='usersIconList' class='ep_profile_inlineAvatars'>";
    var style ;
    $.each( online.reverse(), function( key, value ) {
        style = "background: url(/p/getUserProfileImage/"+value.userId+"/"+padId+") no-repeat 50% 50% ; background-size : 26px"

        html += "<div class='avatar' data-userId=\""+value.userId+"\" data-id=\"user_"+value.userId+"\"  id=\"user_"+value.userId+"\" ><div data-userId=\""+value.userId+"\"  class='avatarImg' style='"+style+"' data-id=\"user_"+value.userId+"\"></div></div>"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'> &#8725; </span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + ""
}

exports.increaseUserFromList = function (userId,padId){
    var style = "background: url(/p/getUserProfileImage/"+userId+"/"+padId+") no-repeat 50% 50% ; background-size : 26px"


    if (!$(".avatar[data-id=\"user_"+userId+"\"]").length){
        var $image = $("<div class='avatar' data-userId=\""+userId+"\"  data-id=\"user_"+userId+"\" id=\"user_"+userId+"\" ><div class='avatarImg' data-userId=\""+userId+"\"  data-id=\"user_"+userId+"\" style='"+style+"'></div></div>");
        $image.prependTo("#usersIconList")
        $image.hide().slideDown(200);
    
    }

}

exports.decreaseUserFromList = function (userId,padId){

    $(".avatar[data-id=\"user_"+userId+"\"]").animate({opacity: 0}, 1000,"linear",function()
        {
            $(this).remove();
        }
    )

    var selector_user = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ;
    if(selector_user.length){
        moveOnlineUserToOffline(selector_user) 
        // selector_user.animate({opacity: 0}, 1000,"linear",function()
        // {
        //     $(this).remove();
        // }
        //)
    }else{
        var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;
        if(selector_on.length){
            var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous_today\"]") ;
            decreaseFromOnlineAnonymous(selector_on,userId)
            if(selector_off.length){
                increaseToOfflineAnonymous(selector_off,userId)
            }else{
                createOfflineAnonymousElement(userId,defaultImg,null,null)
            }
        }
        else{
            var offline_list_selector = $("#ep_profile_user_list_offline_today") 
            if(offline_list_selector.length){
                offline_list_selector.append($(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]"))
            }else{
                var offline_container = $("#ep_profile_user_list_container_off") 
                offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline_today'> <p class='ep_profile_user_date_title'> "+getCustomeFormatDate("today")+ "</p> </div>" );
                offline_list_selector = $("#ep_profile_user_list_offline_today") 
                $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo(offline_list_selector)
        
            }
            //$(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo("#ep_profile_user_list_container_off")
        }
    }

    //user img update
    var image_url ='/p/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
        });
    } 

    


}


exports.manageOnlineOfflineUsers = function (all_users_list ,onlineUsers , currentUserId){
    
    var online_list_selector = $("#ep_profile_user_list_container") 
    var offline_list_selector = $("#ep_profile_user_list_container_off") 

    offline_list_selector.empty();
    console.log(all_users_list ,onlineUsers , currentUserId)
    $.each(all_users_list, function( key, value ) {
        //if (value.userId != currentUserId){
            var result = $.grep(onlineUsers, function(e){ return e.userId == value.userId; });
            if ( result.length ){ // online
                if (value.userName == "Anonymous" ){
                    var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;

                    if(selector_on.length){
                        console.log("online ano",selector_on , value.userId )

                        increaseToOnlineAnonymous(selector_on , value.userId )
                        
                    }else{
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,"on_Anonymous",value.about,value.homepage)
                        console.log("online not selector ano",userListHtml)

                        online_list_selector.append(userListHtml);
                    }
                }else{


                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        console.log("online not ano",value)

                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl ,false,value.about,value.homepage)
                        console.log("online not ano",userListHtml)

                        try {
                            online_list_selector.append(userListHtml)
                        }catch(error){
                            console.log(error)
                        }
    
                    }else{
                        if (currentUserId == value.userId){
                            
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").prependTo(online_list_selector)
                            $(".ep_profile_user_list_date_title").prependTo(online_list_selector)

                        }else {
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(online_list_selector)
                        }
                        
                    }
                }

            }else{ // offline
                if(value.last_seen_date !==""){
                    if (value.userName == "Anonymous" ){
                        var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous_"+value.last_seen_date +"\"]") ;
                        if(selector_off.length){
                            var anonymouseCount = selector_off.attr("data-anonymouseCount")
                            var new_anonymouseCount= parseInt(anonymouseCount)+1
    
                            var ids_data_off = selector_off.attr("data-user-ids")
                            var ids_data_off_array = ids_data_off.split(',');
                            ids_data_off_array.push(value.userId)
                            selector_off.attr("data-user-ids",ids_data_off_array.join(","))
    
                            selector_off.attr('data-anonymouseCount',new_anonymouseCount);
                            selector_off.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+new_anonymouseCount);
                        }else{
                            
                            //createOfflineAnonymousElement(value.userId , value.imageUrl,value.about,value.homepage,)
                            var userListHtml = getHtmlOfUsersList(value.userId ,"Anonymous" , value.imageUrl,"off_Anonymous_"+value.last_seen_date,value.about,value.homepage)
                            console.log("createOfflineAnonymousElement",userListHtml)
                            var selector_offlines_date = $("#ep_profile_user_list_offline_"+value.last_seen_date)
                            if(selector_offlines_date.length){
                                selector_offlines_date.append(userListHtml);
                            }else{
                                $("#ep_profile_user_list_container_off").append("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline_"+
                                    value.last_seen_date+"'> <p class='ep_profile_user_date_title'> "+getCustomeFormatDate(value.last_seen_date)+ "</p> "+userListHtml+"</div>" );

                            }
                        }
                    }else{
                        if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                        {
                            var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,false)
                            console.log("offline not ano",userListHtml)
                            var selector_offlines_date = $("#ep_profile_user_list_offline_"+value.last_seen_date)
                            if(selector_offlines_date.length){
                                selector_offlines_date.append(userListHtml);
                            }else{
                                $("#ep_profile_user_list_container_off").append("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline_"+
                                value.last_seen_date+"'> <p class='ep_profile_user_date_title'> "+getCustomeFormatDate(value.last_seen_date)+ "</p> "+userListHtml+"</div>" );
                            }
        
                        }else{
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(offline_list_selector)
                        }
                    }
                }
               



                
            }
            
        
        //}
    })


}

var getHtmlOfUsersList = function(userId,username , img , anonymous_handler,about,homepage){
    var style = "background: url("+img+") no-repeat 50% 50% ; background-size : 128px"

    if (anonymous_handler && username=="Anonymous"){
        return ("<div  data-user-ids='"+userId+"' data-anonymouseCount='1' data-id='user_list_"+anonymous_handler+"' class='ep_profile_user_row'>"+
        "<div style='"+style+"' class='ep_profile_user_img'></div>"+
        "<div class='ep_profile_user_list_profile_userDesc'>" + 
            "<p class='ep_profile_user_list_username'>" + username + "</p>" +
            "<p class='ep_profile_user_list_profile_desc'>" +  about   + "</p>" +
            "<p class='ep_profile_user_list_profile_homepage'>"+ 
            "<a  class='ep_profile_user_list_profile_homepage_link'  href='"+ homepage  +"'>" + homepage + "</a>" +"</p>" +
             "</div> </div>") ;
    }else{

        return ("<div data-id='user_list_"+userId+"' class='ep_profile_user_row'>"+
        "<div style='"+style+"' class='ep_profile_user_img'></div>"+
        "<div class='ep_profile_user_list_profile_userDesc'>" + 
            "<p class='ep_profile_user_list_username'>" + username + "</p>" +
            "<p class='ep_profile_user_list_profile_desc'>" +  about + "</p>" +
            "<p class='ep_profile_user_list_profile_homepage'>"+ 
            "<a class='ep_profile_user_list_profile_homepage_link' href='"+homepage+"'>" + homepage+ "</a>" +"</p>" +
            "</div> </div>") ;
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
        selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+new_anonymouseCount);
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
    (new_anonymouseCount > 1) ? selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+new_anonymouseCount) : selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous");
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
    selector_off.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text("Anonymous ×"+new_anonymouseCount);
}


// var decreaseFromOfflineAnonymous= function (selector_off,userId){
//     var anonymouseCount = selector_off.attr("data-anonymouseCount")
//     var ids_data = selector_off.attr("data-user-ids")

//     ids_data = $.grep(ids_data, function(value) {
//         return value != userId;
//       });

//     selector_off.attr("data-user-ids",ids_data)
//     var new_anonymouseCount= parseInt(anonymouseCount)-1
//     selector_off.attr('data-anonymouseCount',new_anonymouseCount);
//     (new_anonymouseCount > 1) ? selector_off.children(".ep_profile_user_username").text("Anonymous ×"+new_anonymouseCount) : selector_off.children(".ep_profile_user_username").text("Anonymous");
//     return new_anonymouseCount
// }


var createOfflineAnonymousElement = function (userId,img,about,homepage){
    var userListHtml = getHtmlOfUsersList(userId ,"Anonymous" , img,"off_Anonymous",about,homepage)
    console.log("createOfflineAnonymousElement",userListHtml)
    
    //$("#ep_profile_user_list_container_off").append(userListHtml);
    var offline_list_selector = $("#ep_profile_user_list_offline_today") 
    if(offline_list_selector.length){
        offline_list_selector.append(userListHtml)
    }else{
        var offline_container = $("#ep_profile_user_list_container_off") 
        offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline_today'> <p class='ep_profile_user_date_title'> "+getCustomeFormatDate("today")+ "</p> </div>" );
        offline_list_selector = $("#ep_profile_user_list_offline_today") 
        offline_list_selector.append(userListHtml)

    }
}


var createOnlineUserElementInUserList = function (userId,userName,img,currentUserId , user){

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(!user_selector.length)
    {
        var userListHtml = getHtmlOfUsersList(userId ,userName, img,false,user.about , user.homepage)
        console.log("createOnlineUserElementInUserList",userListHtml)
        if (userId == currentUserId){ // it is owner 
            var titleOfContributors = $("#ep_profile_user_list_date_title")
            if(titleOfContributors.length){
                $(userListHtml).insertAfter(titleOfContributors)
            }else{
                $("#ep_profile_user_list_container").prepend(userListHtml);
            }
        }else{
            $("#ep_profile_user_list_container").append(userListHtml);
    
        }
    }else {
        user_selector.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").text(userName);
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+img+")" , "background-repeat":"no-repeat","background-size": "128px"
        });
        //attr("src",img);

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

var createOnlineAnonymousElement = function(userId , userName , imageUrl,user){
    var userListHtml = getHtmlOfUsersList(userId ,userName ,  imageUrl,"on_Anonymous",user.about , user.homepage)
    console.log("createOnlineAnonymousElement",userListHtml)
    online_list_selector.append(userListHtml);
}

var moveOnlineUserToOffline =  function(userElemenet) {
    var offline_list_selector = $("#ep_profile_user_list_offline_today") 
    if(offline_list_selector.length){
        offline_list_selector.append(userElemenet)
    }else{
        var offline_container = $("#ep_profile_user_list_container_off") 
        offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline_today'> <p class='ep_profile_user_date_title'> "+getCustomeFormatDate("today")+ "</p> </div>" );
        offline_list_selector = $("#ep_profile_user_list_offline_today") 
        offline_list_selector.append(userElemenet)

    }
}

var removeUserElementInUserList = function(userId){
    $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").remove()
}
var userLogin = function(data){
    
    window.user_status = "login"
    $('#ep_profile_modal_ask').removeClass('ep_profile_modal-show')
    $("#ep_profile_modal_section_info_email").text(data.email)
    $("#ep_profile_modal_section_info_name").text(data.username)
    pad.collabClient.updateUserInfo({
        userId :  pad.getUserId() ,
        name: data.username,
        colorId: "#b4b39a"
    })

}
var refreshUserImage = function (userId ,padId ){
    var image_url ='/p/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
    var avatar = $(".avatarImg[data-id=\"user_"+userId+"\"]")
    if (avatar.length){
        avatar.css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "26px"
        });
    }
    $(".ep_profile_modal_section_image_big_ask").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
    $(".ep_profile_modal_section_image_big").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat"});
    $("#ep-profile-image").css({"background-position":"50% 50%",
    "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "32px"
    });

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "128px"
        });
    } 
}
var getMonthName = function(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
}
var getCustomeFormatDate = function(date) {
    if (date == "today" || date == "yesterday" ) return "Last seen "+date;
    date = date.split("-");
    return "Last seen "+ date[2] + " " + getMonthName(date[1]) + " " + date[0]
}
exports.removeUserElementInUserList = removeUserElementInUserList
exports.createOnlineAnonymousElement = createOnlineAnonymousElement ;
exports.isThereOnlineAnonymous = isThereOnlineAnonymous;
exports.checkUserExistInOnlineAnonymous = checkUserExistInOnlineAnonymous;
exports.createOnlineUserElementInUserList = createOnlineUserElementInUserList;
exports.increaseToOnlineAnonymous = increaseToOnlineAnonymous;
exports.getHtmlOfUsersList = getHtmlOfUsersList;
exports.decreaseFromOnlineAnonymous =decreaseFromOnlineAnonymous;
exports.userLogin =userLogin;
exports.refreshUserImage =refreshUserImage;
exports.getCustomeFormatDate =getCustomeFormatDate;