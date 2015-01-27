<?php

ini_set('display_errors', 1);

define('BASE', str_replace('//', '/', dirname($_SERVER['SCRIPT_NAME']) . '/'));

/*
 * Others
 */
define('DIR_IMAGE_FILE', '_image.jpg');

define('ROOT', dirname(dirname(__DIR__)));
define('CACHE', ROOT . '/cache');
define('GALLERY_ROOT', ROOT . '/images');
define('BIG_WIDTH', 800);

$image_config = array(
    'path_images' => 'images',
    'path_images_root' => ROOT,
    'path_cache' => 'cache',
    'presets' => array(
        'small' => array( //exact size
            array('action' => 'scale_and_crop', 'width' => 60, 'height' => 75)
        ),
        'big' => array( //fixed height
            array('action' => 'scale', 'width' => BIG_WIDTH)
        )
    )
);
