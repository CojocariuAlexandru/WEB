const onPage = 50;
const numberOfPages = 3620;
let page = 1;
let compiledTemplate;
let dashboardAttacks;
let pageAttacks;

function attacksDashboardInit(node) {
    mainContent.innerHTML = getLoaderHTML();
    compiledTemplate = Handlebars.compile(loadPage(node.template));
    page = 1;

    loadAttacksDashboardPage(page, onPage);
}

function changePage(newPage) {
    if (newPage == page) {
        return;
    }
    newPage = parseInt(newPage);
    loadAttacksDashboardPage(newPage, onPage);
}

function dashboardPageAttacksUpdate(index) {
    if (dashboardAttacks == null || index >= dashboardAttacks.length) {
        return;
    }
    navigateRoot('/attacks-update/' + dashboardAttacks[index].id);
}

function dashboardPageAttacksDelete(index) {
    if (dashboardAttacks == null || index >= dashboardAttacks.length) {
        return;
    }

    let result = confirm("Are you sure?");
    if (result == true) {
        httpDELETE(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + dashboardAttacks[index].id, (result) => {
            dashboardAttacks.splice(index, 1);
            displayAttacksDashboard(dashboardAttacks, page);
        }, (error) => {
            //ALERT
            console.log(error);
        });
    }
}

function loadAttacksDashboardPage(newPage, onPage) {
    httpGET(URL_MICROSERVICE_ATTACKS + '/api/attacks/attacks-dashboard?pageId=' + newPage + '&onPage=' + onPage, (res) => {
        pageAttacks = JSON.parse(res.res);
        dashboardAttacks = pageAttacks;
        displayAttacksDashboard(pageAttacks, newPage);
        page = newPage;
    }, (err) => {
        console.log(err);
    })
}

function displayAttacksDashboard(attacks, page) {
    let type1 = false;
    let type2 = false;
    let type3 = false;
    if (page == 1) {
        type1 = true;
    } else if (page < numberOfPages) {
        type2 = true;
    } else {
        type3 = true;
    }
    let obj = {
        'attacks': attacks,
        'type1': type1,
        'type2': type2,
        'type3': type3,
        'page': page,
        'previousPage': page - 1,
        'nextPage': page + 1
    };
    mainContent.innerHTML = compiledTemplate(obj);
}
