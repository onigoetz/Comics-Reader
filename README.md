# Comics reader
Read your comics on your tablet

# What is it ?
A nice little comic book reader for tablets and mobile phones.
It is not intended to work on a desktop computer.

# Requirements

- some comics to read ( yeah, they're not provider, sorry ;) )
- a PHP web server
- a tablet

# Installing

- Download this repository on your server in a web accessible directory
- make the `cache` directory writable
- `composer install
- The easiest way to make it work is to make a symlink in the web folder with the name `images` that points to all your comics
- Point your browser to the web folder. (the first page load might take some time as it caches the list of your comics)
- Enjoy !

## Tweaking the configuration

If you want to let your images, out of the main folder, you can tweak the `src/php/config.php` file.

## Credits and technologies

- The web interface is made with the very nice [Ratchet components](http://goratchet.com/).
- The photo viewer is made by [Kik interactive](https://github.com/kikinteractive/photo-viewer) and was slightly adapted to not depend on their App.js framework.
- [Slim framework](http://www.slimframework.com/) powers the server side.
- [Imagecache](https://github.com/onigoetz/imagecache) generates the thumbnails. 
