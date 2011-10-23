<?php
    include('config.php');

    $end = explode('/', $_GET['q']);
    
    //get title
    $title = end($end);

    //get data
    $data = cache_get('GALLERY_FILES');
    if(!$data){
        $data = gal_prepare_list(GALLERY_ROOT);
        cache_set('GALLERY_FILES', $data, 0);
    }

    //get the current folder
    get_var('q', false);

    //limit to current folder
    $data = search($data, 'path', GALLERY_ROOT.'/'.$q);
    
?>
<div data-role="page">
    <div data-role="header"><h1><?php echo $title; ?></h1></div>
    <div data-role="content"><?php gal_render_list($data, false); ?></div>
</div>

