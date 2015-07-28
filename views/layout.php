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

    <link rel="stylesheet" href="<?= BASE; ?>asset/css/app.min.css?<?=filemtime(ROOT.'/asset/css/app.min.css'); ?>"/>
    <link rel="stylesheet" href="<?= BASE; ?>asset/css/theme-ios.min.css?<?=filemtime(ROOT.'/asset/css/theme-ios.min.css'); ?>"/>

    <script>
        window.baseURL = <?= BASE ?>;
    </script>
</head>
<body class="ui-loading">

    <?= $content; ?>

    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div>

            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter"></div>
                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
                <div class="pswp__caption"><div class="pswp__caption__center"></div></div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="<?= BASE; ?>asset/js/app.min.js?<?=filemtime(ROOT.'/asset/js/app.min.js'); ?>"></script>
</body>
</html>
