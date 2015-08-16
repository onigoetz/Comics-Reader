<?php

use Imagine\Image\Box;

$app->get(
    '/',
    function () use ($app) {

        $data = getGallery();

        foreach ($data as $key => $row) {
            $names[$key] = ucfirst($row->getName());
        }
        array_multisort($names, SORT_ASC, $data);

        return $app->render('index.php', array('title' => 'Home', 'data' => $data));
    }
);

$app->get(
    '/list/:list',
    function ($query) use ($app) {
        $query = standardize_unicode($query);
        $data = search(getGallery(), $query);
        $parent = $data[0]->getParent()->getParent();

        foreach ($data as $key => $row) {
            $names[$key] = ucfirst($row->getName());
        }
        array_multisort($names, SORT_ASC, $data);

        $end = explode('/', $query);
        return $app->render('list.php', array('title' => end($end), 'data' => $data, 'parent' => $parent));
    }
)->conditions(array('list' => '.*'));

$app->get(
    '/book/:book',
    function ($book) use ($app) {
        $book = standardize_unicode($book);

        //Get the pages
        $pages = array();
        $path = GALLERY_ROOT . '/' . $book;

        $it = new DirectoryIterator($path);
        foreach ($it as $item) {
            if (!in_array(strtolower($item->getExtension()), ['jpg', 'jpeg', 'png', 'gif']) || $item->isDir()) {
                continue;
            }

            $fullPath = "$path/{$item->getFilename()}";

            // Quick size getter, instead of Imagine
            // which does a lot of processing that
            // is not useful for us
            $data = getimagesize($fullPath);
            if (false === $data) {
                throw new RuntimeException(sprintf('Failed to get image size for %s', $fullPath));
            }
            $size = (new Box($data[0], $data[1]))->widen(BIG_WIDTH);


            $pages[] = [
                'src' => str_replace(GALLERY_ROOT, '', $fullPath),
                'width' => $size->getWidth(),
                'height' => $size->getHeight()
            ];
        }

        $ps = array();
        foreach($pages as $key => $page) {
            $ps[$key] = $page['src'];
        }
        array_multisort($ps, SORT_NATURAL, $pages);

        $parent_folder = search(getGallery(), dirname($book));
        $parent = $parent_folder[0]->getParent();


        $end = explode('/', $book);
        return $app->render('book.php', array('title' => end($end), 'book' => $pages, 'parent' => $parent));
    }
)->conditions(array('book' => '.*'));
