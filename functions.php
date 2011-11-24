<?php

function gal_list_all($path = '.'){

    $directories = array();

    // Directories to ignore when listing output.
    $ignore = array( 'cgi-bin', '.', '..' );

    // Open the directory to the handle $dh
    $dh = @opendir( $path );
    
    // Loop through the directory
    while( false !== ( $file = readdir( $dh ) ) ){

        // Check that this file is not to be ignored
        if( !in_array( $file, $ignore ) ){

            // Its a directory, so we need to keep reading down...
            if( is_dir( "$path/$file" ) ){

                $dir = array(
                    'name' => $file,
                    'path' => "$path/$file",
                    'childs' => gal_list_all( "$path/$file"),
                    'thumb' => '',

                );
                $dir['count'] = count($dir['childs']);
                if($dir['count'] == 0){
                    $dir['type'] = 'tome';
                } else {
                    $dir['type'] = 'dir';
                }

                $directories[] = $dir;

            }
        }

    }

    closedir( $dh );

    return $directories;
    // Close the directory handle

}

function gal_prepare_list($folder = '.'){
    $list = gal_list_all($folder);

    $list = gal_first_images($list);
    return $list;
}

function gal_first_images($folder){
    foreach($folder as $key =>$subfolder){
        $folder[$key]['url_path'] = str_replace(GALLERY_ROOT.'/','',$subfolder['path']);
        $folder[$key]['thumb'] = str_replace(GALLERY_ROOT.'/','',gal_first_image($subfolder));
        $folder[$key]['childs'] = gal_first_images($subfolder['childs']);
    }

    return $folder;
}

function gal_first_image(&$folder) {
    if ($folder['type'] == 'tome') {
        $image_extensions_allowed = array('jpg', 'jpeg', 'png', 'gif','bmp');

        $handle = opendir($folder['path']);
        if ($handle) {
            while (false !== ($file = readdir($handle))) {
                $ext = strtolower(substr(strrchr($file, "."), 1));

                if ($file != "." && $file != ".." && $file != "thumbs" && $file != ".DS_Store" &&  strpos($file, '._') === false) {
                    //echo $file;
                    if(in_array($ext, $image_extensions_allowed))
                    {
                        //got it, close dir and go back
                        return $folder['path'].'/'.$file;
                    }
                }
            }
            closedir($handle);
        } else {
            return false;
        }


        
    } else {
        foreach ($folder['childs'] as $subfolder) {
            $subresult = gal_first_image($subfolder);
            if ($subresult) {
                return $subresult;
            }
        }
    }
}

function gal_render_list($data, $filter = true){

    foreach ($data as $key => $row) {
        $names[$key]  = ucfirst($row['name']);
    }
    array_multisort($names, SORT_ASC, $data);
    
    $current_letter = '';

    if(count($data)){
        if($filter){
            echo '<ul data-role="listview" data-filter="true">';
        } else {
            echo '<ul data-role="listview">';
        }
        foreach($data as $folder){
            $first_letter = strtoupper($folder['name'][0]);

            if(is_numeric($first_letter)){
                $first_letter = '#';
            }

            if($first_letter != $current_letter){
                $current_letter = $first_letter;
                echo '<li data-role="list-divider">'.$current_letter.'</li>';
            }

            echo '<li>';

            if($folder['type'] == 'tome'){
                echo '<img src="'.BASE.'min/'.$folder['thumb'].'" />';
                echo '<h3><a href="'.BASE.'b/'.$folder['url_path'].'">'.$folder['name'].'</a></h3>';
            } else {
                if(!count($folder['childs'])){
                    echo '<h3>'.$folder['name'].'</h3>';
                    echo '<p>PDF : ne fonctionne pas pour le moment';

                } else {
                    //echo $folder['name'];
                    echo '<img src="'.BASE.'min/'.$folder['thumb'].'" />';
                    echo '<h3><a href="'.BASE.'l/'.$folder['url_path'].'">'.$folder['name'].'</a></h3>';
                    echo '<p>'.count($folder['childs']).' Tomes</p>';
                }
            }

            echo '</li>';
        }

        echo '</ul>';

    }
}


function gal_image_bigatures($path, $return=false) {
    if (BIG_ROOT != "") {
        $thumb_file = BIG_ROOT . $path;
    } else {
        $thumb_file = "";
    }

    $thumb_type = gal_image_type($thumb_file);
    if (!file_exists($thumb_file) and $thumb_type) {
        $img = new Image_Manager($path);
        list($width, $height) = $img->ratio_calculation(BIG_MAX_WIDTH, BIG_MAX_HEIGHT);
        $img->create_thumb($width, $height);

        $img->write_file(BIG_ROOT);

        if ($return) {
            $img->output();
        }

        $img->destroy();
    }
    
    header("Content-type: image/" . $thumb_type);
    readfile($thumb_file);
    exit;
}

function gal_image_miniatures($path, $return=false) {
    if (THUMB_ROOT != "") {
        $thumb_file = THUMB_ROOT . $path;
    } else {
        $thumb_file = "";
    }


    $thumb_type = gal_image_type($thumb_file);
    if (!(file_exists($thumb_file) and $thumb_type)) {
        $img = new Image_Manager($path);
        list($width, $height) = $img->cropped_ratio_calculation(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

        $img->create_thumb($width, $height);
        $img->crop_thumb($width, $height, THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT);

        $img->write_file(THUMB_ROOT);

        if ($return) {
            $img->output();
        }

        $img->destroy();
    }

    header("Content-type: image/" . $thumb_type);
    readfile($thumb_file);
    exit;
}

function gal_image_type($file) {
    $type = strtolower(substr($file, strrpos($file, ".")));
    if (($type == ".jpg") or ($type == ".jpeg")) {
        return "jpeg";
    } elseif ($type == ".png") {
        return "png";
    } elseif ($type == ".gif") {
        return "gif";
    }
    return FALSE;
}

function gal_dir_make($dir_path) {
    $dir_path = str_replace('//', '/', $dir_path);


    $len = strlen($dir_path);
    if ($dir_path[$len - 1] == '/') {
        $dir_path = substr($dir_path, 0, -1);
    }

    if (!is_dir($dir_path)) {
        mkdir($dir_path, 0777, true);
    }
}

function gal_get_book($book){
    $pages = array();

    $path = GALLERY_ROOT.'/'.$book ;

    // Open the directory to the handle $dh
    $dh = @opendir( $path);

    // Loop through the directory
    while( false !== ( $file = readdir( $dh ) ) ){
        $ext = strtolower(substr(strrchr($file, "."), 1));
        
        // Check that this file is not to be ignored
        if (!is_dir( "$path/$file" ) && $file != "." && $file != ".." && $file != "thumbs" && $file != ".DS_Store" &&  strpos($file, '._') === false) {

            //$pages[] = str_replace(GALLERY_ROOT, BASE.'big', "$path/$file");
            $pages[] = str_replace(GALLERY_ROOT, '', "$path/$file");
            
        }

    }

    closedir( $dh );

    return $pages;
}

function get_var($var, $default='')
{
    global $$var;
    if(isset($_GET[$var])){
            $$var = $_GET[$var];
    } else {
            $$var = $default;
    }
}


function gal_dir_name($file)
{
    if(is_dir(BIG_ROOT . $file)){
        return $file.'/';
    } else {
        $array = explode('/', $file);
        array_splice($array, -1, 1);
        return implode('/', $array).'/';
    }
}

function search($array, $key, $value)
{
    $results = array();

    if (is_array($array))
    {
        if (array_key_exists($key, $array) && $array[$key] == $value){
            return $array['childs'];
        }

        foreach ($array as $subarray){
            $res = search($subarray, $key, $value);
            if(is_array($res)){
                return $res;
            }
        }
    }

    return false;
}

function render_header(){
    echo '        
        <link rel="stylesheet" href="'.BASE.'css/jquery.mobile-1.0.min.css" />
        <link rel="stylesheet" href="'.BASE.'css/photoswipe.css" />
        <link rel="stylesheet" href="'.BASE.'css/specific.css" />
        <script type="text/javascript" src="'.BASE.'js/jquery-1.6.4.min.js"></script>
        <script type="text/javascript" src="'.BASE.'js/jquery.mobile-1.0.min.js"></script>
        <script type="text/javascript" src="'.BASE.'js/klass.min.js"></script>
        <script type="text/javascript" src="'.BASE.'js/code.photoswipe.jquery-3.0.4.min.js"></script>
        
	<script type="text/javascript">
		
		/*
		 * IMPORTANT!!!
		 * REMEMBER TO ADD  rel="external"  to your anchor tags. 
		 * If you dont this will mess with how jQuery Mobile works
		 */
		
		(function(window, $, PhotoSwipe){
			
			$(document).ready(function(){
				
				$("div.gallery-page")
					.live("pageshow", function(e){
						
						var 
							currentPage = $(e.target),
							options = {},
							photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr("id"));
							
						return true;
						
					})
					
					.live("pagehide", function(e){
						var photoSwipeInstance = PhotoSwipe.instances[0];
                                                
						if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                                                        if(photoSwipeInstance.documentOverlay){
                                                            photoSwipeInstance.hide();
                                                        }
                                                        PhotoSwipe.detatch(photoSwipeInstance);
						}
						
						return true;
						
					});
                                       
                                        //if its on the first page
                                        if($("div.gallery-page ul.gallery a").size()){
                                            $("div.gallery-page ul.gallery a").photoSwipe({});
                                        }
				
			});
		
		}(window, window.jQuery, window.Code.PhotoSwipe));
		
	</script>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
}

/**
 * Check if the page was called by ajax or not
 *
 * @return bool
 */
function is_ajax() {
    static $is_ajax;

    if (!isset($is_ajax)) {
        $is_ajax = (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest");
    }

    if ($is_ajax) {
        return true;
    } else {
        return false;
    }
}
