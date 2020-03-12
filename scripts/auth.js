let login = true; // boolean flag, true = display login widget, false = display register widget

function changeLogin() {
    if (login) {
        return;
    }
    switchLoginSignup();
}

function changeSignUp() {
    if (!login) {
        return;
    }
    switchLoginSignup();
}

function userLogin() {
    let username = document.querySelector('#login-username').value;
    let pwd = document.querySelector('#login-pwd').value;

    if (userLoginCheckCredentials(username, pwd)) {
        userLoginClearFields();
        userLoginRememberCredentials(username);
        setWebAppTemplateAsSite();
        navigateRoot('/home');
    } else {
        console.log('Error message');
    }
}

function userLoginClearFields() {
    document.querySelector('#login-username').value = '';
    document.querySelector('#login-pwd').value = '';
}

function userLoginRememberCredentials(username) {
    localStorage.setItem('username', username)
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
    localStorage.removeItem('username');
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
}

function signUp() {
    let username = document.querySelector('#register-username').value;
    let pwd = document.querySelector('#register-pwd').value;
    let rpwd = document.querySelector('#register-rpwd').value;

    if (pwd != rpwd) {
        console.log('The passwords don\'t match');
    } else {
        signUpAddUser(username, pwd);
        signUpClearFields();
        switchLoginSignup();
    }
}

function signUpAddUser(username, pwd) {
    let users = JSON.parse(localStorage.getItem('users'));
    if (users == null) {
        users = [];
    }
    users.push({
        'username': username,
        'password': pwd
    });
    localStorage.setItem('users', JSON.stringify(users));
}

function signUpClearFields() {
    document.querySelector('#register-username').value = '';
    document.querySelector('#register-pwd').value = '';
    document.querySelector('#register-rpwd').value = '';
}

function userIsLoggedIn() {
    let user = localStorage.getItem('username');
    if (user == null) {
        return false;
    }
    return true;
}
