<?php

// Configure
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/config.php';
include __DIR__ . '/functions.php';

// Create application
// ---------------------------------------------------------------------------------------------------------------------

$container = new \Slim\Container;

$container['cache'] = function () {
    return new Cache();
};

$app = new \Slim\App($container);


// Add Imagecache
// ---------------------------------------------------------------------------------------------------------------------
$app->getContainer()['imagecache'] = function () use ($image_config) {
    return new ImagecacheManager($image_config);
};

$app->get(
    "/{$image_config['path_web']}/{$image_config['path_cache']}/{preset}/{file:.*}",
    (new Onigoetz\Imagecache\Support\Slim\ImagecacheRegister)->request()
)
    ->setName('onigoetz.imagecache');

// Init Routes
// ---------------------------------------------------------------------------------------------------------------------
include __DIR__ . '/routes.php';


// Run
// ---------------------------------------------------------------------------------------------------------------------
$app->run();
