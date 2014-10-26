<?php

/**
 * Cache Module for filesystem
 *
 * @author Stéphane Goetz
 */
class Cache
{
    /**
     * Store data in the cache
     *
     * @param string $key
     * @param mixed $data
     * @param integer $ttl
     * @throws Exception
     */
    function store($key, $data, $ttl)
    {
        // Opening the file in read/write mode
        $filename = $this->getFileName($key);

        // Serializing along with the TTL
        $time = ($ttl == 0)? 0 : time() + $ttl;

        $data = '<?php return ' . var_export(array($time, $data), true) . ';';

        if (!is_dir($dir = dirname($filename))) {
            mkdir($dir, 0755, true);
        }

        if (file_put_contents($filename, $data) === false) {
            throw new Exception('Could not write to cache');
        }
    }

    /**
     * Fetch some data from the cache
     *
     * Returns false if the data is too old or nothing is found
     *
     * @param string $key
     * @return mixed
     */
    function fetch($key)
    {
        $filename = $this->getFileName($key);

        if (!file_exists($filename)) {
            return false;
        }

        $data = include($filename);

        if ((!$data) OR (time() > $data[0] && $data[0] != 0)) {
            // If unserializing somehow didn't work out, we'll delete the file
            // Unlinking when the file was expired
            unlink($filename);
            return false;
        }

        return $data[1];
    }

    /**
     * Delete data in the cache
     *
     * @param string $key
     * @return boolean
     */
    function delete($key)
    {
        $filename = $this->getFileName($key);

        return file_exists($filename)? unlink($filename) : false;
    }

    /**
     * Function to get the file name
     *
     * @param string $key
     * @return string
     */
    private function getFileName($key)
    {
        return CACHE . '/' . md5($key);
    }
}
