FROM node:16.5.0

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
VOLUME /cache
RUN ln -s /comics /usr/src/app/images && ln -s /cache /usr/src/app/cache

# Run yarn install early to allow a quick
# rebuild if the package.json didn't change
COPY package.json yarn.lock ./
RUN yarn install --production --non-interactive && yarn cache clean

# Copy files
COPY public/ ./public/
COPY server/ ./server/
COPY src/ ./src/
COPY comics next.config.js ./

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
