<?php

function getGallery() {
    global $app;
    $data = $app->cache->fetch('GALLERY_FILES');

    if ($data) {
        return IndexCreator::fromCache($data);
    }

    $indexCreator = new IndexCreator(GALLERY_ROOT);

    $data = $indexCreator->getList();
    $app->cache->store('GALLERY_FILES', IndexCreator::toCache($data), 0);

    return $data;
}

function search(array $nodes, $value) {
    foreach ($nodes as $node) {
        if ($node->getPath() == $value) {
            return $node->getChildren();
        }

        $res = search($node->getChildren(), $value);
        if (is_array($res)) {
            return $res;
        }
    }

    return false;
}

function image($preset, $image) {
	global $app;
	return url($app->imagecache->url($preset, str_replace('#', '%23', $image)));
}

function url($link = '') {
	return BASE . $link;
}
