var users;
var compiledUsersDashboardTemplate;

function usersDashboardInit(node) {
    mainContent.innerHTML = '';

    httpGET(URL_MICROSERVICE_USERS + '/api/users', (response) => {
        users = JSON.parse(response.res);

        compiledUsersDashboardTemplate = Handlebars.compile(loadPage(node.template));
        mainContent.innerHTML = compiledUsersDashboardTemplate(users);
    }, (err) => {
        showError('Error! ' + error.res, 2000);
    });
}

function removeUser(rowIndex) {
    let result = confirm("Are you sure?");
    if (result == true) {
        httpDELETE(URL_MICROSERVICE_USERS + '/api/users/' + users[rowIndex].id, (response) => {
            users.splice(rowIndex, 1);
            mainContent.innerHTML = compiledUsersDashboardTemplate(users);
            showSuccess('User removed successfully!', 2000);
        }, (err) => {
            showError('Error! ' + err.res, 2000);
        });
    }
}

function toggleUserAdmin(rowIndex, value) {
    if (users[rowIndex].admin != value) {
        httpPATCH(URL_MICROSERVICE_USERS + '/api/users/' + users[rowIndex].id,
            JSON.stringify({
                admin: value
            }), (result) => {
                users[rowIndex].admin = value;
                mainContent.innerHTML = compiledUsersDashboardTemplate(users);
                showSuccess('User updated successfully!');
            }, (err) => {
                showError('Error! ' + err.res, 2000);
            });
    }
}
