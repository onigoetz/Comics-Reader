<?php
include 'vendor/autoload.php';

include 'config.php';
include 'functions.php';


$app = new \Slim\Slim(array(
    'view' => new CustomView('layout.php'),
    'templates.path' => 'views',
));

Onigoetz\Imagecache\Support\Slim\ImagecacheRegister::register($app, $image_config);

$app->container->singleton(
    'cache',
    function () {
        return new Cache();
    }
);

$app->get(
    '/',
    function () use ($app) {

        $data = cache_get('GALLERY_FILES');
        if (!$data) {
            $data = gal_prepare_list(GALLERY_ROOT);
            cache_set('GALLERY_FILES', $data, 0);
        }

        return $app->render('index.php', array('data' => $data));
    }
);

$app->get(
    '/list/:list',
    function ($query) use ($app) {

        //get data
        $data = $app->cache->fetch('GALLERY_FILES');
        if (!$data) {
            $data = gal_prepare_list(GALLERY_ROOT);
            cache_set('GALLERY_FILES', $data, 0);
        }

        //limit to current folder
        $data = search($data, 'path', GALLERY_ROOT . '/' . $query);

        $end = explode('/', $query);
        return $app->render('list.php', array('title' => end($end), 'data' => $data));
    }
)->conditions(array('list' => '.*'));

$app->get(
    '/book/:book',
    function ($book) use ($app) {
        //Get the pages
        $pages = array();
        $path = GALLERY_ROOT . '/' . $book;

        // Open the directory to the handle $dh
        $dh = @opendir($path);

        // Loop through the directory
        while (false !== ($file = readdir($dh))) {
            // Check that this file is not to be ignored
            if (!is_dir(
                    "$path/$file"
                ) && $file != "." && $file != ".." && $file != "thumbs" && $file != ".DS_Store" && strpos(
                    $file,
                    '._'
                ) === false
            ) {
                $pages[] = str_replace(GALLERY_ROOT, '', "$path/$file");
            }
        }
        closedir($dh);
        natsort($pages);

        $end = explode('/', $book);
        return $app->render('book.php', array('title' => end($end), 'book' => $pages));
    }
)->conditions(array('book' => '.*'));

$app->run();
