<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">-->
    <!--<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">-->
    <!--
      Notice the use of %PUBLIC_URL% in the tag above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <link rel="apple-touch-icon" href="<?= BASE; ?>asset/images/apple-touch.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="<?= BASE; ?>asset/images/apple-touch-72.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="<?= BASE; ?>asset/images/apple-touch-114.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="<?= BASE; ?>asset/images/apple-touch-144.png"/>

    <link rel="stylesheet" href="<?= BASE . asset('main.css'); ?>"/>

    <script>
        window.baseURL = "<?= BASE; ?>";
    </script>
</head>
<body>
<div id="root"></div>

<script type="text/javascript" src="<?= BASE . asset('main.js'); ?>"></script>

</body>
</html>
