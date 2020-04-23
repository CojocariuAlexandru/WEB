var config = {};

config.PORT = 8002;
config.HOSTNAME = "0.0.0.0";

let production = true;

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