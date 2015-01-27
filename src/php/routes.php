<?php

$app->get(
    '/',
    function () use ($app) {
        return $app->render('index.php', array('data' => getGallery()));
    }
);

$app->get(
    '/list/:list',
    function ($query) use ($app) {
        $query = standardize_unicode($query);
        $data = search(getGallery(), $query);
        $parent = $data[0]->getParent()->getParent();

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

        $ignore = array('.', '..', 'thumbs', ".DS_Store", "Thumbs.db");

        $imagine = new Imagine\Gd\Imagine();

        $it = new DirectoryIterator($path);
        foreach ($it as $item) {
            if (in_array($item->getFilename(), $ignore) || $item->isDir() || strpos($item, '._') === 0) {
                continue;
            }

            $fullPath = "$path/{$item->getFilename()}";
            $size = $imagine->open($fullPath)->getSize()->widen(BIG_WIDTH);

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
        array_multisort($ps, $pages, SORT_NATURAL);

        $parent_folder = search(getGallery(), dirname($book));
        $parent = $parent_folder[0]->getParent();


        $end = explode('/', $book);
        return $app->render('book.php', array('title' => end($end), 'book' => $pages, 'parent' => $parent));
    }
)->conditions(array('book' => '.*'));
