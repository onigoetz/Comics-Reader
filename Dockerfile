# We use php 5.6 because the rar extension doesn't work in PHP 7
FROM node:8

# Install extensions : zip, rar, imagick
RUN (echo "deb http://deb.debian.org/debian jessie main contrib non-free" > /etc/apt/sources.list) && \ 
	(echo "deb http://deb.debian.org/debian jessie-updates main contrib non-free" >> /etc/apt/sources.list) && \ 
	(echo "deb http://security.debian.org/ jessie/updates main contrib non-free" >> /etc/apt/sources.list) && \
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

# Set to production mode
ENV NODE_ENV production

# Run a first yarn install, to allow a shorter 
# rebuild if the package.json didn't change
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn install --production --non-interactive && yarn cache clean

# Copy files
COPY static/ /usr/src/app/static/
COPY src/ /usr/src/app/src/
COPY config.js /usr/src/app/config.js

EXPOSE 8080

# Generate final autoloader
CMD [ "yarn", "start" ]
