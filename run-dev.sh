docker build -t comics-reader .
docker run -it --rm -v "$PWD":/var/www/html/ -v "$PWD/images":/comics/ -p 8000:80 comics-reader