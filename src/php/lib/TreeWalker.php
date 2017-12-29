<?php

class TreeWalker
{
    protected $tree;

    protected $routes = [];

    public function __construct(RootNode $tree)
    {
        $this->tree = $tree;
    }

    public function toJson()
    {
        $this->routes[''] = [
            'name' => $this->tree->getName(),
            'books' => $this->iterate($this->tree->getChildren())
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
            $data = new StdClass();
            //$data->thumb = $row->getThumb();
            //$data->name = $row->getName();
            //$data->path = $row->getPath();

            // The books props differentiates dirs and books
            if ($row->getType() == 'dir') {
                $data->books = $this->iterate($row->getChildren());
            }

            $this->routes[$row->getPath()] = $data;

            $content[] = $row->getName();
            $names[$key] = ucfirst($row->getName());
        }
        array_multisort($content, SORT_ASC|SORT_NATURAL|SORT_FLAG_CASE, $names);

        return $content;
    }
}
