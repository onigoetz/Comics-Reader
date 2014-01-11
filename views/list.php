<div class="ui-page ui-page-theme-b ui-page-active">
    <div class="ui-header ui-bar-inherit">
        <?php if(array_key_exists("HTTP_REFERER", $_SERVER) && !empty($_SERVER["HTTP_REFERER"])){
			//TODO :: change to parent folder or search source
            echo '<a href="'.$_SERVER["HTTP_REFERER"].'" class="ui-btn ui-btn-left ui-corner-all ui-icon-back ui-btn-icon-notext">Retour</a>';
        } ?>
        
        <h1><?php echo $title; ?></h1>
        <a href="<?php echo url(); ?>" class="ui-btn ui-btn-right ui-corner-all ui-icon-home ui-btn-icon-notext">Home</a>
    </div>
    <div class="ui-content"><?php gal_render_list($data); ?></div>
</div>