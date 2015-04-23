<?php
session_name("contactK6");
session_start();
$str = '';
if ($_SESSION['errStr']) {
    $str = '<div class="error">' . $_SESSION['errStr'] . '</div>';
    unset($_SESSION['errStr']);
}
$success = '';
if ($_SESSION['sent']) {
    $css = '<style>#contact{display:none !important;}</style>';
    $success = '<h3 class="success">Thank you!</h3><h4 class="success">I\'ll be back to you as soon as possible.</h4>';
    unset($_SESSION['sent']);
}
?>
<?php
$namespan = 'How can i call you?';
$emailspan = 'Where can I reply you?';
$subjectspan = 'What your request is about?';
$messagespan = 'Write every detail you want';
$empty = "<i>..." . "don't leave me empty" . "</i>";
?>
<!DOCTYPE html>
<html dir="ltr" lang="en">
    <head>
        <meta charset="UTF-8">
        <title>contact | KunderiKuus | A cut along the web - Portfolio of Alessandro Sansottera</title>
        <meta name="description" content="Portfolio of Alessandro Sansottera, web designer and developer based in Amsterdam. Available for hiring." />
        <meta name="keywords" content="kunderikuus, kunderi, kuus, webdesign, web design, responsive design, mobile first, web standard, graphic design, wordpress, html5, javascript, jquery, css3, Amsterdam, custom made websites, cutting edge, cut-up" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <meta name="HandheldFriendly" content="true">
        <meta name="MobileOptimized" content="width">
        <link rel="apple-touch-icon" href="css/img/icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="css/img/icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="css/img/icon-iphone4.png" />
        <link rel="shortcut icon" type="image/x-icon" href="css/img/favicon.ico">
        <link href="css/style.v1.1.min.css" rel="stylesheet" media="screen">
    </head>
    <body>
        <aside id="resume">web design graphic front end development responsive design clean mobile first accessibility semantic html 5 css 3 javascript jquery canvas</aside>
        <a href="/" title="home"><img src="css/img/logo.png" title="Back Home" /></a>
        <nav id="nav">
            <ul><li><a href="who">Who?<small>To cut a long story short</small></a></li>
                <li><a href="what">What?<small>Cutting edge design</small></a></li>
                <li><a href="how">How?<small>A cut above</small></a></li>
                <li><a href="like">Like...<small>Past cut-ups</small></a></li>
                <li><a href="" class="h">Contact<small class="h">Don't cut myself out</small></a></li>
            </ul>
        </nav>
        <header id="header"><h1 id="title">kunderikuus</h1><h2 id="subtitle">A CUT ALONG THE WEB</h2></header>
        <section id="page" class="no-js">
            <header class="title"><h2>Don't cut myself out</h2></header>
            <article class="content">
                <figure class="image"><img src="css/img/contact.png" alt="" /></figure>
                <div class="text">
                    <h3><a href="http://www.linkedin.com/in/kunderikuus" target="blank">Linkedin account</a></h3>
                    <p><br />If you are contacting me because you think we could work together on your next project please include as many details as possible, i.e. what you want me to do, timeline, budget, etc.
                    <br />Instead, if your ideas are still blurred and fuzzy, you can skip these details and let the imagination go.
                    <br />Anyway it's always nice to get some feedback so I'll be happy to read whatever you have to say, just don't write me only <i>"fddasfda [...]"</i> to see if the form works...
                    <br />...it works, I swear! Yes developer, I'm talking to you. 
                    <br /><br />While my presence on social network is quite invisible (you weren't aksing yourself where is the g+/facebook/twitter* account link, were you?) I read my mail daily, so you'll probably quickly receive an answer.
                    <br /><br /><i>*actually I have a twitter account, but I still have to start tweeting.</i></p>
                    <form action="contact_proc.php" method="post" id="contact">
                        <label><?php echo 'Name:'; ?><span><?php echo $namespan; ?></span><input type="text" name="name" placeholder="<?php echo 'Pinko Panzio'; ?>" autofocus value="<?=$_SESSION['post']['name']?>"/></label>
                        <label><?php echo 'E-mail:'; ?><span><?php echo $emailspan; ?></span><input type="email" name="email" placeholder="<?php echo 'casella@nongiucas.it'; ?>" value="<?= $_SESSION['post']['email'] ?>"/></label>
                        <label><?php echo 'Subject:'; ?><span><?php echo $subjectspan; ?></span><input type="text" name="subject" placeholder="<?php echo "I want you make me a website"; ?>" class="subject" value="<?= $_SESSION['post']['subject'] ?>"/></label>
                        <label><?php echo 'Message:'; ?><span><?php echo $messagespan; ?></span><textarea name="message" id="message" placeholder="<?php echo "i' d like that this could be..."; ?>" ><?= $_SESSION['post']['message'] ?></textarea></label>
                        <label><?php echo 'Selfcopy:'; ?><span><?php echo "Do you want to receive a copy of this message?"; ?></span><input type="checkbox" name="copy" value="y" /></label>
                        <input type="hidden" name="contact" value="1"/><input type="checkbox" name="accept" style="display:none" value="1"/>
                        <input type="submit" value="Send"/>
                     <?=$str?>
                    </form>
                    <?=$success?>
                </div>
            </article>
            <footer class="meta">or skip this stuff and just <a href="mailto:info@kunderikuus.net">send me an email</a></footer>
        </section>
        <footer id="info">
            <a id="back" style="display:block" href="#">Top</a>
            <h5>Portfolio of Alessandro Sansottera | web designer and developer <br />Copyright &copy; 2012</h5>
        </footer>
    </body>
</html>
<!--
website hosted by <a href="http://www.greengeeks.com" target="blank">GreenGeeks</a>
<a href="http://www.linkedin.com/in/kunderikuus" target="blank">Linkedin</a>,
<a href="http://twitter.com/kunderi6" target="blank">Twitter</a>, 
<a href="http://jsdo.it/kunderi6" target="blank">jsdo.it</a>, 
<a href="http://jsfiddle.net/user/kunderi6" target="blank">jsfiddle</a>.-->