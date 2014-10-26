<header class="bar bar-nav">
    <a href="<?= url("list/{$parent->getPath()}"); ?>" class="btn btn-link btn-nav pull-left" data-transition="slide-out">
        <span class="icon icon-left-nav"></span><?= $parent->getName(); ?>
    </a>
    <a href="<?= url(); ?>" class="btn btn-link btn-nav pull-right" data-transition="fade">
        <span class="icon icon-home"></span>
    </a>
    <h1 class=title><?= $title; ?></h1>
</header>
<div class="content gallery-page">
    <div class="content-padded">
        <ol class="gallery">
            <?php foreach($book as $pages): ?>
            <li data-img="<?= image('big', $pages) ?>">
                <img class=lazy data-src="<?= image('small', $pages) ?>" width=60 height=75>
            </li>
            <?php endforeach; ?>
        </ol>
    </div>
</div>
