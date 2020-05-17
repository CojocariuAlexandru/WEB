var config = {};

config.PORT = 8002;
config.HOSTNAME = "0.0.0.0";
config.ACCESS_TOKEN_SECRET = '8572011574de34822484c6ebfc32557a54784db7daad3641851fcd11486c6929763d9ae3162845b0375e0bf8fc10c550e8ad5561df9a1d90267ad68a6a31b65d';

// 0 - production cloud
// 1 - production cloud, run from local
// 2 - local db, run from local
// 3 - Heroku db
let configurationType = 3;

if (configurationType == 0) {
    config.DB_HOST = "users-db";
    config.DB_PORT = "3306";
    config.DB_USER = "root";
    config.DB_PASSWORD = "password";
    config.DB_DATABASE = "TeVi_Auth";
} else if (configurationType == 1) {
    config.DB_HOST = "157.245.121.183";
    config.DB_USER = "root";
    config.DB_PORT = "5005";
    config.DB_PASSWORD = "password";
    config.DB_DATABASE = "TeVi_Auth";
} else if (configurationType == 2) {
    config.DB_HOST = '127.0.0.1';
    config.DB_PORT = "3306";
    config.DB_USER = "root";
    config.DB_PASSWORD = "";
    config.DB_DATABASE = "TeVi_Auth";
} else if (configurationType == 3){
    config.PORT = process.env.PORT || 3000
    config.DB_HOST = 'us-cdbr-east-06.cleardb.net';
    config.DB_USER = 'b251147b1d5604';
    config.DB_PASSWORD = '06e269f1';
    config.DB_DATABASE = 'heroku_a3c53cb6e83619f';
}

module.exports = config;
