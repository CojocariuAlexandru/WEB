const config = require('./config');
const crypto = require('crypto');
const db = require('./db');
var jwt = require('jsonwebtoken');

async function handleRequest(req, res, body) {
    let goodRequest = false;

    if (req.method === 'POST') {
        if (req.url === '/api/login') {
            goodRequest = true;
            await handleLogin(req, res, body);
        } else if (req.url === '/api/register') {
            goodRequest = true;
            await handleRegister(req, res, body);
        } else if (req.url === '/api/logout') {
            goodRequest = true;
            await handleLogout(req, res, body);
        }
    }

    if (!goodRequest) {
        res.status = 400;
        res.end('Error! Bad Request!');
    }
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

    //Make some processing
    let passwordSalt = JSON.stringify(passwordSaltDB);
    auxArray = passwordSalt.split("\"");
    passwordSalt = auxArray[3];

    let passwordFinalForm = JSON.stringify(passwordFinalFormDB);
    auxArray = passwordFinalForm.split("\"");
    passwordFinalForm = auxArray[3];

    let passwordFinalWithUserInput = sha512Password(body.password, passwordSalt).passwordHash;

    if (passwordFinalWithUserInput.startsWith(passwordFinalForm) == true) {
        let token = jwt.sign(body, 'secret');
        res.end(token);
    } else {
        res.statusCode = 400;
        res.end('Login unsuccessful');
    }
}

async function handleRegister(req, res, body) {
    console.log("WAITING");
    let con = await db.getDbConnection();
    console.log("END");

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

async function handleLogout(req, res, body) {

    res.end();
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
