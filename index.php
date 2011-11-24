<?php
include('config.php');

$data = cache_get('GALLERY_FILES');
if(!$data){
    $data = gal_prepare_list(GALLERY_ROOT);
    cache_set('GALLERY_FILES', $data, 0);
}

?>
<!DOCTYPE html>
<html>
    <head><?php render_header() ?></head>
    <body>
        <div data-role="page" id="home">
            <div data-role="header"><h1>Comics Reader</h1></div>
            <div data-role="content"><?php gal_render_list($data); ?></div>
        </div>
    </body>
</html>