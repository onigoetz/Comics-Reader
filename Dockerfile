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

# Copy files
COPY static/ /var/www/html/static/
COPY asset/ /var/www/html/asset/
COPY src/ /var/www/html/src/
COPY index.php /var/www/html/index.php
COPY asset-manifest.json /var/www/html/asset-manifest.json
COPY find_books.php /var/www/html/find_books.php
COPY composer.json /var/www/html/composer.json
COPY .htaccess /var/www/html/.htaccess

# Composer install
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
 && php composer-setup.php \
 && rm composer-setup.php \
 && php composer.phar install --prefer-dist --no-ansi --no-dev --no-interaction --no-progress --no-scripts --optimize-autoloader \
 && rm composer.phar
