<?php
    include('config.php');
    
    $end = explode('/', $_GET['q']);

    $title = end($end);

    $book = gal_get_book($_GET['q']);

    natsort($book);

    if(!is_ajax()){
?>
<!DOCTYPE html>
<html>
    <head><?php render_header() ?></head>
    <body>
<?php } ?>
        
<div data-role="page" class="gallery-page">
    <div data-role="header">
        <?php if(array_key_exists("HTTP_REFERER", $_SERVER) && !empty($_SERVER["HTTP_REFERER"])){
            echo '<a href="'.$_SERVER["HTTP_REFERER"].'" data-icon="back" data-iconpos="notext">Retour</a>';
        } ?>
        
        <h1><?php echo $title; ?></h1>
        <a href="<?php echo BASE; ?>" data-icon="home" data-iconpos="notext">Home</a>
    </div>
    <div data-role="content">
        <ul class="gallery">
            <?php 
            $i = 0;
            
            foreach($book as $pages){
                echo '<li><a href="'.BASE.'big'.$pages.'" rel="external"><img src="'.BASE.'min'.$pages.'"/><span class="pn">'.$i.'</span></a></li>';
                $i++;
                
            } ?>
        </ul>

    </div>
</div>
        
<?php if(!is_ajax()){ ?>
    </body>
</html>
<?php } ?>

