<?php

$current_letter = '';

if (!count($data)) {
    return '';
}

?>
<ul class="table-view">

<?php foreach ($data as $folder):
        $name = $folder->getName();
        $first_letter = strtoupper($name[0]);

        if (is_numeric($first_letter)) {
            $first_letter = '#';
        }

        if ($first_letter != $current_letter) {
            $current_letter = $first_letter;
            echo '<li class="table-view-divider">' . $current_letter . '</li>';
        }
?>
    <li class="table-view-cell media">
        <?php if ($folder->getType() == 'tome'): ?>
            <a class=navigate-right href="<?= url('book/' . $folder->getPath()) ?>" data-transition="slide-in">
                <div class=media-body>
                    <img class="media-object pull-left lazy" data-src="<?= image('small', $folder->getThumb()) ?>" width=60 height=75 />
                    <?= $name?>
                </div>
            </a>
        <?php else: ?>
            <?php if (!$folder->count()): ?>
                <?= $name ?>
                <p>Cannot show this folder</p>
            <?php else: ?>
                <a class=navigate-right href="<?= url('list/' . $folder->getPath()) ?>" data-transition="slide-in">
                    <div class=media-body>
                        <img class="media-object pull-left lazy" data-src="<?= image('small', $folder->getThumb()) ?>" width=60 height=75 />
                        <?= $name ?>
                        <p><?= $folder->count() ?> Tomes</p>
                    </div>
                </a>
            <?php endif; ?>
        <?php endif; ?>

    </li>
<?php endforeach; ?>
</ul>
