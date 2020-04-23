# Stage 1

FROM php:7.4-cli

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN docker-php-ext-install mysqli pdo pdo_mysql

WORKDIR /usr/src/myapp

COPY composer.* ./

RUN composer install --prefer-dist

COPY . .

# Stage 2
FROM php:7.4-cli

RUN docker-php-ext-install mysqli pdo pdo_mysql

WORKDIR /usr/src/myapp

COPY --from=0 /usr/src/myapp .

EXPOSE 8001

WORKDIR /usr/src/myapp/public

CMD ["php", "-S", "0.0.0.0:8001"]