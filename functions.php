<?php

function gal_list_all($path = '.') {

    $directories = array();

    // Directories to ignore when listing output.
    $ignore = array('cgi-bin', '.', '..', 'cache');

    // Open the directory to the handle $dh
    $dh = @opendir($path);

    // Loop through the directory
    while (false !== ( $file = readdir($dh) )) {

        // Check that this file is not to be ignored
        if (!in_array($file, $ignore)) {

            // Its a directory, so we need to keep reading down...
            if (is_dir("$path/$file")) {

                $dir = array(
                    'name' => $file,
                    'path' => "$path/$file",
                    'childs' => gal_list_all("$path/$file"),
                    'thumb' => '',
                );
                $dir['count'] = count($dir['childs']);
                if ($dir['count'] == 0) {
                    $dir['type'] = 'tome';
                } else {
                    $dir['type'] = 'dir';
                }

                $directories[] = $dir;
            }
        }
    }

    closedir($dh);
    return $directories;
}

function gal_prepare_list($folder = '.') {
    $list = gal_list_all($folder);
    $list = gal_first_images($list);
    return $list;
}

function gal_first_images($folder) {
    foreach ($folder as $key => $subfolder) {
        $folder[$key]['url_path'] = str_replace(GALLERY_ROOT . '/', '', $subfolder['path']);
        $folder[$key]['thumb'] = str_replace(GALLERY_ROOT . '/', '', gal_first_image($subfolder));
        $folder[$key]['childs'] = gal_first_images($subfolder['childs']);
    }

    return $folder;
}

function gal_first_image(&$folder) {
    if ($folder['type'] == 'tome') {
        $image_extensions_allowed = array('jpg', 'jpeg', 'png', 'gif');

        $handle = opendir($folder['path']);
        if ($handle) {
            while (false !== ($file = readdir($handle))) {
                $ext = strtolower(substr(strrchr($file, "."), 1));

                if (!in_array($file, array('.', '..', 'thumbs', '.DS_Store')) && strpos($file, '._') === false) {
                    if (in_array($ext, $image_extensions_allowed)) {
                        return $folder['path'] . '/' . $file;
                    }
                }
            }
            closedir($handle);
        }

        return false;
    }

    foreach ($folder['childs'] as $subfolder) {
        $subresult = gal_first_image($subfolder);
        if ($subresult) {
            return $subresult;
        }
    }
}

function gal_render_list($data) {
    foreach ($data as $key => $row) {
        $names[$key] = ucfirst($row['name']);
    }
    array_multisort($names, SORT_ASC, $data);

    $current_letter = '';

    if (count($data)) {
        echo '<ul class="ui-listview">';
        foreach ($data as $folder) {
            $first_letter = strtoupper($folder['name'][0]);

            if (is_numeric($first_letter)) {
                $first_letter = '#';
            }

            if ($first_letter != $current_letter) {
                $current_letter = $first_letter;
                echo '<li class="ui-li-divider ui-bar-inherit">' . $current_letter . '</li>';
            }

            echo '<li class="ui-li-static ui-li-has-thumb">';

            if ($folder['type'] == 'tome') {
                echo '<img class=lazy data-src="' . image_url('small', $folder['thumb']) . '" width=60 height=75 />';
                echo '<h3><a href="' . url('book/' . $folder['url_path']) . '">' . $folder['name'] . '</a></h3>';
            } else {
                if (!count($folder['childs'])) {
                    echo '<h3>' . $folder['name'] . '</h3>';
                    echo '<p>PDF : ne fonctionne pas pour le moment';
                } else {
                    echo '<img class=lazy data-src="' . image_url('small', $folder['thumb']) . '" width=60 height=75 />';
                    echo '<h3><a href="' . url('list/' . $folder['url_path']) . '">' . $folder['name'] . '</a></h3>';
                    echo '<p>' . count($folder['childs']) . ' Tomes</p>';
                }
            }

            echo '</li>';
        }

        echo '</ul>';
    }
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

function gal_dir_name($file) {
    if (is_dir(BIG_ROOT . $file)) {
        return $file . '/';
    } else {
        $array = explode('/', $file);
        array_splice($array, -1, 1);
        return implode('/', $array) . '/';
    }
}

function search($array, $key, $value) {
    $results = array();

    if (is_array($array)) {
        if (array_key_exists($key, $array) && $array[$key] == $value) {
            return $array['childs'];
        }

        foreach ($array as $subarray) {
            $res = search($subarray, $key, $value);
            if (is_array($res)) {
                return $res;
            }
        }
    }

    return false;
}

function hash_encode($string) {
    return str_replace('#', '%23', $string);
}

function cache_get($key){
    global $app;
    return $app->cache->fetch($key);
}

function cache_set($key, $data, $ttl = 3600){
    global $app;
    return $app->cache->store($key, $data, $ttl);
}

function image_url($preset, $image) {
	global $app;
	return url($app->imagecache->url($preset, hash_encode($image)));
}

function url($link = '') {
	return BASE . $link;
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

    return $is_ajax;
}
