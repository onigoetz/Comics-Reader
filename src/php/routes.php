<?php

use Intervention\Image\Constraint;
use Intervention\Image\Size;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

// URL Management is done on the client side, we can simply return a notFoundHandler
$container['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c['response']
            ->withStatus(200)
            ->withHeader('Content-Type', 'text/html')
            ->write(file_get_contents(__DIR__ . '/../../index.html'));
    };
};

$app->get(
    '/',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        $res->getBody()->write(file_get_contents(__DIR__ . '/../../index.html'));
        return $res;
    }
);

$app->get(
    '/books.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $cache = $app->getContainer()->get('cache');

        $data = $cache->remember('GALLERY_FILES', 0, function() {
            $indexCreator = new IndexCreator(GALLERY_ROOT);
            return IndexCreator::toCache($indexCreator->getList());
        });

        $tree = new TreeWalker(IndexCreator::fromCache($data));

        return $res->withJson($tree->toJson());
    }
);

$app->get(
    '/books/{book:.*}.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        $book = standardize_unicode($args['book']);

        // Get the pages
        $pages = array();
        $path = GALLERY_ROOT . '/' . $book;

        $it = new DirectoryIterator($path);
        foreach ($it as $item) {
            // Ignore hidden files
		    if (substr($item->getFilename(), 0, 1) == ".") {
		        continue;
		    }

            if (!in_array(strtolower($item->getExtension()), ['jpg', 'jpeg', 'png', 'gif']) || $item->isDir()) {
                continue;
            }

            $fullPath = "$path/{$item->getFilename()}";

            // Don't use Imaging as it does
            // a lot of useless things in
            // addition to getting size
            $data = getimagesize($fullPath);
            if (false === $data) {
                throw new RuntimeException(sprintf('Failed to get image size for %s', $fullPath));
            }
            $size = (new Size($data[0], $data[1]))->resize(BIG_WIDTH, null, function(Constraint $constraint) {
                $constraint->aspectRatio();
            });

            $pages[] = [
                'src' => str_replace(GALLERY_ROOT, '', $fullPath),
                'width' => $size->getWidth(),
                'height' => $size->getHeight()
            ];
        }

        $ps = array();
        foreach ($pages as $key => $page) {
            $ps[$key] = $page['src'];
        }
        array_multisort($ps, SORT_NATURAL, $pages);

        $end = explode('/', $book);
        return $res->withJson(['name' => end($end), 'pages' => $pages]);
    }
);
