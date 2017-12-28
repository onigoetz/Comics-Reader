<?php

ini_set('display_errors', 1);

$basedir = str_replace('//', '/', dirname($_SERVER['SCRIPT_NAME']) . '/');
if (array_key_exists('HTTP_X_COMICS_BASE', $_SERVER)) {
    $basedir = rtrim($_SERVER['HTTP_X_COMICS_BASE'], '/') . '/';
}

define('BASE', $basedir);

/*
 * Others
 */
define('GALLERY_ROOT', '/comics');
define('BIG_WIDTH', 800);

$image_config = array(
    'path_web' => 'images',
    'path_local' => GALLERY_ROOT,
    'path_cache' => 'cache',
    'presets' => array(
        'small' => array(
            array('action' => 'scale', 'height' => 75)
        ),
        'big' => array(
            array('action' => 'scale', 'width' => BIG_WIDTH)
        )
    )
);

define('CACHE', $image_config['path_local'] . '/' . $image_config['path_cache']);
