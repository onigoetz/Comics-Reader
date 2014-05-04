<div class="ui-page">
    <div class="ui-header">
        <a onclick="window.history.back();" class="ui-btn ui-btn-left ui-corner-all ui-icon-back ui-btn-icon-notext">Back</a>
        <h1><?php echo $title; ?></h1>
        <a href="<?php echo url(); ?>" class="ui-btn ui-btn-right ui-corner-all ui-icon-home ui-btn-icon-notext">Home</a>
    </div>
    <div class="ui-content"><?php gal_render_list($data); ?></div>
</div>
