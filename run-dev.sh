docker build -t comics-reader .
docker run -it --rm \
    -v "$PWD":/var/www/html/ \
    -v "$PWD/images":/comics/ \
    -v yarn:/usr/local/share/.cache/yarn \
    -p 8080:8080 \
    --name comics-reader \
    comics-reader \
    yarn start:dev
