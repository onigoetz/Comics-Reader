<?php

ini_set('display_errors', 1);

define('BASE', str_replace('//', '/', dirname($_SERVER['SCRIPT_NAME']) . '/'));

/*
 * Others
 */
define('DIR_IMAGE_FILE', '_image.jpg');

define('ROOT', dirname(dirname(__DIR__)));
define('GALLERY_ROOT', '/comicsReaderImages');
define('BIG_WIDTH', 800);

$image_config = array(
    'path_web' => 'images',
    'path_local' => GALLERY_ROOT,
    'path_cache' => 'cache',
    'presets' => array(
        'small' => array( //exact size
            array('action' => 'scale', 'width' => 200)
        ),
        'big' => array( //fixed height
            array('action' => 'scale', 'width' => BIG_WIDTH)
        )
    )
);

define('CACHE', $image_config['path_local'] . '/' . $image_config['path_cache']);
