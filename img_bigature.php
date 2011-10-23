<?php
include('config.php');

get_var('q', false);

if($q){
    gal_image_bigatures($q);
}
