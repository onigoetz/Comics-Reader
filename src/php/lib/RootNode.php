<?php

class RootNode extends Node {
    public function getNode($key)
    {
        $node = $this;

        if (is_null($key)) {
            return $node;
        }

        if ($node->getChild($key)) {
            return $node->getChild($key);
        }

        foreach (explode('/', $key) as $segment) {
            $node = $node->getChild($segment);

            if (!$node) {
                return null;
            }
        }

        return $node;
    }
}