const config = require('../config');
const mysql = require('mysql2/promise');

class UserRepository {
    constructor() {}

    async getConnection() {
        return await mysql.createConnection({
            host: config.DB_HOST,
            user: config.DB_USER,
            port: config.DB_PORT,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE
        });
    }

    async getById(id) {
        let connection = await this.getConnection();
        return (await connection.execute('SELECT * FROM users WHERE id = ?', [id]))[0];
    }

    async getByUsername(username) {
        let connection = await this.getConnection();
        return (await connection.execute('SELECT * FROM users WHERE username = ?', [username]))[0];
    }

    async getAll() {
        let connection = await this.getConnection();
        return (await connection.execute('SELECT * FROM users'))[0];
    }

    async create(username, password, passwordSalt) {
        let connection = await this.getConnection();
        return await connection.execute('INSERT INTO users(username, password, password_salt, admin) VALUES (?, ?, ?, false)',
            [username, password, passwordSalt]);
    }

    async update(user) {
        let connection = await this.getConnection();
        return await connection.execute('UPDATE users set admin = ? WHERE username = ?', [user.admin, user.username]);
    }

    async delete(id) {
        let connection = await this.getConnection();
        return (await connection.execute('DELETE FROM users WHERE id = ?', [id]));
    }
}

module.exports = UserRepository;
