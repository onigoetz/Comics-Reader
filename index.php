<?php
include('config.php');

if(!is_ajax()){
    layout('layout.php');
}

dispatch('/', function(){
    
    $data = cache_get('GALLERY_FILES');
    if(!$data){
        $data = gal_prepare_list(GALLERY_ROOT);
        cache_set('GALLERY_FILES', $data, 0);
    }
    set('data', $data);

    return render('index.php');
});

dispatch(array('/list/**', array('list')), function(){
    $query = params('list');
    
    $end = explode('/', $query);
    
    //get title
    set('title', end($end));

    //get data
    $data = cache_get('GALLERY_FILES');
    if(!$data){
        $data = gal_prepare_list(GALLERY_ROOT);
        cache_set('GALLERY_FILES', $data, 0);
    }

    //limit to current folder
    $data = search($data, 'path', GALLERY_ROOT.'/'.$query);
    set('data', $data);
    
    return render('list.php');
});

dispatch(array('/book/**', array('book')), function(){
    $book = params('book');
    
    $end = explode('/', $book);
    set('title', end($end));
    
    echo 'nice';
    
    //Get the pages
    $pages = array();
    $path = GALLERY_ROOT.'/'.$book ;

    // Open the directory to the handle $dh
    $dh = @opendir( $path);

    // Loop through the directory
    while( false !== ( $file = readdir( $dh ) ) ){
        // Check that this file is not to be ignored
        if (!is_dir( "$path/$file" ) && $file != "." && $file != ".." && $file != "thumbs" && $file != ".DS_Store" &&  strpos($file, '._') === false) {
            $pages[] = str_replace(GALLERY_ROOT, '', "$path/$file");
        }
    }
    closedir( $dh );
    natsort($pages);
    
    set('book', $pages);
    
    return render('book.php');
});

dispatch(array('/min/**', array('image')), function(){
    $path = hash_decode(params('image'));
    
    if (THUMB_ROOT != "") {
        $thumb_file = THUMB_ROOT . $path;
    } else {
        $thumb_file = "";
    }

    $thumb_type = gal_image_type($thumb_file);
    if (!(file_exists($thumb_file) and $thumb_type)) {
        $img = new Image_Manager($path);
        list($width, $height) = $img->cropped_ratio_calculation(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

        $img->create_thumb($width, $height);
        $img->crop_thumb($width, $height, THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

        $img->write_file(THUMB_ROOT);

        //if ($return) {
            $img->output();
        //}

        $img->destroy();
    }

    header("Content-type: image/" . $thumb_type);
    readfile($thumb_file);
    exit;
});

dispatch(array('/big/**', array('image')), function(){
    $path = hash_decode(params('image'));
    
    if (BIG_ROOT != "") {
        $thumb_file = BIG_ROOT . $path;
    } else {
        $thumb_file = "";
    }

    $thumb_type = gal_image_type($thumb_file);
    if (!file_exists($thumb_file) and $thumb_type) {
        $img = new Image_Manager($path);
        list($width, $height) = $img->ratio_calculation(BIG_MAX_WIDTH, BIG_MAX_HEIGHT);
        $img->create_thumb($width, $height);

        $img->write_file(BIG_ROOT);

        //if ($return) {
            $img->output();
        //}

        $img->destroy();
    }
    
    header("Content-type: image/" . $thumb_type);
    readfile($thumb_file);
    exit;
});

run();