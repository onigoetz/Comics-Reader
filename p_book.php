<?php
    include('config.php');
    
    $end = explode('/', $_GET['q']);

    $title = end($end);

    $book = gal_get_book($_GET['q']);

    natsort($book);

?> 

<div data-role="page" class="gallery-page">
    <div data-role="header">
        <h1><?php echo $title; ?></h1>
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