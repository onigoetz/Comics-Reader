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

    if(!is_ajax()){
?>
<!DOCTYPE html>
<html>
    <head><?php render_header() ?></head>
    <body>
<?php } ?>
<div data-role="page">
    <div data-role="header">
        <?php if(array_key_exists("HTTP_REFERER", $_SERVER) && !empty($_SERVER["HTTP_REFERER"])){
            echo '<a href="'.$_SERVER["HTTP_REFERER"].'" data-icon="back" data-iconpos="notext">Retour</a>';
        } ?>
        
        <h1><?php echo $title; ?></h1>
        <a href="<?php echo BASE; ?>" data-icon="home" data-iconpos="notext">Home</a>
    </div>
    <div data-role="content"><?php gal_render_list($data, false); ?></div>
</div>
        
<?php if(!is_ajax()){ ?>
    </body>
</html>
<?php } ?>