FROM node:12.4.0 AS build

WORKDIR /usr/src/app

RUN mkdir /usr/src/app/static

# Run yarn install early to allow a quick
# rebuild if the package.json didn't change
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn install --non-interactive && yarn cache clean

COPY src/ /usr/src/app/src/
COPY crafty.config.js /usr/src/app/crafty.config.js
COPY webpack.config.js /usr/src/app/webpack.config.js

RUN yarn build

FROM node:12.4.0

# Install extensions : zip, rar, imagick
RUN (sed -i "s/main/main contrib non-free/g" /etc/apt/sources.list) && \
    apt-get update && apt-get install -y \
		zip \
		unrar \
		imagemagick \
		ghostscript \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Symlink volume
VOLUME /comics
RUN ln -s /comics /usr/src/app/images

# Run yarn install early to allow a quick
# rebuild if the package.json didn't change
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn install --production --non-interactive && yarn cache clean

# Copy files
COPY --from=build /usr/src/app/static/ /usr/src/app/static/
COPY src/ /usr/src/app/src/
COPY server/ /usr/src/app/server/
COPY config.js /usr/src/app/config.js
COPY comics /usr/src/app/comics

EXPOSE 8080

# Generate final autoloader
CMD [ "yarn", "start" ]
