<div class="ui-page gallery-page">
    <div class="ui-header">
        <a onclick="window.history.back();" class="ui-btn ui-btn-left ui-corner-all ui-icon-back ui-btn-icon-notext">Back</a>
        <h1><?php echo $title; ?></h1>
		<a href="<?php echo url(); ?>" class="ui-btn ui-btn-right ui-corner-all ui-icon-home ui-btn-icon-notext">Home</a>
    </div>
    <div class=ui-content>
        <ol class="gallery">
            <?php
            foreach($book as $pages){
                echo '<li data-img="'. image_url('big', $pages) .'">';
                echo '<img class=lazy data-src="'. image_url('small', $pages) . '" width=60 height=75/>';
                echo '</li>';
            } ?>
        </ol>

    </div>
</div>
<div id="carousel">
	<ul></ul>
    <div class="close carousel-button"><i class=content></i></div>
	<div class=carousel-toolbar>
		<div class="close carousel-button"><i class=content></i></div>
		<div class="prev carousel-button"><i class=content></i></div>
		<div class="next carousel-button"><i class=content></i></div>
	</div>
</div>
