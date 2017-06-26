<?php

use Intervention\Image\Constraint;
use Intervention\Image\Size;
use wapmorgan\UnifiedArchive\UnifiedArchive;

function standardize_unicode($link)
{
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

function openArchive($path)
{
    // Check with mime type, people tend to misname cbr/cbz files
    $file_info = new finfo(FILEINFO_MIME);
    $mime_type = $file_info->buffer(file_get_contents($path));

    if ($mime_type == "application/x-rar; charset=binary") {
        return new UnifiedArchive($path, UnifiedArchive::RAR);
    }

    if ($mime_type == "application/zip; charset=binary") {
        return new UnifiedArchive($path, UnifiedArchive::ZIP);
    }

    return UnifiedArchive::open($path);
}

function getValidImages($files)
{
    $images = [];
    foreach ($files as $file) {
        if ($file[0] != "." && preg_match('/\.(jpe?g|png|gif)$/i', $file)) {
            $images[] = $file;
        }
    }

    return $images;
}

function getPagesFromDir($path)
{
    $pages = [];
    $it = new DirectoryIterator($path);

    $files = [];
    foreach ($it as $item) {
        if (!$item->isDot() && !$item->isDir()) {
            $files[] = $item->getFilename();
        }
    }

    $images = getValidImages($files);
    foreach ($images as $image) {
        $fullPath = "$path/$image";

        $size = getBigatureSize($fullPath);

        $pages[] = [
            'src' => str_replace(GALLERY_ROOT, '', $fullPath),
            'width' => $size->getWidth(),
            'height' => $size->getHeight()
        ];
    }

    return $pages;
}

function getBigatureSize($image, $original = "") {
    // Don't use Imaging as it does
    // a lot of useless things in
    // addition to getting size
    $data = getimagesize($image);
    if (false === $data) {
        throw new RuntimeException(sprintf('Failed to get image size for %s (%s)', $image, $original));
    }
    return (new Size($data[0], $data[1]))->resize(
        BIG_WIDTH,
        null,
        function (Constraint $constraint) {
            $constraint->aspectRatio();
        }
    );
}

function getPagesFromArchive($path)
{
    $archive = openArchive($path);
    $images = getValidImages($archive->getFileNames());

    $pages = [];
    foreach ($images as $image) {
        $tempfile = tempnam(sys_get_temp_dir(), "imagecache_archive");
        file_put_contents($tempfile, $archive->getFileContent($image));

        try {
            $size = getBigatureSize($tempfile, $image);

            $pages[] = [
                'src' => str_replace(GALLERY_ROOT, '', "$path/$image"),
                'width' => $size->getWidth(),
                'height' => $size->getHeight()
            ];
        } catch (Exception $e) {

        }
    }

    return $pages;
}

function getPages($path)
{
    if (is_dir($path)) {
        return getPagesFromDir($path);
    }

    if (in_array(pathinfo($path, PATHINFO_EXTENSION), ['cbr', 'cbz', 'zip', 'rar'])) {
        return getPagesFromArchive($path);
    }

    return [];
}
