const config = require('./config');
const mysql = require('mysql2/promise');

async function getDbConnection() {
    return await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE
    });
}

async function getUserByUsername(connection, username) {
    return (await connection.execute('SELECT * FROM users WHERE username = ?', [username]))[0];
}

async function insertNewUser(connection, username, password, passwordSalt) {
    return await connection.execute('INSERT INTO users(username, password, password_salt, admin) VALUES (?, ?, ?, false)',
        [username, password, passwordSalt]);
}

exports.getDbConnection = getDbConnection;
exports.getUserByUsername = getUserByUsername;
exports.insertNewUser = insertNewUser;