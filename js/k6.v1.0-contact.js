/*$(function() {
var use_ajax=true;
$("#contact").submit(function(e){
    e.preventDefault();
    if(use_ajax){
        $('#loading').css('visibility','visible');
        $.post('contact_proc.php',$(this).serialize()+'&ajax=1',
            function(data){
                if(parseInt(data)==-1){
                } else {
                    $("#contact").slideUp('slow').after('<h1>Thank you!</h1>');
                }
                $('#loading').css('visibility','hidden');
            }
        );
    }
})
});*/
$(function() { // help from: http://dl.dropbox.com/u/1715120/demos/real-time-form-validation-using-jquery/index.html , http://yensdesign.com/2009/01/how-validate-forms-both-sides-using-php-jquery/
if (!$(".checkboxcstm").length > 0){
    var cb = $('input[name=copy]');
    cb.hide();
    cb.parent().append(function(){
        return (cb.is(':checked'))?'<div class="checkboxcstm checkboxcstm_active" />':'<div class="checkboxcstm" />';
    });
    cb.click(function(){
        cb.parent().find('div').toggleClass('checkboxcstm_active');
    });
}
    var jVal = {            
        'nameK' : function() {	
            var field = $('input[name="name"]');
            var namespan = $(field).parent().find('span');
            if(field.val().length < 5) {
                    jVal.errorname = true;
                            namespan.removeClass('correct').html('write at least 5 characters').show();
                            field.removeClass('correct');
                        if (namespan.hasClass('error')) { field.addClass('wrong'); }		
            } else {
                    jVal.errorname = false;
                            namespan.removeClass('error').addClass('correct').html('hi <i>'+ field.val() +'</i>!').show();
                            field.removeClass('wrong').addClass('correct');                               
            }
        },
        'nameB' : function() {	
            var field = $('input[name="name"]');
            var namespan = $(field).parent().find('span');
            if(field.val().length < 5) {
                    jVal.errorname = true;
                       if(field.val().length > 0) {
                            namespan.removeClass('correct').addClass('error').html("can't be so short").show();
                            field.removeClass('correct').addClass('wrong');
                       }
            } else {
                    jVal.errorname = false;
                            namespan.removeClass('error').addClass('correct').html('ok').delay(2000).fadeOut('slow');
                            field.removeClass('wrong').addClass('correct');
            }
            if(field.val().length == 0) {
                            namespan.removeClass('correct error').html("How can i call you? <i>...don't leave me empty</i>").fadeIn("slow");
                            field.removeClass('correct wrong');
            }
        },	
        'emailK' : function() {
            var field = $('input[name="email"]');
            var emailspan = $(field).parent().find('span');
                var patt = /^.+@.+[.].{2,}$/i;//var patt = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
            if(!patt.test(field.val())) {
                    jVal.erroremail = true;
                            emailspan.removeClass('correct').html("write a valid email address").show();
                            field.removeClass('correct');
                        if (emailspan.hasClass('error')) { field.addClass('wrong'); }					
            } else {
                    jVal.erroremail = false;
                            emailspan.removeClass('error').addClass('correct').html("this looks like an email").show();
                            field.removeClass('wrong').addClass('correct');
            }
        },
        'emailB' : function() {
            var field = $('input[name="email"]');
            var emailspan = $(field).parent().find('span');
                var patt = /^.+@.+[.].{2,}$/i;//var patt = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;
            if(!patt.test(field.val())) {
                    jVal.erroremail = true;
                        if(field.val().length > 0) {
                            emailspan.removeClass('correct').addClass('error').html("this doesn't seem to be a valid email").show();
                            field.removeClass('correct').addClass('wrong');
                        }
            } else {
                    jVal.erroremail = false;
                            emailspan.removeClass('error').addClass('correct').html('ok').delay(2000).fadeOut('slow');
                            field.removeClass('wrong').addClass('correct');
            }
            if(field.val().length == 0) {
                            emailspan.removeClass('correct error').html("Where can I reply you? <i>...don't leave me empty</i>");
                            field.removeClass('correct wrong');
            }
        },       
        'subjectK' : function() {
            var field = $('input[name="subject"]');
            var subjectspan = $(field).parent().find('span');	
            if((field.val().length == 0)) {
                            subjectspan.removeClass('correct').html("What your request is about?");
                            field.removeClass('correct');
            }
            if((field.val().length > 0)) {
                            subjectspan.addClass('correct').html("it's not necessary, but it's good to know");
                            field.addClass('correct');
            if((field.val().length > 5)) {
                            subjectspan.addClass('correct').html("this sounds interesting...");
                            field.addClass('correct');
            } }
        },        
        'subjectB' : function() {
            var field = $('input[name="subject"]');
            var subjectspan = $(field).parent().find('span');		
            if((field.val().length > 0)) {
                            subjectspan.addClass('correct').html("ok").delay(2000).fadeOut('slow');
                            field.addClass('correct');
            } else {
                            subjectspan.removeClass('correct').html("What your request is about?");
                            field.removeClass('correct');
            }
        },
        'messageK' : function() {
            var field = $('textarea[name="message"]');
            var messagespan = $(field).parent().find('span');
            if(field.val().length < 75) {
                    jVal.errormessage = true;
                            messagespan.removeClass('correct').html('explain with much details as possible').show();
                            field.removeClass('correct');
                        if (messagespan.hasClass('error')) { field.addClass('wrong'); }
            } else {
                    jVal.errormessage = false;
                            messagespan.removeClass('error').addClass('correct').html('ok, keep it going').show();
                            field.removeClass('wrong').addClass('correct');
            }
        },
        'messageB' : function() {
            var field = $('textarea[name="message"]');
            var messagespan = $(field).parent().find('span');
            if(field.val().length < 75) {
                    jVal.errormessage = true;
                        if(field.val().length > 0) {
                            messagespan.removeClass('correct').addClass('error').html('come on, tell me a little bit more!').show();
                            field.removeClass('correct').addClass('wrong');
                        }
            } else {
                    jVal.errormessage = false;
                            messagespan.removeClass('error').addClass('correct').html('ok').show().delay(2000).fadeOut('slow');
                            field.removeClass('wrong').addClass('correct');
            }
            if(field.val().length == 0) {
                            messagespan.removeClass('correct error').html("Write every detail you want. <i>...don't leave me empty</i>");
                            field.removeClass('correct wrong');
            }
        }
    };
    $('input[name="name"]').keyup(jVal.nameK);
    $('input[name="name"]').blur(jVal.nameB);
    $('input[name="email"]').keyup(jVal.emailK);
    $('input[name="email"]').blur(jVal.emailB);
    $('input[name="subject"]').keyup(jVal.subjectK);
    $('input[name="subject"]').blur(jVal.subjectB);
    $('textarea[name="message"]').keypress(jVal.messageK);
    $('textarea[name="message"]').blur(jVal.messageB);

    $(':submit').addClass('disabled').prop('disabled', true).attr('value','Fill out all the fields');
    var jBut = function() { // activate the submit button only if there are no errors with the realtime validation  
        if (jVal.errorname == false && jVal.erroremail == false && jVal.errormessage == false) {
            $(':submit').removeClass('disabled').prop('disabled', false).attr('value','Fine, now send').css({'cursor':'pointer'}); }
        else { $(':submit').addClass('disabled').prop('disabled', true).attr('value','Fill out all the fields'); }
    }
    $(':input').focus(jBut);
    $(':input').keypress(jBut);
    $(':input').change(jBut);

    //Attach function to the 'submit' event of the form
    $("#contact").submit(function(e){
        e.preventDefault();
        $.post('contact_proc.php',$(this).serialize()+'&ajax=1',
            function(data){
                if(parseInt(data)==-1){
                } else {
                    $(".meta").html('you can still <a href="mailto:info@kunderikuus.net">send me an email</a> if you want ;)')
                    $("#contact").slideUp().after('<h3 class="success">Thank you!</h3><h4 class="success">I\'ll be back to you as soon as possible.</h4>');
                }
            }
        );
})
});//end Jquery