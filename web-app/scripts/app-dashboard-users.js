var users;
var compiledUsersDashboardTemplate;

function usersDashboardInit(node) {
    mainContent.innerHTML = '';

    httpGET(URL_MICROSERVICE_USERS + '/api/users', (response) => {
        users = JSON.parse(response.res);

        console.log(users);

        compiledUsersDashboardTemplate = Handlebars.compile(loadPage(node.template));
        mainContent.innerHTML = compiledUsersDashboardTemplate(users);
    }, (err) => {

    });
}

function removeUser(rowIndex) {
    httpDELETE(URL_MICROSERVICE_USERS + '/api/users/' + users[rowIndex].id, (response) => {
        users.splice(rowIndex, 1);
        mainContent.innerHTML = compiledUsersDashboardTemplate(users);
    }, (err) => {

    });
}

function toggleUserAdmin(rowIndex, value) {
    if (users[rowIndex].admin != value) {
        httpPATCH(URL_MICROSERVICE_USERS + '/api/users/' + users[rowIndex].id,
            JSON.stringify({
                admin: value
            }), (result) => {
                users[rowIndex].admin = value;
                mainContent.innerHTML = compiledUsersDashboardTemplate(users);
            }, (err) => {

            });
    }
}
