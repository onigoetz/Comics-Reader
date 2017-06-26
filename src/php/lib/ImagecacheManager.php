<?php

use \Onigoetz\Imagecache\Exceptions\NotFoundException;

class ImagecacheManager extends \Onigoetz\Imagecache\Manager
{
    public function findValidFile($file) {

        // Obviously it didn't work the first time,
        // so we'll already jump a first time
        $file = dirname($file);

        do {
            if (is_file($file) && in_array(pathinfo($file, PATHINFO_EXTENSION), ["cbr", "cbz", "rar", "zip"])) {
                return $file;
            }

            $previous = $file;
            $file = dirname($file);
        } while ($file != $previous);

        return false;
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

            $archive = openArchive($valid);
            if (!$archive) {
                throw $e;
            }

            $file_in_archive = str_replace("$valid/", "", $this->options['path_local'] . '/' . $source_file);

            $tempfile = tempnam(sys_get_temp_dir(), "imagecache_archive");
            file_put_contents($tempfile, $archive->getFileContent($file_in_archive));

            return $tempfile;
        }
    }
}
