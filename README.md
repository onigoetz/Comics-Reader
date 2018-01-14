# Comics reader
Read your comics on your tablet

## What is it ?
A nice little comic book reader for tablets and mobile phones.
It is not intended to work on a desktop computer.

## Features

- Watch your comic books on your phone or tablet, at home or on the go.
- Uses your filesystem, no need for a database
- Read images from a folder
- CBZ/CBR Files Support
- PDF Support

## Installing

### Using docker

```
docker run -v /your-images-dir:/comics -p 8080:8080 --rm onigoetz/comicsreader
```

Will start the comics reader using your comic books at `/your-images-dir` and be available at [http://localhost:8080]().


### With Node

First, you need
- Nodejs
- Imagemagick installed on the machine. (for PDF support)
- `unrar` and `unzip` commands installed (for CBR and CBZ support)

- Download/clone this repository on your server
- Edit `config.js` to define the path to your images, defaults to `images` in the root directory
- Make the `images/cache` directory writable
- Run `yarn install`

You can then start the server with `yarn start`.

This will index the books and start the server.

## Tweaking the configuration

### Basedir

Basedir has to be specified as an environment variable when starting the server.

```
COMICS_BASE="comics" yarn start
# OR
docker run -e "COMICS_BASE=comics" ...
```

## Reverse proxy through nginx

```
location /BD/ {
    proxy_pass http://comics:8080/;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Roadmap

- Search engine

## Credits and technologies

- The web interface is made with [React](https://facebook.github.io/react/).
- The photo viewer is made with [PhotoSwipe](http://photoswipe.com/).
- [Express](http://expressjs.com/) powers the server side.
- [Sharp](http://sharp.pixelplumbing.com/en/stable/) is used to generate the thumbnails. 
