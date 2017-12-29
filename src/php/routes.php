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
    return json_decode(file_get_contents(__DIR__  .  "/../../static/asset-manifest.json"), true)[$name];
}

function renderLayout() {
    ob_start();
    include __DIR__ . "/../index.tpl.php";
    $output = ob_get_contents();
    ob_end_clean();

    return $output;
}

function getUser($serverParams) {
    if (array_key_exists('PHP_AUTH_USER', $serverParams)) {
        return $serverParams['PHP_AUTH_USER'];    
    }   

    return 'anonymous';
}

$app->get(
    '/',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        $res->getBody()->write(renderLayout());
        return $res;
    }
);

$app->get(
    '/manifest.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) {
        return $res->withJson([
            "short_name" => "Comics",
            "name" => "Comics Reader",
            "start_url" => BASE,
            "display" => "standalone",
            "theme_color" => "#000000",
            "background_color" => "#999999",
            "icons" => [
                [
                    "src" => BASE . "asset/images/apple-touch-72.png",
                    "type" => "image/png",
                    "sizes" => "72x72"   
                ],
                [
                    "src" => BASE . "asset/images/apple-touch-114.png",
                    "type" => "image/png",
                    "sizes" => "114x114"   
                ],
                [
                    "src" => BASE . "asset/images/apple-touch-144.png",
                    "type" => "image/png",
                    "sizes" => "144x144"   
                ],
                [
                    "src" => BASE . "asset/images/apple-touch-256.png",
                    "type" => "image/png",
                    "sizes" => "256x256"   
                ],
                [
                    "src" => BASE . "asset/images/apple-touch-512.png",
                    "type" => "image/png",
                    "sizes" => "512x512"   
                ]
            ]
        ]);
    }
);

$app->get(
    '/thumb/{ratio}/{book:.*}',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $book = standardize_unicode($args['book']);
        $ratio = $args['ratio'];

        $node = getIndex($app)->getNode($book);

        if (!$node) {
            return $res->withStatus(404)->write('Image not found');;
        }

        $image = $node->getThumb();

        if ($ratio != 1) {
            $re = '/(\.[A-z]{3,4}\/?(\?.*)?)$/';
            $subst = "@${ratio}x$1";
            
            $image = preg_replace($re, $subst, $image);
            
        }

        return $res->withRedirect(BASE . "images/cache/thumb/" . $node->getThumb(), 302);
    }
);


$app->get(
    '/api/books.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $tree = new TreeWalker(getIndex($app));

        return $res->withJson($tree->toJson());
    }
);

$app->get(
    '/api/read',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $cache = $app->getContainer()->get('cache');

        $user = getUser($req->getServerParams());

        $key = 'READ::' . $user;
        $read = $cache->fetch($key);

        if ($read === false) {
            $read = [];
        }


        return $res->withHeader('Cache-Control', 'no-cache')->withJson($read);
    }
);

$app->post(
    '/api/read/{book:.*}',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $book = standardize_unicode($args['book']);
        $cache = $app->getContainer()->get('cache');
        
        $user = getUser($req->getServerParams());

        $key = 'READ::' . $user;
        $read = $cache->fetch($key);

        if (!$read) {
            $read = [];
        }

        if (!in_array($book, $read)) {
            $read[] = $book;
            $cache->store($key, $read, 0);
        }

        return $res->withJson($read);
    }
);

$app->get(
    '/api/books/{book:.*}.json',
    function (ServerRequestInterface $req, ResponseInterface $res, $args = []) use ($app) {
        $book = standardize_unicode($args['book']);

        // Get the pages
        $path = GALLERY_ROOT . '/' . $book;

        $cache = $app->getContainer()->get('cache');

        $pages = $cache->remember("BOOK_$path", 0, function() use ($path) {
            $pages = getPages($path);

            $ps = [];
            foreach ($pages as $key => $page) {
                $ps[$key] = $page['src'];
            }
            array_multisort($ps, SORT_NATURAL, $pages);

            return $pages;
        });

        $end = explode('/', $book);
        return $res->withJson(['name' => end($end), 'pages' => $pages]);
    }
);
