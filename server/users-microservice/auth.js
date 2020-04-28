const Router = require('./router');
const config = require('./config');
const crypto = require('crypto');
const db = require('./db');
const jwt = require('jsonwebtoken');

router = new Router();

router.addRoute('POST', '/api/login', handleLogin, true);
router.addRoute('POST', '/api/register', handleRegister, true);

router.addRoute('GET', '/api/users', handleGetAll, true);

router.addRoute('PATCH', '/api/users/', handlePatchUser, false);

router.addRoute('DELETE', '/api/users/', handleDeleteUser, false);

async function handleRequest(req, res, body) {
    await router.solve(req, res, body, req.url);
}

async function handleDeleteUser(req, res, body) {
    let userIdStr = req.url.substr('/api/users/'.length);
    if (isNaN(userIdStr)) {
        res.status = 400;
        res.statusMessage = 'Bad Request';
        res.end('Invalid user id');
        return;
    }

    let connection = await db.getDbConnection();
    let userId = parseInt(userIdStr);

    let user = await db.getUserById(connection, userId);
    if (user == null || user[0].length == 0) {
        res.status = 404;
        res.statusMessage = 'Not Found';
        res.end('The user doesn\'t exist');
        return;
    }

    await db.deleteUserById(connection, userId);

    res.status = 204;
    res.statusMessage = 'No Content';
    res.end();
}

async function handlePatchUser(req, res, body) {
    let userIdStr = req.url.substr('/api/users/'.length);
    if (isNaN(userIdStr)) {
        res.status = 400;
        res.statusMessage = 'Bad Request';
        res.end('Invalid user id');
        return;
    }
    if (body == null) {
        res.status = 400;
        res.statusMessage = 'Bad Request';
        res.end('Request body missing');
        return;
    }

    let connection = await db.getDbConnection();
    let userId = parseInt(userIdStr);

    let user = await db.getUserById(connection, userId);
    if (user == null || user[0].length == 0) {
        res.status = 404;
        res.statusMessage = 'Not Found';
        res.end('The user doesn\'t exist');
        return;
    }
    user = user[0][0];
    let oldValue = user.admin;

    if (body['admin'] != undefined) {
        if (body['admin'] == 'true' || body['admin'] == '1') {
            user.admin = 1;
        } else if (body['admin'] == 'false' || body['admin'] == '0') {
            user.admin = 0;
        }
    }
    if (oldValue != user.admin) {
        await db.updateUser(connection, user);
    }

    res.status = 200;
    res.statusMessage = 'Ok';
    res.end('');
}

async function handleGetAll(req, res, body) {
    let connection = await db.getDbConnection();

    let users = await db.getAllUsers(connection);

    res.status = 200;
    res.statusMessage = 'Ok';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users[0]));
}

async function handleLogin(req, res, body) {
    //Getting connection to database
    let connectionToDB = await db.getDbConnection();

    //Verification input is valid
    if (body.username === undefined || body.password === undefined) {
        res.statusCode = 400;
        res.end('You have to specify the username and the password of the user!');
        return;
    }

    if (body.password.length < 6 || body.password.length > 64) {
        res.statusCode = 400;
        res.end('The password has to have at least 6 characters and at most 64 characters!');
        return;
    }

    //Check if a user with that name exists
    let users = await db.getUserByUsername(connectionToDB, body.username);
    if (users.length == 0) {
        res.statusCode = 400;
        res.end('No such user is registered.');
        return;
    }

    //Get the salt and final form after aplying the salt
    let passwordSaltDB = await db.getPasswordSalt(connectionToDB, body.username);
    let passwordFinalFormDB = await db.getPasswordFinalForm(connectionToDB, body.username);
    let adminDB = await db.getAdminFlag(connectionToDB, body.username);

    //Make some processing
    let passwordSalt = JSON.stringify(passwordSaltDB);
    auxArray = passwordSalt.split("\"");
    passwordSalt = auxArray[3];

    let passwordFinalForm = JSON.stringify(passwordFinalFormDB);
    auxArray = passwordFinalForm.split("\"");
    passwordFinalForm = auxArray[3];

    admin = adminDB[0].admin;

    let passwordFinalWithUserInput = sha512Password(body.password, passwordSalt).passwordHash;

    if (passwordFinalWithUserInput.startsWith(passwordFinalForm) == true) {
        let tokenBody = {
            username: body.username,
            admin: admin
        };
        let token = jwt.sign(tokenBody, config.ACCESS_TOKEN_SECRET, {
            expiresIn: "36h"
        });
        res.end(token);
    } else {
        res.statusCode = 400;
        res.end('Login unsuccessful');
    }
}

async function handleRegister(req, res, body) {
    let con = await db.getDbConnection();

    if (body.username === undefined || body.password === undefined) {
        res.statusCode = 400;
        res.end('You have to specify the username and the password of the user!');
        return;
    }

    if (body.password.length < 6 || body.password.length > 64) {
        res.statusCode = 400;
        res.end('The password has to have at least 6 characters and at most 64 characters!');
        return;
    }

    let users = await db.getUserByUsername(con, body.username);
    if (users.length > 0) {
        res.statusCode = 400;
        res.end('An user with the specified username already exists!');
        return;
    }

    let passInfo = saltHashPassword(body.password);
    await db.insertNewUser(con, body.username, passInfo.passwordHash, passInfo.salt);

    res.end('User created successfully!');
}

// https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/?fbclid=IwAR0QbqgLOHe-H3PJjmByQ5dukYrraNgH6_FB81ON_ryRqdXRn41MQChvFZ4
function saltHashPassword(password) {
    let salt = getPasswordSalt(16);
    return sha512Password(password, salt);
}

function sha512Password(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let hashValue = hash.digest('hex').substr(0, 64);
    return {
        salt: salt,
        passwordHash: hashValue
    };
}

function getPasswordSalt(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
// https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/?fbclid=IwAR0QbqgLOHe-H3PJjmByQ5dukYrraNgH6_FB81ON_ryRqdXRn41MQChvFZ4

module.exports = handleRequest;
