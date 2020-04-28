var config = {};

config.PORT = 8002;
config.HOSTNAME = "0.0.0.0";
config.ACCESS_TOKEN_SECRET = '8572011574de34822484c6ebfc32557a54784db7daad3641851fcd11486c6929763d9ae3162845b0375e0bf8fc10c550e8ad5561df9a1d90267ad68a6a31b65d';

let production = false;

if (production) {
    config.DB_HOST = "users-db";
    config.DB_PORT = "3306";
    config.DB_USER = "root";
    config.DB_PASSWORD = "password";
    config.DB_DATABASE = "TeVi_Auth";
} else {
    config.DB_HOST = "157.245.121.183";
    config.DB_USER = "root";
    config.DB_PORT = "5005";
    config.DB_PASSWORD = "password";
    config.DB_DATABASE = "TeVi_Auth";
}

module.exports = config;
