<?php

ini_set('display_errors', 1);

define('BASE', dirname($_SERVER['SCRIPT_NAME']).'/');

/*
 * Others
 */
define("DIR_IMAGE_FILE", "_image.jpg");

define('CACHE', dirname(__FILE__).'/cache');

$image_config = array(
	'path_images' => 'images',
	'path_images_root' => __DIR__,
	'path_cache' => 'cache',
	'presets' => array(
	    'small' => array( //exact size
	        array('action' => 'scale_and_crop', 'width' => 80, 'height' => 80)
	    ),
	    'big' => array( //fixed height
	        array('action' => 'scale', 'width' => 800, 'height' => 2000)
	    )
	)
);

define('GALLERY_ROOT', __DIR__ . '/images');
