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