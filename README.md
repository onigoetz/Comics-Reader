# Comics reader

[![Latest Version](https://img.shields.io/github/release/onigoetz/Comics-Reader.svg?style=flat-square)](https://github.com/onigoetz/Comics-Reader/releases)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/onigoetz/Comics-Reader/blob/master/LICENSE.md)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/onigoetz/Comics-Reader/build.yml?style=flat-square&logo=github)
[![Docker Pulls](https://img.shields.io/docker/pulls/onigoetz/comicsreader?style=flat-square&logo=docker)](https://hub.docker.com/r/onigoetz/comicsreader)


Read your comics on your tablet

## What is it ?
A nice little comic book reader for tablets and mobile phones.
It is not intended to work on a desktop computer.

## Features

- Watch your comic books on your phone or tablet, at home or on the go.
- Uses your filesystem, has an embedded database.
- Supports most comics formats : CBZ/CBR/ZIP/RAR, PDF, simple image directory.
- Internal search engine to find your comics easily
- Use basic auth credentials (from Nginx/Apache) or use the embedded Database to manage users.

## Installing

### Using docker (Recommended)

```
docker run -v /your-images-dir:/comics -p 8080:8080 --rm onigoetz/comicsreader
```

Will start the comics reader using your comic books at `/your-images-dir` and be available at [http://localhost:8080]().


### With Node

First, you need
- Nodejs
- [MuPDF](https://mupdf.com/docs/mutool.html) for PDF support (`brew install mupdf-tools` / `apt install mupdf-tools`)

- Download/clone this repository on your server
- Symlink your comics to `images` in the app's directory
- Make the `images/cache` directory writable
- Run `yarn install`
- Run `yarn build`

You can then start the server with `yarn start`.

This will index the books and start the server.

## Authentication

Authentication is an optional feature, you can either leverage the basic auth credentials from a server (Apache/Nginx)
Or use the built-in database.

This option can be with the `COMICS_AUTH_TYPE` environment variable.
possible values are "basic" (default) or "db"

When using the "db" authentication mode, you need to create users, for this we provide a command-line tool to create them.

Note that the container has to be stopped in order to use the CLI tool as the database is otherwise readonly.

### Creating users

```bash
sudo docker run --rm -it -v your_images_dir:/comics onigoetz/comicsreader node comics createUser
```

### Changing password

```bash
sudo docker run --rm -it -v your_images_dir:/comics onigoetz/comicsreader node comics changePassword
```

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
    proxy_pass http://comics:8080/BD/;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Known issues

- Files with accents in zip (cbz) files don't work.

## Credits and technologies

- The web interface is made with [React](https://facebook.github.io/react/).
- The photo viewer is made with [PhotoSwipe](http://photoswipe.com/).
- [Next.js](https://nextjs.org/) powers the server side with a hint of [Express](http://expressjs.com/).
- [Sharp](http://sharp.pixelplumbing.com/en/stable/) is used to generate the thumbnails. 
- Icon is from [GetDrawings](http://getdrawings.com/get-icon#comic-book-icon-68.jpg)
