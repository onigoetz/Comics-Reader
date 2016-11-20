<?php

class TreeWalker
{
    protected $tree;

    protected $routes = [];

    public function __construct($tree)
    {
        $this->tree = $tree;
    }

    public function toJson()
    {
        $this->routes[''] = [
            'name' => 'Home',
            'thumb' => '',
            'type' => 'dir',
            'path' => '',
            'books' => $this->iterate($this->tree)
        ];

        return $this->routes;
    }

    protected function iterate($entries)
    {
        if (!count($entries)) {
            return [];
        }

        $content = $names = [];

        /**
         * @var Integer $key
         * @var Node $row
         */
        foreach ($entries as $key => $row) {
            $data = [
                'name' => $row->getName(),
                'thumb' => $row->getThumb(),
                'path' => $row->getPath(),
            ];

            // Dirs without thumbs are probably folders with PDF's or zip files.
            if (!$data['thumb']) {
                continue;
            }

            // The books props differentiates dirs and books
            if ($row->getType() == 'dir') {
                $data['books'] = $this->iterate($row->getChildren());
            }

            $this->routes[$row->getPath()] = $data;

            $content[] = $row->getPath();
            $names[$key] = ucfirst($row->getName());
        }
        array_multisort($content, SORT_ASC|SORT_NATURAL|SORT_FLAG_CASE, $names);

        return $content;
    }
}
