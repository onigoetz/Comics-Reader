<!DOCTYPE html>
<html>
<head>
	<title>Comics Reader</title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <link rel="apple-touch-icon" href="<?= BASE; ?>asset/images/apple-touch.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="<?= BASE; ?>asset/images/apple-touch-72.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="<?= BASE; ?>asset/images/apple-touch-114.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="<?= BASE; ?>asset/images/apple-touch-144.png"/>

    <link rel="stylesheet" href="<?= BASE; ?>asset/css/app.min.css"/>
    <link rel="stylesheet" href="<?= BASE; ?>asset/css/theme-ios.min.css"/>
</head>
<body class="ui-loading">
    <div id="content">
        <?= $content; ?>
    </div>
    <script type="text/javascript" src="<?= BASE; ?>asset/js/app.js"></script>
</body>
</html>
