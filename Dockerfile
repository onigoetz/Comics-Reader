FROM node:18.4.0-alpine

RUN apk add --no-cache mupdf-tools

WORKDIR /usr/src/app

# Symlink volume
VOLUME /comics
VOLUME /cache
RUN ln -s /comics /usr/src/app/images && ln -s /cache /usr/src/app/cache

# Run yarn install early to allow a quick
# rebuild if the package.json didn't change
COPY package.json yarn.lock ./
RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && yarn install --production --non-interactive \
    && apk del .gyp \
	&& yarn cache clean

# Copy files
COPY public/ ./public/
COPY server/ ./server/
COPY src/ ./src/
COPY comics next.config.js ./

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
