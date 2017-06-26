<?php

include 'vendor/autoload.php';
include "src/php/config.php";
include "src/php/functions.php";

$cache = new Cache();

echo "Creating cache\n";

$indexCreator = new IndexCreator(GALLERY_ROOT, true);
$index = IndexCreator::toCache($indexCreator->getList());


$cache->store('GALLERY_FILES', $index, 0);

echo "Stored cache\n";
