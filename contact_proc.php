<?php 
    $admin_mail = 'info@kunderikuus.net';
    $datereceive = ' on '.date('l, F jS Y, g:i a').' wrote:';
    $datesend = 'on '.date('l, F jS Y, g:i a').', you wrote me:';

    session_name("contactK6");
    session_start();

    foreach($_POST as $k=>$v) {
	if(ini_get('magic_quotes_gpc'))
	$_POST[$k]=stripslashes($_POST[$k]);
	$_POST[$k]=htmlspecialchars(strip_tags($_POST[$k]));
    }

    $err = array();

    if(!checkLen('name'))
	$err[]='Your name isn\'t filled out correctly.';
    if(!checkLen('email'))
	$err[]='The email field is too short or empty!';
    else if(!checkEmail($_POST['email']))
	$err[]='You should provide a valid email.';
    if(!checkLen('message'))
	$err[]='You can\'t send a blank message.';

    if(count($err)) {
	if($_POST['ajax']) {
            echo '-1';
	}
        else if($_SERVER['HTTP_REFERER']) {
		$_SESSION['errStr'] = implode('<br />',$err);
		$_SESSION['post']=$_POST;		
		header('Location: '.$_SERVER['HTTP_REFERER']);
	}
	exit;
    }
    if ($_POST['copy'] == "y") {
         $copyed = '*a copy of this message was sent to '.$_POST['name'];
         $c_subject = '[Contact] '.$_POST['subject'];
         $c_message = 'Hi '.$_POST['name']."!\n".$datesend."\n\n".$_POST['message']."\n\n\n".'*** If you forgot, or want to to add something you can directly reply to this email ***'."\n\n".'Thanks,'."\n\n-- \nAlessandro Sansottera | web: http://kunderikuus.net | mail: ".$admin_mail;
         $c_headers = 'From: kunderikuus <'.$admin_mail.'>'."\r\n";
         $c_headers .= 'Reply-To: '.$admin_mail."\r\n".'X-Mailer: PHP/'.phpversion();
         mail($_POST['email'], $c_subject, $c_message, $c_headers);
    } else { $copyed = ''; }


        $subject = '[Contact] '.$_POST['subject'];
        $message = $_POST['name'].$datereceive."\n\n".$_POST['message']."\n\n".$copyed;
        $headers = 'From: '.$_POST['name'].' <'.$_POST['email'].'>'."\r\n";
        $headers .= 'Reply-To: '.$_POST['email']."\r\n".'X-Mailer: PHP/'.phpversion();
        mail($admin_mail, $subject, $message, $headers);

    unset($_SESSION['post']);
    if($_POST['ajax']) {
	echo '1';
    }
    else {
	$_SESSION['sent']=1;
	if($_SERVER['HTTP_REFERER'])
		header('Location: '.$_SERVER['HTTP_REFERER']);
	exit;
    }

    function checkLen($str,$len=2) {
	return isset($_POST[$str]) && mb_strlen(strip_tags($_POST[$str]),"utf-8") > $len;
    }

    function checkEmail($str) {
	return preg_match("/^[-_a-z0-9\'+*$^&%=~!?{}]++(?:\.[-_a-z0-9\'+*$^&%=~!?{}]+)*+@(?:(?![-.])[-a-z0-9.]+(?<![-.])\.[a-z]{2,6}|\d{1,3}(?:\.\d{1,3}){3})(?::\d++)?$/iD", $str);
    }
?>