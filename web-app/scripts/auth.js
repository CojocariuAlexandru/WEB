let login = true; // boolean flag, true = display login widget, false = display register widget

function getUserToken() {
    let token = localStorage.getItem('Token');
    if (token == null) {
        return null;
    }
    return token;
}

function getDecodedUserToken() {
    let token = getUserToken();
    if (token == null) {
        return null;
    }
    return jwt_decode(token);
}

function changeLogin() {
    if (!login) {
        switchLoginSignup();
    }
}

function changeSignUp() {
    if (login) {
        switchLoginSignup();
    }
}

function userLogin() {
    let username = document.querySelector('#login-username').value;
    if (!validateString(username, 3, 64)) {
        showError('The username has to have between 3 and 64 characters', 3000);
        return;
    }
    let pwd = document.querySelector('#login-pwd').value;
    if (!validateString(pwd, 6, 64)) {
        showError('The password has to have between 6 and 64 characters', 3000);
        return;
    }

    signInUser(username, pwd, (res) => {
        showSuccess('You have successfully logged in!', 2500, () => {
            saveUserToken(res.res);
            userLoginClearFields();
            setWebAppTemplateAsSite();
            navigateRoot('/home');
        })
    }, (err) => {
        showError(err.res, 2500);
    });
}

function saveUserToken(token) {
    localStorage.setItem('Token', token);
}

function signInUser(username, pwd, onSuccess, onError) {
    let loginObj = {
        username: username,
        password: pwd
    };

    httpPOST(URL_MICROSERVICE_USERS + '/api/login', JSON.stringify(loginObj), (res) => {
        onSuccess(res)
    }, (err) => {
        onError(err)
    })
}

function userLoginClearFields() {
    document.querySelector('#login-username').value = '';
    document.querySelector('#login-pwd').value = '';
}

function userLoginCheckCredentials(username, pwd) {
    let users = JSON.parse(localStorage.getItem('users'));
    if (users) {
        for (let i = 0; i < users.length; ++i) {
            if (users[i]['username'] === username && users[i]['password'] === pwd) {
                return true;
            }
        }
    }
    return false;
}

function userLogout() {
    userLogoutRemoveCredentials();
    window.history.pushState({},
        root.url + '/presentation',
        window.location.origin + root.url + '/presentation'
    );
    setPresentationTemplateAsSite();
}

function userLogoutRemoveCredentials() {
    localStorage.removeItem('Token');
}

function switchLoginSignup() {
    let loginComponent = document.querySelector('#login-component');
    let signupComponent = document.querySelector('#sign-up-component');
    if (login) {
        loginComponent.style.display = 'none';
        signupComponent.style.display = 'block';
    } else {
        loginComponent.style.display = 'block';
        signupComponent.style.display = 'none';
    }
    login = !login;
    document.querySelector('#empty').scrollIntoView();
}

function signUp() {
    let username = document.querySelector('#register-username').value;
    if (!validateString(username, 3, 64)) {
        showError('The username has to have between 3 and 64 characters!', 3000);
        return;
    }
    let pwd = document.querySelector('#register-pwd').value;
    if (!validateString(pwd, 6, 64)) {
        showError('The password has to have between 6 and 64 characters!', 3000);
        return;
    }
    let rpwd = document.querySelector('#register-rpwd').value;
    if (pwd != rpwd) {
        showError('The passwords don\'t match!', 3000);
        return;
    }

    signUpAddUser(username, pwd, () => {
        showSuccess('Account created successfully!', 2000, () => {
            signUpClearFields();
            switchLoginSignup();
        });
    }, (err) => {
        showError(err.res, 2500);
    });
}

function signUpAddUser(username, pwd, onSuccess, onError) {
    let registerObj = {
        username: username,
        password: pwd
    };

    httpPOST(URL_MICROSERVICE_USERS + '/api/register', JSON.stringify(registerObj), () => {
        onSuccess();
    }, (err) => {
        onError(err);
    });
}

function signUpClearFields() {
    document.querySelector('#register-username').value = '';
    document.querySelector('#register-pwd').value = '';
    document.querySelector('#register-rpwd').value = '';
}

function userIsLoggedIn() {
    let user = localStorage.getItem('Token');
    if (user == null) {
        return false;
    }
    return true;
}

function userIsAdmin() {
    let decodedToken = getDecodedUserToken();
    if (decodedToken != null && decodedToken.admin == 1) {
        return true;
    }
    return false;
}

function tokenIsExpired() {
    let decodedToken = getDecodedUserToken();
    if (decodedToken == null) {
        return true;
    }

    if (Date.now() >= decodedToken.exp * 1000) {
        return true;
    }
    return false;
}
