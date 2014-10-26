<?php

class IndexCreator {
    function __construct($path) {
        $this->list = $this->generateList($path);
        $this->getThumbs($this->list);
    }

    protected function generateList($path = '.', $parent = null)
    {
        $directories = array();

        // Directories to ignore when listing output.
        $ignore = array('cgi-bin', '.', '..', 'cache');

        $it = new DirectoryIterator($path);
        foreach($it as $item) {
            if (!in_array($item->getFilename(), $ignore) && $item->isDir()) {
                $node = new Node($item->getFilename(), $parent);
                $node->setChildren($this->generateList($item->getPathname(), $node));

                $directories[] = $node;
            }
        }

        return $directories;
    }

    public function getList() {
        return $this->list;
    }

    protected function getThumbs($folders) {
        foreach ($folders as $subfolder) {
            $subfolder->setThumb($this->getThumb($subfolder));
            $this->getThumbs($subfolder->getChildren());
        }
    }

    protected function getThumb(Node $folder) {
        if ($folder->getType() == 'tome') {
            $image_extensions_allowed = array('jpg', 'jpeg', 'png', 'gif');

            $directory = new DirectoryIterator(GALLERY_ROOT . '/' . $folder->getPath());
            foreach ($directory as $item){
                if($item->isDot() || in_array($item->getFilename(), array('.', '..', 'thumbs', '.DS_Store'))) {
                    continue;
                }

                $ext = strtolower(substr(strrchr($item->getFilename(), "."), 1));
                if (in_array($ext, $image_extensions_allowed)) {
                    return $folder->getPath() . '/' . $item->getFilename();
                }
            }

            return false;
        }

        foreach ($folder->getChildren() as $subfolder) {
            $subresult = $this->getThumb($subfolder);
            if ($subresult) {
                return $subresult;
            }
        }

        return false;
    }

    public static function fromCache(array $cache, $parent = null) {
        $final = array();

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
