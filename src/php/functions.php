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

        // Don't use Imaging as it does
        // a lot of useless things in
        // addition to getting size
        $data = getimagesize($fullPath);
        if (false === $data) {
            throw new RuntimeException(sprintf('Failed to get image size for %s', $image));
        }

        $size = getBigatureSize($data);

        $pages[] = [
            'src' => str_replace(GALLERY_ROOT, '', $fullPath),
            'width' => $size->getWidth(),
            'height' => $size->getHeight()
        ];
    }

    return $pages;
}

function getBigatureSize($data) {
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
            // Don't use Imaging as it does
            // a lot of useless things in
            // addition to getting size
            $data = getimagesize($tempfile);
            if (false === $data) {
                throw new RuntimeException(sprintf('Failed to get image size for %s (%s)', $tempfile, $image));
            }
            $size = getBigatureSize($data);

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

function getPagesFromPdf($path)
{
    $pdf = new PDFTools($path);
    $images = $pdf->getImageSizes();

    $pages = [];
    foreach ($images as $id => $image) {
        try {

            $size = getBigatureSize($image);

            $pages[] = [
                'src' => str_replace(GALLERY_ROOT, '', "$path/" . ($id+1) . ".png"),
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

    if (in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['cbr', 'cbz', 'zip', 'rar'])) {
        return getPagesFromArchive($path);
    }

    if (strtolower(pathinfo($path, PATHINFO_EXTENSION) =='pdf')) {
        return getPagesFromPdf($path);
    }

    return [];
}

function secure_tmpname($postfix = '.tmp', $prefix = 'tmp', $dir = null) {
    // validate arguments
    if (! (isset($postfix) && is_string($postfix))) {
        return false;
    }
    if (! (isset($prefix) && is_string($prefix))) {
        return false;
    }
    if (! isset($dir)) {
        $dir = getcwd();
    }

    // find a temporary name
    $tries = 1;
    do {
        // get a known, unique temporary file name
        $sysFileName = tempnam($dir, $prefix);
        if ($sysFileName === false) {
            return false;
        }

        // tack on the extension
        $newFileName = $sysFileName . $postfix;
        if ($sysFileName == $newFileName) {
            return $sysFileName;
        }

        // move or point the created temporary file to the new filename
        // NOTE: these fail if the new file name exist
        $newFileCreated = (isWindows() ? @rename($sysFileName, $newFileName) : @link($sysFileName, $newFileName));
        if ($newFileCreated) {
            return $newFileName;
        }

        unlink ($sysFileName);
        $tries++;
    } while ($tries <= 5);

    return false;
}

function isWindows() {
    return (DIRECTORY_SEPARATOR == '\\' ? true : false);
}
