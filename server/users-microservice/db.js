const config = require('./config');
const mysql = require('mysql2/promise');

async function getDbConnection() {
    return await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        port: config.DB_PORT,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE
    });
}

async function getPasswordSalt(connection, username) {
    return (await connection.execute('SELECT password_salt FROM users WHERE username = ?', [username]))[0];
}

async function getPasswordFinalForm(connection, username) {
    return (await connection.execute('SELECT password FROM users WHERE username = ?', [username]))[0];
}

async function getAdminFlag(connection, username) {
    return (await connection.execute('SELECT admin FROM users WHERE username = ?', [username]))[0];
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
exports.getPasswordSalt = getPasswordSalt;
exports.getPasswordFinalForm = getPasswordFinalForm;
exports.getAdminFlag = getAdminFlag;
