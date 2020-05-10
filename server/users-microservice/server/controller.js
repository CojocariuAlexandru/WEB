const Router = require('./router');
const JwtHelper = require('./jwt-utils');

router = new Router();

router.addRoute('POST', '/api/login', handleLogin, true, []);
router.addRoute('POST', '/api/register', handleRegister, true, []);

router.addRoute('GET', '/api/users', handleGetAll, true, [JwtHelper.jwtAdminGuard]);

router.addRoute('PATCH', '/api/users/', handlePatchUser, false, [JwtHelper.jwtAdminGuard]);

router.addRoute('DELETE', '/api/users/', handleDeleteUser, false, [JwtHelper.jwtAdminGuard]);

async function handleRequest(req, res, body) {
    await router.solve(req, res, body, req.url);
}

async function handleDeleteUser(req, res, body, userService) {
    let userIdStr = req.url.substr('/api/users/'.length);
    if (isNaN(userIdStr)) {
        res.statusCode = 400;
        res.statusMessage = 'Bad Request';
        res.end('Invalid user id');
        return;
    }

    let userId = parseInt(userIdStr);
    let status = await userService.delete(userId);

    if (status == 404) {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.end('The user doesn\'t exist');
        return;
    } else {
        res.statusCode = 204;
        res.statusMessage = 'No Content';
        res.end();
    }
}

async function handlePatchUser(req, res, body, userService) {
    let userIdStr = req.url.substr('/api/users/'.length);
    if (isNaN(userIdStr)) {
        res.statusCode = 400;
        res.statusMessage = 'Bad Request';
        res.end('Invalid user id');
        return;
    }
    if (body == null || body['admin'] == undefined) {
        res.statusCode = 400;
        res.statusMessage = 'Bad Request';
        res.end('Request body missing or "admin" JSON field missing');
        return;
    }

    let updatedStatus = false;
    if (body['admin'] == 'true' || body['admin'] == '1') {
        updatedStatus = true;
    }
    let userId = parseInt(userIdStr);
    let status = await userService.updateUserStatus(userId, updatedStatus);

    if (status == 404) {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.end('The user doesn\'t exist');
    } else {
        res.statusCode = 200;
        res.statusMessage = 'Ok';
        res.end('User status updated successfully!');
    }
}

async function handleGetAll(req, res, body, userService) {
    let users = await userService.getAll();

    res.statusCode = 200;
    res.statusMessage = 'Ok';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
}

async function handleLogin(req, res, body, userService) {
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

    let statusObj = await userService.login(body.username, body.password);

    if (statusObj["status"] == 404) {
        res.statusCode = 400;
        res.end('No such user is registered.');
    } else if (statusObj["status"] == 400) {
        res.statusCode = 400;
        res.end('Login unsuccessful');
    } else {
        res.end(statusObj["token"]);
    }
}

async function handleRegister(req, res, body, userService) {
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

    let status = await userService.register(body.username, body.password);
    if (status == 400) {
        res.statusCode = 400;
        res.end('An user with the specified username already exists!');
    } else {
        res.statusCode = 200;
        res.end('User created successfully!');
    }
}

module.exports = handleRequest;
