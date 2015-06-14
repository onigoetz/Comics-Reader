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

function standardize_unicode($link) {
    $replace = [
        urldecode("%C3%A8") => urldecode("e%CC%80"), //è
        urldecode("%C3%A9") => urldecode("e%CC%81"), //é
        urldecode("%C3%B4") => urldecode("o%CC%82"), //ô
        urldecode("%C3%A0") => urldecode("a%CC%80"), //à
        urldecode("%C3%89") => urldecode("E%CC%81"), //É
        urldecode("%C3%BB") => urldecode("u%CC%82"), //û
    ];

    return strtr($link, $replace);
}
