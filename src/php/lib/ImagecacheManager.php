<?php

use \Onigoetz\Imagecache\Exceptions\NotFoundException;

class ImagecacheManager extends \Onigoetz\Imagecache\Manager
{
    public function findValidFile($file) {

        // Obviously it didn't work the first time,
        // so we'll already jump a first time
        $file = dirname($file);

        do {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (is_file($file) && in_array($extension, ["cbr", "cbz", "rar", "zip", "pdf"])) {
                return $file;
            }

            $previous = $file;
            $file = dirname($file);
        } while ($file != $previous);

        return false;
    }

    public function extractFromArchive($source_file, $valid) {
        $archive = openArchive($valid);
        if (!$archive) {
            throw new RuntimeException("Could not open archive '$valid'");
        }

        $file_in_archive = str_replace("$valid/", "", $this->options['path_local'] . '/' . $source_file);

        $file = tempnam(sys_get_temp_dir(), "imagecache_archive");
        file_put_contents($file, $archive->getFileContent($file_in_archive));

        return $file;
    }

    public function extractFromPDF($source_file, $valid) {
        $archive = new PDFTools($valid);
        if (!$archive) {
            throw new RuntimeException("Could not open PDF '$valid'");
        }

        $file_in_archive = str_replace("$valid/", "", $this->options['path_local'] . '/' . $source_file);
        $page = explode(".png", $file_in_archive)[0] -1;

        $file = secure_tmpname(".png", "imagecache_archive", sys_get_temp_dir());
        $archive->savePage($page, $file);

        return $file;
    }

    public function getOriginalFile($source_file)
    {
        try {
            return parent::getOriginalFile($source_file);
        } catch (NotFoundException $e) {
            $valid = $this->findValidFile($this->options['path_local'] . '/' . $source_file);
            if (!$valid) {
                throw $e;
            }

            if (strtolower(pathinfo($valid, PATHINFO_EXTENSION)) == "pdf") {
                return $this->extractFromPDF($source_file, $valid);
            }

            return $this->extractFromArchive($source_file, $valid);

        }
    }
}
