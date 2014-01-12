<!DOCTYPE html>
<html>
<head>
	
	<title>Comics Reader</title>
	
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
	
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
	
    <link rel="apple-touch-icon" href="<?php echo BASE; ?>asset/images/apple-touch.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo BASE; ?>asset/images/apple-touch-72.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo BASE; ?>asset/images/apple-touch-114.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo BASE; ?>asset/images/apple-touch-144.png"/>

    <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/jquery.mobile-1.4.0.css"/>
    <link rel="stylesheet" href="<?php echo BASE; ?>asset/css/specific.css"/>
	
	<script type="text/javascript" src="<?php echo BASE; ?>asset/js/modernizr-2.7.1.min.js"></script>  
</head>
<body class="ui-loading">
    <div class=ui-loader-overlay>
        <div class="ui-loader">
            <div class="ui-icon-loading"></div>
            <p>Loading...</p>
        </div>
    </div>

    <div id="content">
        <?php echo $content; ?>
    </div>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/zepto-1.1.2.min.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/zepto.plugins-1.1.2.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/hammer-1.0.6.min.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/helpers.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/jquery.unveil.js"></script>   
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/carousel/carousel-map.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/carousel/carousel-pane.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/carousel/carousel.js"></script>
    <script type="text/javascript" src="<?php echo BASE; ?>asset/js/site.js"></script>
</body>
</html>
