<?php

if (php_sapi_name() === 'cli-server') {
    // This file allows us to emulate Apache's "mod_rewrite"
    // functionality from the built-in PHP web server.
    $uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
        return false;
    }

    // When the built in server is used
    // the script name is the file called
    $_SERVER['SCRIPT_NAME'] = '/index.php';
}

include 'vendor/autoload.php';
include 'src/php/start.php';
