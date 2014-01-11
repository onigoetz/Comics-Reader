<!DOCTYPE html>
<html>
<head>
	
	<title>Comics Reader</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
	
    <link rel="apple-touch-icon" href="<?php echo BASE; ?>asset/images/apple-touch.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo BASE; ?>asset/images/apple-touch-72.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo BASE; ?>asset/images/apple-touch-114.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo BASE; ?>asset/images/apple-touch-144.png"/>

    <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/jquery.mobile-1.4.0.css"/>
    <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/photoswipe.css"/>
    <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/specific.css"/>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/klass.min.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/code.photoswipe.jquery-3.0.4.min.js"></script>

    <script type="text/javascript">

        /*
         * IMPORTANT!!!
         * REMEMBER TO ADD  rel="external"  to your anchor tags.
         * If you dont this will mess with how jQuery Mobile works
         */

        (function (window, $, PhotoSwipe) {

            $(document).ready(function () {

                $(document)
                    .on("pagecontainershow", function (e, ui) {

                        var currentPage = $.mobile.activePage.first();
                        if (currentPage.hasClass("gallery-page")) {
                            var photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe({}, currentPage.attr("id"));
                        }

                        return true;
                    })

                    .on("pagehide", function (e, ui) {
                        var photoSwipeInstance = PhotoSwipe.instances[0];

                        if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                            if (photoSwipeInstance.documentOverlay) {
                                photoSwipeInstance.hide();
                            }
                            PhotoSwipe.detatch(photoSwipeInstance);
                        }

                        return true;
                    });

                //if its on the first page
                if ($("div.gallery-page ul.gallery a").size()) {
                    $("div.gallery-page ul.gallery a").photoSwipe({});
                }

            });

        }(window, window.jQuery, window.Code.PhotoSwipe));

    </script>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>
	<?php echo $content; ?>
</body>
</html>
