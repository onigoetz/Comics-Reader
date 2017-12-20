<?php

class PDFTools {

    public function __construct($file) {
        $this->file = $file;
    }

    public function getNumberOfPages() {
        return preg_match_all("/\/Page\W/", file_get_contents($this->file), $dummy);
    }

    public function savePage($page, $to) {
        $command = "convert " . escapeshellarg("$this->file[$page]") . " " . escapeshellarg($to);
        exec($command, $output, $code);

        if ($code != 0) {
            throw new RuntimeException("Wasn't able to execute \"$command\": \n" . implode("\n", $output));
        }
    }

    public function getImageSizes() {
        $images = range(0, $this->getNumberOfPages() - 1);

        $handles = [];
        foreach ($images as $image) {
            $command = "identify -format \"%[fx:w]x%[fx:h]\" " . escapeshellarg("$this->file[$image]");
            $handles[] = ['handle' => popen($command, 'r'), 'content' => '', 'done' => false];
        }

        $sizes = [];

        $alldone = false;
        while (!$alldone) {
            $alldone = true;

            foreach ($handles as $i => $handle) {
                if ($handle['done']) {
                    continue;
                }

                $handles[$i]['content'] .= stream_get_contents($handle['handle']);
                if (feof($handle['handle'])) {
                    $handles[$i]['done'] = true;
                    pclose($handle['handle']);

                    $sizes[$i] = explode('x', trim($handles[$i]['content']));
                } else {
                    $alldone = false;
                }
            }
        }

        ksort($sizes);

        return $sizes;
    }

}
