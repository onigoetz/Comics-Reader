<?php

class Node implements Countable {
    protected $children = [];
    protected $parent;
    protected $name;
    protected $thumb;

    public function __construct($name, $parent = null)
    {
        $this->name = $name;
        $this->parent = $parent;
    }

    public function count()
    {
        return count($this->children);
    }

    public function getName()
    {
        return $this->name;
    }

    public function getType()
    {
        return ($this->count() == 0)? 'tome' : 'dir';
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function getPath()
    {
        if (!$this->parent) {
            return $this->name;
        }

        return "{$this->parent->getPath()}/{$this->name}";
    }

    public function setChildren($children)
    {
        $this->children = $children;
    }

    /**
     * @return Node[]
     */
    public function getChildren()
    {
        return $this->children;
    }

    public function setThumb($thumb)
    {
        $this->thumb = $thumb;
    }

    /**
     * @return string|bool
     */
    public function getThumb()
    {
        return $this->thumb;
    }

    public function getChild($key) {
        foreach ($this->children as $child) {
            if ($child->getName() == $key) {
                return $child;
            }
        }

        return null;
    }

    public function toArray()
    {
        return [
            'name' => $this->getName(),
            'type' => $this->getType(),
            'thumb' => $this->getThumb(),
            'path' => $this->getPath(),
            'count' => $this->count()
        ];
    }
}
