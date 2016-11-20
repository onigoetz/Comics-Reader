<?php

// Configure
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/config.php';

// Helpers
// ---------------------------------------------------------------------------------------------------------------------

function standardize_unicode($link) {
    $replace = [
        urldecode("%C3%A8") => urldecode("e%CC%80"), //è
        urldecode("%C3%A9") => urldecode("e%CC%81"), //é
        urldecode("%C3%B4") => urldecode("o%CC%82"), //ô
        urldecode("%C3%A0") => urldecode("a%CC%80"), //à
        urldecode("%C3%89") => urldecode("E%CC%81"), //É
        urldecode("%C3%BB") => urldecode("u%CC%82"), //û
    ];

    return strtr($link, $replace);
}

// Create application
// ---------------------------------------------------------------------------------------------------------------------

$container = new \Slim\Container;

$container['cache'] = function () {
    return new Cache();
};

$app = new \Slim\App($container);


// Add Imagecache
// ---------------------------------------------------------------------------------------------------------------------
Onigoetz\Imagecache\Support\Slim\ImagecacheRegister::register($app, $image_config);

// Init Routes
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/routes.php';


// Run
// ---------------------------------------------------------------------------------------------------------------------
$app->run();
