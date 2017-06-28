# Comics reader
Read your comics on your tablet

## What is it ?
A nice little comic book reader for tablets and mobile phones.
It is not intended to work on a desktop computer.

## Features

- Watch your comic books on your phone or tablet, at home or on the go.
- Uses your filesystem, no need for a database
- Opens images in a folder or with CBR/CBZ files

## Installing

### Using docker

```
docker run -v /your-images-dir:/comics -p 8008:80 --rm onigoetz/comicsreader
```

Will start the comics reader using your comic books at `/your-images-dir` and be available at [http://localhost:8008]().


### On a PHP server

- Download this repository on your server in a web accessible directory
- edit `src/php/config.php` to define the path to your images
- make the `cache` directory writable
- run `composer install`

You should be good to go.

## Indexing books

To perform in the best way, the comics reader indexes your books on the first run, if your collection is big, you might want to run the indexing process from the command line.

```bash
php find_books.php

# Or with docker
docker run -v /your-images-dir:/comics --rm comicsreader php find_books.php
```

## Tweaking the configuration

### Images size

The path to the images and the size of the generated thumbnails are available in `src/php/config.php`.

### Basedir

When served directly the comics reader should automatically detect the basedir it's running in.
However if you're running it behind a reverse proxy, you can set the `X-Comics-Base` header.

Here's an example with an nginx configuration.

```
location /BD/ {
    proxy_pass http://comics/;
    proxy_set_header X-Comics-Base "/BD/";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Roadmap

- Natively support PDF files
- Search engine

## Credits and technologies

- The web interface is made with [React](https://facebook.github.io/react/).
- The photo viewer is made with [PhotoSwipe](http://photoswipe.com/).
- [Slim framework 3](http://www.slimframework.com/) powers the server side.
- [Imagecache](https://github.com/onigoetz/imagecache) generates the thumbnails. 
