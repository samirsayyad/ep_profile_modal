
var shared = require("../shared")
var helper = require("../helper")
exports.showModal = function(){
    $('#ep_profile_formModal').addClass('ep_profile_formModal_show')
    $('#ep_profile_formModal_overlay').addClass('ep_profile_formModal_overlay_show')
    $('#ep_profile_formModal_overlay').css({"display":"block"})
}
exports.hideFormModalOverlay = function(){
    $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show')
    $('#ep_profile_formModal_overlay').css({"display":"none"})

    exports.handleOnCloseOverlay()



}
exports.handleOnCloseOverlay = function(){
    var userId = pad.getUserId() 
    var padId =  pad.getPadId()
    var $form = $("#ep_profile_formModal_msform");
    var data =  exports.getFormData($form);
    var msg ={}
    if(data.ep_profile_modalForm_name == "")
        return false;
    // var message = {
    //     type : 'ep_profile_modal',
    //     action : "ep_profile_modal_send_chat_message" ,
    //     userId :  userId,
    //     data: data,
    //     padId : padId
    //     }
    // pad.collabClient.sendMessage(message);  // Send the chat position message to the server
	var text = "Please welcome "+data.ep_profile_modalForm_name;
    if (data.ep_profile_modalForm_about_yourself !=="")
        text += `, ${data.ep_profile_modalForm_about_yourself}`
    if (data.ep_profile_modalForm_homepage !==""){
        let url = shared.getValidUrl(data.ep_profile_modalForm_homepage)
        text += `, <a target='_blank' href='${url}'>${data.ep_profile_modalForm_homepage}</a>`
        // text += `, ${message.data.ep_profile_modalForm_homepage} `
    }

    msg.text = '<span><b>' + text + '</b></span>' ;
	msg.target = "profile";
    msg.userId = userId
    msg.time = new Date()

	//shared.addTextChatMessage(msg);
    var message = {
        type : 'ep_profile_modal',
        action : "EP_PROFILE_MODAL_SEND_MESSAGE_TO_CHAT" ,
        userId :  userId,
        data: msg,
        padId : padId
    }
    pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}
exports.resetModal = function(){
    var fieldsets = $("#ep_profile_formModal_msform fieldset") ;
    fieldsets.each(function(index){
        if (index==0) $(this).show(); else $(this).hide();    
    })
}
exports.getFormData=function($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
exports.initModal = function(clientVars){

        var modal = $("#ep_profile_formModal_script").tmpl(clientVars);
        $("body").append(modal);

        //jQuery time
        var current_fs, next_fs, previous_fs; //fieldsets
        var left, opacity, scale; //fieldset properties which we will animate
        var animating; //flag to prevent quick multi-click glitches
        
        $("#ep_profile_formModal_msform fieldset").on("keypress",function(e){
            if (e.keyCode == 13) {

                // Cancel the default action on keypress event
                e.preventDefault(); 
                current_fs = $(this);
                next_fs = $(this).next();
                nextHandler(current_fs,next_fs)

            }
        })
        $(".next").click(function(){
            current_fs = $(this).parent();
            next_fs = $(this).parent().next();
            nextHandler(current_fs,next_fs)
            
        });

        $(".skip").click(function(){
            if(animating) return false;
            $("#ep_profile_modalForm_name").css({"border":"1px solid gray"})

            animating = true;
            
            current_fs = $(this).parent();
            next_fs = $(this).parent().next();
            
            //activate next step on progressbar using the index of next_fs
            //$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            
            //show the next fieldset
            current_fs.hide();
            next_fs.show(); 
            animating = false;
 
        });


        $(".close , #ep_profile_formModal_overlay").click(function(){
            $('#ep_profile_formModal').removeClass('ep_profile_formModal_show')

            exports.hideFormModalOverlay()

            return false;

        })
        $(".previous").click(function(){
            if(animating) return false;
            animating = true;
            
            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();
            
            //de-activate current step on progressbar
            //$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
            current_fs.hide();
            previous_fs.show(); 
            animating = false;

        });

        $(".submit").click(function(){
            submitHandle()
            return false;
        })
        $(".clear").click(function(){
            shared.resetAllProfileImage($(this).attr("data-userId"),$(this).attr("data-padId"))
        })
 
        function sendFormDataToServer(){
            var userId = pad.getUserId() 
            var padId =  pad.getPadId()
            var $form = $("#ep_profile_formModal_msform");
            var data =  exports.getFormData($form);
            var message = {
				type : 'ep_profile_modal',
				action : "ep_profile_modal_info" ,
				userId :  userId,
				data: data,
				padId : padId
			  }
            pad.collabClient.sendMessage(message);  // Send the chat position message to the server

        }
        function submitHandle (){
            var userId = pad.getUserId() 
            var padId =  pad.getPadId()
            $('#ep_profile_formModal').removeClass('ep_profile_formModal_show')
            exports.hideFormModalOverlay()
            
            sendFormDataToServer()

            var username = $("#ep_profile_modalForm_name").val()

			helper.userLogin({
				email : $("#ep_profile_modalForm_email").val(),
				username : username,
            })
            setTimeout(function() { 
                helper.refreshUserImage(userId , padId)
            }, 2200);
            // sync profile section to up 
            
        }



        function nextHandler(current_fs,next_fs){
            console.log("clicked")
            if(animating) return false;

            var currentSection = current_fs.attr("data-section")
            if (currentSection=="name"){
                if ($("#ep_profile_modalForm_name").val() == "") {
                    $("#ep_profile_modalForm_name").css({"border":"1px solid red"})
                    return false;
                }
                var username =$("#ep_profile_modalForm_name").val()
                $("#ep_profile_modalForm_name").css({"border":"1px solid gray"})
                // submit username once user input and press next
                helper.userLogin({
                    username : username,
                })
                shared.loginByEmailAndUsernameWithoutValidation(username,"",false)

            }
            if (currentSection=="email"){
                var userEmail = $("#ep_profile_modalForm_email").val()
                if (!shared.isEmail(userEmail) || userEmail==""){
                    $("#ep_profile_modalForm_email").css({"border":"1px solid red"})
                    return false;
                }
                var username = $("#ep_profile_modalForm_name").val()
                shared.loginByEmailAndUsernameWithoutValidation(username,userEmail,true)
                sendEmailVerification(userEmail,username)
                $("#ep_profile_modalForm_email").css({"border":"1px solid gray"})
            }

            if (currentSection=="homepage"){
                var userLink = $("#ep_profile_modal_homepage").val()
                console.log(shared.IsValid(userLink))
                if (!shared.IsValid(userLink) || userLink==""){
                    $("#ep_profile_modal_homepage").css({"border":"1px solid red"})
                    return false;
                }
                $("#ep_profile_modal_homepage").css({"border":"1px solid gray"})
                sendFormDataToServer()
            }

            if (currentSection=="image"){
                uploadImg()
            }


            animating = true;
            current_fs.hide();
            if (next_fs.length){
                next_fs.show(); 
            }else{ //seems last fieldset
                submitHandle()
            }
            animating = false;
        }





    function sendEmailVerification(email , username){
        $.ajax({
            url: '/p/' + pad.getPadId() + '/pluginfw/ep_profile_modal/sendVerificationEmail/'+pad.getUserId()+"/"+username+"/"+email ,
            type: 'get',
            data: {},
            contentType: false,
            processData: false,
            beforeSend: function() {
                // setting a timeout
                var image_url ='../static/plugins/ep_profile_modal/static/img/loading.gif'

                $("#ep_profile_modal_verification").text("Sending...")
                    
            },
            error: function(xhr) { // if error occured
                $("#ep_profile_modal_verification").text("Error")
                setTimeout(function() { 
                    $("#ep_profile_modal_verification").text(oldText)
                }, 2000);

            },
            success: function(response){
                $("#ep_profile_modal_verification").text("Verification email has been sent.")
                $("#ep_profile_modal_verification").attr("data-verification-status","true")
            }
            
        })
    }



    function uploadImg(){
        var userId= pad.getUserId()  ;
		var fd = new FormData();
		var files = $('#profile_file_modal')[0].files[0];
        fd.append('file',files);
		if (!files) return;
		$.ajax({
			url: '/p/' + clientVars.padId + '/pluginfw/ep_profile_modal/upload/'+userId ,
			type: 'post',
			data: fd,
			contentType: false,
			processData: false,
			beforeSend: function() {
				// setting a timeout
                
                helper.refreshLoadingImage(userId, clientVars.padId)
					
			},
			error: function(xhr) { // if error occured
                helper.refreshUserImage(userId, clientVars.padId)

			},
			success: function(response){
                helper.refreshUserImage(userId, clientVars.padId)

			}
			
		})
    }










        // upload image profile
	$("#profile_file_modal").on('change', function(e) {
		var files = $('#profile_file_modal')[0].files[0];

        var url = URL.createObjectURL(files);
        $("#profile_modal_selected_image").css({"background-position":"50% 50%",
        "background-image":"url("+url+")" , "background-repeat":"no-repeat","background-size": "128px"
        });
	})

}
