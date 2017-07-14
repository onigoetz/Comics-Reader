<?php

class IndexCreator {

    public $verbose;

    function __construct($path, $verbose = false) {
        $this->verbose = $verbose;
        $this->list = $this->generateList($path);
    }

    protected function log($text) {
        if ($this->verbose) {
            echo "$text\n";
        }
    }

    protected function generateList($path = '.', $parent = null)
    {
        $this->log("Looking for books in '$path'");
        $directories = array();

        // Directories to ignore when listing output.
        $ignore = array('cgi-bin', '.', '..', 'cache');

        $it = new DirectoryIterator($path);
        foreach($it as $item) {
            if (in_array($item->getFilename(), $ignore)) {
                continue;
            }

            // A normal directory
            if ($item->isDir()) {
                $this->log("  Found book or directory: " . $item->getFilename());
                $node = new Node($item->getFilename(), $parent);
                $node->setChildren($this->generateList($item->getPathname(), $node));
                $node->setThumb($this->getThumb($node));
                //$this->log("  Got thumbnail '" . $node->getThumb() . "' for '" . $item->getFilename() . "'");

                $directories[] = $node;
                continue;
            }

            // A zip / rar archive
            if (in_array(strtolower($item->getExtension()), ['cbr', 'cbz', 'zip', 'rar'])) {
                try {
                    $this->log("  Found compressed book: " . $item->getFilename());
                    $node = new Node($item->getFilename(), $parent);
                    $node->setThumb($this->getThumb($node));
                    //$this->log("  Got thumbnail '" . $node->getThumb() . "' for '" . $item->getFilename() . "'");

                    $directories[] = $node;
                } catch (Exception $e) {
                    $this->log("Could not open archive: " . $item->getFilename());
                }
            }

            // a PDF file
            if (strtolower($item->getExtension()) == 'pdf') {
                $this->log("  Found pdf: " . $item->getFilename());
                $node = new Node($item->getFilename(), $parent);
                $node->setThumb($node->getPath() . '/1.png');
                $directories[] = $node;
            }
        }

        return $directories;
    }

    public function getList() {
        return $this->list;
    }

    /**
     * From a list of files, take the best suited to be the thumbnail
     *
     * @param Node $folder
     * @param $files
     * @return bool|string
     */
    protected function getBestThumbnail(Node $folder, $files) {
        $images = getValidImages($files);

        if (!count($images)) {
            return false;
        }

        natsort($images);

        return $folder->getPath() . '/' . array_values($images)[0];
    }

    /**
     * Get the thumbnail for a directory
     *
     * @param $folder
     * @return bool|string
     */
    protected function getThumbFromDirectory($folder) {
        $directory = new DirectoryIterator(GALLERY_ROOT . '/' . $folder->getPath());
        $files = [];
        foreach ($directory as $item){
            if (!$item->isDot() && !$item->isDir()) {
                $files[] = $item->getFilename();
            }
        }

        return $this->getBestThumbnail($folder, $files);
    }

    /**
     * Get the thumbnail for an archive
     *
     * @param Node $node
     * @return bool|string
     */
    protected function getThumbFromArchive(Node $node) {
        try {
            $path = GALLERY_ROOT . '/' . $node->getPath();
            $archive = openArchive($path);

            if ($archive) {
                return $this->getBestThumbnail($node, $archive->getFileNames());
            } else {
                $this->log("    could not open archive");
            }
        } catch (Exception $e) {
            $this->log($e->getMessage());
        }

        $this->log("Failed on" . $node->getPath());
        return false;
    }

    protected function getThumb(Node $folder) {
        if ($folder->getType() == 'tome') {
            if (is_dir(GALLERY_ROOT . '/' . $folder->getPath())) {
                return $this->getThumbFromDirectory($folder);
            }

            return $this->getThumbFromArchive($folder);
        }

        // If we're in a directory, get its
        // own children to give the thumbnail
        foreach ($folder->getChildren() as $subfolder) {
            if ($subfolder->getThumb()) {
                return $subfolder->getThumb();
            }
        }

        return false;
    }

    public static function fromCache(array $cache, $parent = null) {
        $final = [];

        foreach($cache as $item) {
            $final[] = $node = new Node($item['name'], $parent);
            $node->setThumb($item['thumb']);
            $node->setChildren(self::fromCache($item['children'], $node));
        }

        return $final;
    }

    public static function toCache(array $nodes) {
        $final = array();
        foreach($nodes as $node) {
            $final[] = array(
                'name' => $node->getName(),
                'thumb' => $node->getThumb(),
                'children' => self::toCache($node->getChildren())
            );
        }

        return $final;
    }
}
