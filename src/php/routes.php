<?php

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

// URL Management is done on the client side, we can simply return a notFoundHandler
$container['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c['response']
            ->withStatus(200)
            ->withHeader('Content-Type', 'text/html')
            ->write(renderLayout());
    };
};

function asset($name) {
    return json_decode(file_get_contents(__DIR__  .  "/../../asset-manifest.json"), true)[$name];
}

function renderLayout() {
    ob_start();
    include __DIR__ . "/../index.tpl.php";
    $output = ob_get_contents();
    ob_end_clean();

    return $output;
}

$app->get(
    '/',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        $res->getBody()->write(renderLayout());
        return $res;
    }
);

$app->get(
    '/api/books.json',
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
    '/api/books/{book:.*}.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        $book = standardize_unicode($args['book']);

        // Get the pages
        $path = GALLERY_ROOT . '/' . $book;

        $pages = getPages($path);

        $ps = [];
        foreach ($pages as $key => $page) {
            $ps[$key] = $page['src'];
        }
        array_multisort($ps, SORT_NATURAL, $pages);

        $end = explode('/', $book);
        return $res->withJson(['name' => end($end), 'pages' => $pages]);
    }
);
