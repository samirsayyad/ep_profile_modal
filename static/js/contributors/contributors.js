var defaultImg = "../static/plugins/ep_profile_modal/static/img/user.png"
var shared = require("../shared")

exports.createHTMLforUserList = function (total , online,padId,verified_users){ // generate avatar too

    var html = "<div id='usersIconList' class='ep_profile_inlineAvatars'>";
    var style ;
    var borderStyle="";
    $.each( online.reverse(), function( key, value ) {
        
        style = "background: url(/static/getUserProfileImage/"+value.userId+"/"+padId+") no-repeat 50% 50% ; background-size : 28px;background-color: #fff;"
        if(verified_users && verified_users.length && verified_users!=="null"&& verified_users!==null ){
            if(verified_users.indexOf(value.userId) == -1 ) 
                borderStyle = "" ;
            else 
                borderStyle = "box-shadow: 0px 0px 1px 1px rgba(38,121,255,1);margin: 1px;";
        }
 
        style+=borderStyle
        html += "<div class='avatar' data-userId=\""+value.userId+"\" data-id=\"user_"+value.userId+"\"  id=\"user_"+value.userId+"\" ><div data-userId=\""+value.userId+"\"  class='avatarImg' style='"+style+"' data-id=\"user_"+value.userId+"\"></div></div>"
    });
    html += " </div>"
    return  html + "<span class='slash_profile'>⧸</span><span id='userlist_count' class='userlist_count'>"+total + "</span>" + 
    "<input  value='Share'  id='ep_profile_modal_share' type='button' class='ep_profile_modal_share'>"
}

exports.increaseUserFromList = function (userId,padId){
    var style = "background: url(/static/getUserProfileImage/"+userId+"/"+padId+") no-repeat 50% 50% ; background-size : 26px;background-color: #fff;"


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
        exports.moveOnlineUserToOffline(selector_user) 
        // selector_user.animate({opacity: 0}, 1000,"linear",function()
        // {
        //     $(this).remove();
        // }
        //)
    }else{
        var selector_on = $(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;
        if(selector_on.length){
            var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous\"]") ;
            exports.decreaseFromOnlineAnonymous(selector_on,userId)
            if(selector_off.length){
                exports.increaseToOfflineAnonymous(selector_off,userId)
            }else{
                exports.createOfflineAnonymousElement(userId,defaultImg,null,null,selector_user)
            }
        }
        else{
            var offline_list_selector = $("#ep_profile_user_list_offline") 
            if(offline_list_selector.length){
                offline_list_selector.append($(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]"))
            }else{
                var offline_container = $("#ep_profile_user_list_container_off") 
                offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'> </div>" );
                offline_list_selector = $("#ep_profile_user_list_offline") 
                $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo(offline_list_selector)
        
            }
            //$(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").appendTo("#ep_profile_user_list_container_off")
        }
    }

    //user img update
    var image_url ='/static/getUserProfileImage/'+userId+"/"+ padId  +"?t=" + new Date().getTime();
    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(user_selector.length)
    {
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+image_url+")" , "background-repeat":"no-repeat","background-size": "69px",
        });
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

                        exports.increaseToOnlineAnonymous(selector_on , value.userId )
                        
                    }else{
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,"on_Anonymous",value.about,value.homepage , "Online")
                        online_list_selector.append(userListHtml);
                      
                    }
                    if (currentUserId == value.userId)
                        $(".ep_profile_user_row[data-id='user_list_on_Anonymous']").css({"margin-top": "28px"}) //design 

                }else{


                    if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                    {
                        var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl ,false,value.about,value.homepage, "Online")
                        try {
                            online_list_selector.append(userListHtml)
                        }catch(error){
                            console.log(error)
                        }
    
                    }else{
                        if (currentUserId == value.userId){
                            
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").prependTo(online_list_selector)
                            //$(".ep_profile_user_list_date_title_header").prependTo(online_list_selector)

                        }else {
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(online_list_selector)
                        }
                        
                    }
                    if (currentUserId == value.userId)
                        $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").css({"margin-top": "28px"}) //design 

                }

            }else{ // offline
                if(value.last_seen_date !==""){
                    if (value.userName != "Anonymous" ){
                    
                        if(!$(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").length)
                        {
                            var userListHtml = getHtmlOfUsersList(value.userId ,value.userName , value.imageUrl,false,value.about,value.homepage , shared.getCustomDate(value.last_seen_date))
                            var selector_offlines_date = $("#ep_profile_user_list_offline")
                            if(selector_offlines_date.length){
                                selector_offlines_date.append(userListHtml);
                            }else{
                                $("#ep_profile_user_list_container_off").append("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>   "+userListHtml+"</div>" );
                            }
        
                        }else{
                            $(".ep_profile_user_row[data-id=\"user_list_"+value.userId+"\"]").appendTo(offline_list_selector)
                        }
                    }
                }
               



                
            }
            
        
        //}
    })

    // just for anonymouse to be end of list
    $.each(all_users_list, function( key, value ) {
        //if (value.userId != currentUserId){
            var result = $.grep(onlineUsers, function(e){ return e.userId == value.userId; });
            if ( !result.length ){ // offline 
                if(value.last_seen_date !=="" && value.userName == "Anonymous" ){
                    var selector_off = $(".ep_profile_user_row[data-id=\"user_list_off_Anonymous\"]") ;
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
                        var userListHtml = getHtmlOfUsersList(value.userId ,"Anonymous" , value.imageUrl,"off_Anonymous",value.about,value.homepage,shared.getCustomDate(value.last_seen_date))
                        var selector_offlines_date = $("#ep_profile_user_list_offline")
                        if(selector_offlines_date.length){
                            selector_offlines_date.append(userListHtml);
                        }else{
                            $("#ep_profile_user_list_container_off").append("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'>  "+userListHtml+"</div>" );

                        }
                    }
                }
            }
    })


    


}

var getHtmlOfUsersList = function(userId,username , img , anonymous_handler,about,homepage , seenStatus){
    about = about || ""
    homepage = homepage || ""
    var style
    if (anonymous_handler && username=="Anonymous"){
        style = "background: url("+img+") no-repeat 50% 50% ; background-size : 69px ;";

        return ("<div  data-user-ids='"+userId+"' data-anonymouseCount='1' data-id='user_list_"+anonymous_handler+"' class='ep_profile_user_row'>"+
        "<div style='"+style+"' class='ep_profile_user_img'></div>"+
        "<div class='ep_profile_user_list_profile_userDesc'>" + 
            "<div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >" + username + "</div>"  + 
            "<div class='ep_profile_contributor_status'>" + seenStatus + "</div>"  +
            "</div>" +
            "<p class='ep_profile_user_list_profile_desc'>" +  about   + "</p>" +
        "</div> </div>") ;
    }else{
        style = "background: url("+img+") no-repeat 50% 50% ; background-size : 69px ;";
        return ("<div data-id='user_list_"+userId+"' class='ep_profile_user_row'>"+
        "<div style='"+style+"' class='ep_profile_user_img'></div>"+
        "<div class='ep_profile_user_list_profile_userDesc'>" + 
            "<div class='ep_profile_user_list_username'><div class='ep_profile_user_list_username_text' >" + username + "</div>"  + 
            "<a target='_blank'  class='ep_profile_contributor_link_container' title='"+ shared.getValidUrl(homepage)  +"' href='"+ shared.getValidUrl(homepage)  +"'> </a>" +
            "<div class='ep_profile_contributor_status'>" + seenStatus + "</div>"  +
            "</div>" +
            "<p class='ep_profile_user_list_profile_desc'>" +  about + "</p>" +
        "</div> </div>") ;
    }
   
}




exports.increaseToOnlineAnonymous = function(selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1){
        ids_data_array.push(userId)
        selector_on.attr("data-user-ids",ids_data_array.join(","))
        var new_anonymouseCount= parseInt(anonymouseCount)+1
        selector_on.attr('data-anonymouseCount',new_anonymouseCount);
        selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").
        children(".ep_profile_user_list_username_text").text("Anonymous ×"+new_anonymouseCount);
    }

}

exports.decreaseFromOnlineAnonymous = function (selector_on,userId){
    var anonymouseCount = selector_on.attr("data-anonymouseCount")
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');


    ids_data_array = $.grep(ids_data_array, function(value) {
        return value != userId;
      });    


    selector_on.attr("data-user-ids",ids_data_array.join(","))
    var new_anonymouseCount= parseInt(anonymouseCount)-1
    selector_on.attr('data-anonymouseCount',new_anonymouseCount);
    if (new_anonymouseCount > 1){
        selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").
        children(".ep_profile_user_list_username_text").text("Anonymous ×"+new_anonymouseCount);
    }
    else{ 
        selector_on.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").
        children(".ep_profile_user_list_username_text").text("Anonymous");
    }

    if(new_anonymouseCount < 1){
        selector_on.remove()
    }
    return new_anonymouseCount
}


exports.increaseToOfflineAnonymous = function(selector_off,userId){
    var anonymouseCount = selector_off.attr("data-anonymouseCount")
    var ids_data = selector_off.attr("data-user-ids")
    
    ids_data = $.grep(ids_data, function(value) {
        return value != userId;
      });

    selector_off.attr("data-user-ids",ids_data)
    var new_anonymouseCount= parseInt(anonymouseCount)+1
    selector_off.attr('data-anonymouseCount',new_anonymouseCount);
    selector_off.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text")
    .text("Anonymous ×"+new_anonymouseCount);
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


exports.createOfflineAnonymousElement = function (userId,img,about,homepage,userElement){
    var userListHtml = getHtmlOfUsersList(userId ,"Anonymous" , img,"off_Anonymous",about,homepage, "Today")  
    //$("#ep_profile_user_list_container_off").append(userListHtml);
    var offline_list_selector = $("#ep_profile_user_list_offline") 
    if(offline_list_selector.length){
        var user_selector = $(".ep_profile_user_row[data-id='user_list_off_Anonymous']") ; // because need anonymous offline be last one
        if(user_selector.length)
        {
            userElement.insertBefore( user_selector);

        }else{
            offline_list_selector.append(userElement)
        }

    }else{
        var offline_container = $("#ep_profile_user_list_container_off") 
        offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>" );
        offline_list_selector = $("#ep_profile_user_list_offline") 
        offline_list_selector.append(userListHtml)

    }
}


exports.createOnlineUserElementInUserList = function (userId,userName,img,currentUserId , user){

    var user_selector = $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]") ; 
    if(!user_selector.length)
    {
        var userListHtml = getHtmlOfUsersList(userId ,userName, img,false,user.about , user.homepage , "Online")
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
        user_selector.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_user_list_username_text")
        .text(userName);
        user_selector.children(".ep_profile_user_img").css({"background-position":"50% 50%",
        "background-image":"url("+img+")" , "background-repeat":"no-repeat","background-size": "69px"
        });
        //attr("src",img);

    }

}

exports.isThereOnlineAnonymous = function (){
    var selector =$(".ep_profile_user_row[data-id=\"user_list_on_Anonymous\"]") ;
    if (selector.length)
        return selector;
    else
        return false;
}
exports.checkUserExistInOnlineAnonymous = function(selector_on,userId){
    var ids_data = selector_on.attr("data-user-ids")
    var ids_data_array = ids_data.split(',');
    if (ids_data_array.indexOf(userId) == -1){
        return false
    }else{
        return true
    }
}

exports.createOnlineAnonymousElement = function(userId , userName , imageUrl,user){
    var online_list_selector = $("#ep_profile_user_list_container") 
    var userListHtml = getHtmlOfUsersList(userId ,userName ,  imageUrl,"on_Anonymous",user.about , user.homepage , "Online")
    online_list_selector.append(userListHtml);
}

exports.moveOnlineUserToOffline =  function(userElement) {
    var offline_list_selector = $("#ep_profile_user_list_offline") 
    if(offline_list_selector.length){
        var user_selector = $(".ep_profile_user_row[data-id='user_list_off_Anonymous']") ; // because need anonymous offline be last one
        if(user_selector.length)
        {
            userElement.insertBefore( user_selector);

        }else{
            offline_list_selector.append(userElement)
        }
            
    }else{
        var offline_container = $("#ep_profile_user_list_container_off") 
        offline_container.prepend("<div class='ep_profile_user_list_date_title' id='ep_profile_user_list_offline'></div>" );
        offline_list_selector = $("#ep_profile_user_list_offline") 
        offline_list_selector.append(userElement)

    }

    userElement.children(".ep_profile_user_list_profile_userDesc").children(".ep_profile_user_list_username").children(".ep_profile_contributor_status").text("Last seen today")
}

exports.removeUserElementInUserList = function(userId){
    $(".ep_profile_user_row[data-id=\"user_list_"+userId+"\"]").remove()
}