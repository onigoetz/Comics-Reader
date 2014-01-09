<?php

ini_set('display_errors', 1);

define('BASE', dirname($_SERVER['SCRIPT_NAME']).'/');

/*
 * Gallery Directory
 */
define('GALLERY_ROOT', '/Volumes/Data/THE_DATA/Data/BD');

/*
 * Thumbs
 */
define("THUMB_ROOT", dirname(__FILE__)."/cache/MINI/");

define("THUMB_MAX_WIDTH", 80);
define("THUMB_MAX_HEIGHT", 80);


/*
 * Bigs
 */
define("BIG_ROOT", dirname(__FILE__)."/cache/BIG/");

define("BIG_MAX_WIDTH", 800);
define("BIG_MAX_HEIGHT", 2000);

/*
 * Others
 */
define("DIR_IMAGE_FILE", "_image.jpg");
define("ENLARGE_SMALL_IMAGES", FALSE);
define("JPEG_QUALITY", 75);

define('CACHE', dirname(__FILE__).'/cache/INTERNAL');
