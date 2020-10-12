
var shared = require("../shared")
var helper = require("../helper")

exports.initModal = function(clientVars){

        var modal = $("#ep_profile_formModal_script").tmpl(clientVars);
        $("body").append(modal);
        $('#ep_profile_formModal').addClass('ep_profile_formModal_show')
        $('#ep_profile_formModal_overlay').addClass('ep_profile_formModal_overlay_show')

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
            //hide the current fieldset with style
            // current_fs.animate({opacity: 0}, {
            //     step: function(now, mx) {
            //         //as the opacity of current_fs reduces to 0 - stored in "now"
            //         //1. scale current_fs down to 80%
            //         scale = 1 - (1 - now) * 0.2;
            //         //2. bring next_fs from the right(50%)
            //         left = (now * 50)+"%";
            //         //3. increase opacity of next_fs to 1 as it moves in
            //         opacity = 1 - now;
            //         current_fs.css({
            //     'transform': 'scale('+scale+')',
            //     'position': 'absolute'
            // });
            //         next_fs.css({'left': left, 'opacity': opacity});
            //     }, 
            //     duration: 800, 
            //     complete: function(){
            //         current_fs.hide();
            //         animating = false;
            //     }, 
            //     //this comes from the custom easing plugin
            //     easing: 'easeInOutBack'
            // });
        });


        $(".close , #ep_profile_formModal_overlay").click(function(){
            $('#ep_profile_formModal').removeClass('ep_profile_formModal_show')
            $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show')
            $('#ep_profile_formModal_overlay').css({"display":"none"})

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
            // //show the previous fieldset
            // previous_fs.show(); 
            // //hide the current fieldset with style
            // current_fs.animate({opacity: 0}, {
            //     step: function(now, mx) {
            //         //as the opacity of current_fs reduces to 0 - stored in "now"
            //         //1. scale previous_fs from 80% to 100%
            //         scale = 0.8 + (1 - now) * 0.2;
            //         //2. take current_fs to the right(50%) - from 0%
            //         left = ((1-now) * 50)+"%";
            //         //3. increase opacity of previous_fs to 1 as it moves in
            //         opacity = 1 - now;
            //         current_fs.css({'left': left});
            //         previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
            //     }, 
            //     duration: 800, 
            //     complete: function(){
            //         current_fs.hide();
            //         animating = false;
            //     }, 
            //     //this comes from the custom easing plugin
            //     easing: 'easeInOutBack'
            // });
        });

        $(".submit").click(function(){
            submitHandle()
            return false;
        })
        $(".clear").click(function(){
            shared.resetAllProfileImage($(this).attr("data-userId"),$(this).attr("data-padId"))
        })
        function submitHandle (){
            var userId = pad.getUserId() 
            var padId =  pad.getPadId()
            $('#ep_profile_formModal').removeClass('ep_profile_formModal_show')
            $('#ep_profile_formModal_overlay').removeClass('ep_profile_formModal_overlay_show')
            $('#ep_profile_formModal_overlay').css({"display":"none"})
            
            var $form = $("#ep_profile_formModal_msform");
            var data = getFormData($form);
            var message = {
				type : 'ep_profile_modal',
				action : "ep_profile_modal_info" ,
				userId :  userId,
				data: data,
				padId : padId
			  }
            pad.collabClient.sendMessage(message);  // Send the chat position message to the server

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

        function getFormData($form){
            var unindexed_array = $form.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });

            return indexed_array;
        }

        function nextHandler(current_fs,next_fs){
            console.log("clicked")
            if(animating) return false;
            animating = true;

            var currentSection = current_fs.attr("data-section")
            if (currentSection=="name"){
                if ($("#ep_profile_modalForm_name").val() == "") {
                    $("#ep_profile_modalForm_name").css({"border":"1px solid red"})
                    return false;
                }
                $("#ep_profile_modalForm_name").css({"border":"1px solid gray"})

            }
            if (currentSection=="email"){
                var userEmail = $("#ep_profile_modalForm_email").val()
                if (!shared.isEmail(userEmail) || userEmail==""){
                    $("#ep_profile_modalForm_email").css({"border":"1px solid red"})
                    return false;
                }
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

}
