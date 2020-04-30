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

async function getAllUsers(connection) {
    return await connection.execute('SELECT * FROM users');
}

async function updateUser(connection, user) {
    return await connection.execute('UPDATE users set admin = ? WHERE username = ?', [user.admin, user.username]);
}

async function getAdminFlag(connection, username) {
    return (await connection.execute('SELECT admin FROM users WHERE username = ?', [username]))[0];
}

async function getUserById(connection, id) {
    return (await connection.execute('SELECT * FROM users WHERE id = ?', [id]));
}

async function deleteUserById(connection, id) {
    return (await connection.execute('DELETE FROM users WHERE id = ?', [id]));
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
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.deleteUserById = deleteUserById;