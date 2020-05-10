const JwtUtil = require('./jwt-utils');
const jwt = require('jsonwebtoken');
const config = require('../config');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAll() {
        let users = await this.userRepository.getAll();

        for (let i = 0; i < users.length; ++i) {
            delete users[i].password;
            delete users[i].password_salt;
        }

        return users;
    }

    async updateUserStatus(id, status) {
        let user = await this.userRepository.getById(id);
        if (user.length == 0) {
            return 404;
        }

        user = user[0];

        let oldStatus = user.admin;
        if (oldStatus != status) {
            user.admin = status;
            await this.userRepository.update(user);
        }

        return 200;
    }

    async delete(userId) {
        let user = await this.userRepository.getById(userId);
        if (user.length == 0) {
            return 404;
        }

        await this.userRepository.delete(userId);

        return 204;
    }

    async login(username, password) {
        //Check if a user with that name exists
        let users = await this.userRepository.getByUsername(username);
        if (users.length == 0) {
            return {
                "status": 404
            };
        }

        let user = users[0];

        let passwordSalt = user.password_salt;
        let passwordFinalForm = user.password;
        let admin = user.admin;

        let passwordFinalWithUserInput = JwtUtil.sha512Password(password, passwordSalt).passwordHash;

        if (passwordFinalWithUserInput.startsWith(passwordFinalForm) == true) {
            let tokenBody = {
                username: username,
                admin: admin
            };
            let token = jwt.sign(tokenBody, config.ACCESS_TOKEN_SECRET, {
                expiresIn: "1h"
            });
            return {
                "status": 200,
                "token": token
            }
        } else {
            res.statusCode = 400;
            res.end('Login unsuccessful');
        }
    }

    async register(username, password) {
        let users = await this.userRepository.getByUsername(username);
        if (users.length > 0) {
            return 400;
        }

        let passInfo = JwtUtil.saltHashPassword(password);
        await this.userRepository.create(username, passInfo.passwordHash, passInfo.salt);

        return 200;
    }
}

module.exports = UserService;
