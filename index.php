<?php
include 'vendor/autoload.php';

include 'config.php';
include 'functions.php';


$app = new \Slim\Slim(array(
    'view' => new CustomView('layout.php'),
    'templates.path' => 'views',
));

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

$app->get(
    '/min/:image',
    function ($image) {
        $path = hash_decode($image);

        $thumb_file = "";
        if (THUMB_ROOT != "") {
            $thumb_file = THUMB_ROOT . $path;
        }

        $thumb_type = Image::type($thumb_file);
        if (!(file_exists($thumb_file) and $thumb_type)) {
            $img = new Image($path);
            list($width, $height) = $img->cropped_ratio_calculation(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

            $img->create_thumb($width, $height);
            $img->crop_thumb($width, $height, THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

            $img->write_file(THUMB_ROOT);
            $img->output();
            $img->destroy();
        }
    }
)->conditions(array('image' => '.*'));

$app->get(
    '/big/:image',
    function ($image) {
        $path = hash_decode($image);

        $thumb_file = "";
        if (BIG_ROOT != "") {
            $thumb_file = BIG_ROOT . $path;
        }

        $thumb_type = Image::type($thumb_file);
        if (!file_exists($thumb_file) and $thumb_type) {
            $img = new Image($path);
            list($width, $height) = $img->ratio_calculation(BIG_MAX_WIDTH, BIG_MAX_HEIGHT);
            $img->create_thumb($width, $height);

            $img->write_file(BIG_ROOT);
            $img->output();
            $img->destroy();
        }
    }
)->conditions(array('image' => '.*'));

$app->run();
