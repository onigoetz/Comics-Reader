# We use php 5.6 because the rar extension doesn't work in PHP 7
FROM php:5.6-apache

WORKDIR /var/www/html

# enable mod_rewrite
RUN a2enmod rewrite && a2enmod expires && a2enmod headers && a2enmod deflate

# Install extensions : iconv, mcrypt, gd, zip, rar, imagick
RUN apt-get update && apt-get install -y \
		libfreetype6-dev \
		libjpeg62-turbo-dev \
		libmcrypt-dev \
		libpng12-dev \
		libzip-dev \
		imagemagick \
		ghostscript \
	&& docker-php-ext-configure zip --with-libzip=/usr/include/ \
	&& docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
	&& docker-php-ext-install -j$(nproc) iconv mcrypt gd zip \
	&& pecl install rar && docker-php-ext-enable rar \
	&& rm -rf /var/lib/apt/lists/*

# Symlink volume
VOLUME /comics
RUN ln -s /comics /var/www/html/images

ENV COMPOSER_HOME /composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV PATH /composer/vendor/bin:$PATH

RUN curl -o /tmp/composer-setup.php https://getcomposer.org/installer \
  && curl -o /tmp/composer-setup.sig https://composer.github.io/installer.sig \
  && php -r "if (hash('SHA384', file_get_contents('/tmp/composer-setup.php')) !== trim(file_get_contents('/tmp/composer-setup.sig'))) { unlink('/tmp/composer-setup.php'); echo 'Invalid installer' . PHP_EOL; exit(1); }" \
  && php /tmp/composer-setup.php \
  && rm /tmp/composer-setup.php

COPY composer.json /var/www/html/composer.json

RUN php composer.phar install --prefer-dist --no-ansi --no-dev --no-interaction --no-progress --no-scripts --no-autoloader

RUN echo "memory_limit=512M" > /usr/local/etc/php/php.ini

# Copy files
COPY static/ /var/www/html/static/
COPY asset/ /var/www/html/asset/
COPY src/ /var/www/html/src/
COPY index.php /var/www/html/index.php
COPY asset-manifest.json /var/www/html/asset-manifest.json
COPY find_books.php /var/www/html/find_books.php
COPY .htaccess /var/www/html/.htaccess

# Composer install
RUN php composer.phar install --optimize-autoloader
