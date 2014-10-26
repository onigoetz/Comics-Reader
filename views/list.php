<header class="bar bar-nav">
    <?php if($parent):?>
    <a href="<?= url("list/{$parent->getPath()}"); ?>" class="btn btn-link btn-nav pull-left" data-transition="slide-out">
        <span class="icon icon-left-nav"></span><?= $parent->getName(); ?>
    </a>
    <?php else: ?>
    <a href="<?= url(); ?>" class="btn btn-link btn-nav pull-left" data-transition="slide-out">
        <span class="icon icon-left-nav"></span>Home
    </a>
    <?php endif; ?>

    <a href="<?= url(); ?>" class="btn btn-link btn-nav pull-right" data-transition="fade">
        <span class="icon icon-home"></span>
    </a>

    <h1 class=title><?= $title; ?></h1>
</header>
<div class="content">
    <?php include __DIR__ . '/_list.php'; ?>
</div>
