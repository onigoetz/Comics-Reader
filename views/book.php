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
                echo '<li>';
                echo '<a href="'. image_url('big', $pages) . '"><img src="'. image_url('small', $pages) . '"/><span class="pn">'.$i.'</span></a>';
                echo '</li>';
                $i++;
            } ?>
        </ul>

    </div>
</div>
        