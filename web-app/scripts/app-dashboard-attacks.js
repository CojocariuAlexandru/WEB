const onPage = 50;
let page = 1;
let compiledTemplate;
let pageAttacks;

function attacksDashboardInit(node) {
    mainContent.innerHTML = getLoaderHTML();
    compiledTemplate = Handlebars.compile(loadPage(node.template));
    page = 1;

    loadAttacksDashboardPage(page, onPage);
}

function loadAttacksDashboardPage(page, onPage) {
    httpGET(URL_MICROSERVICE_ATTACKS + '/api/attacks/attacks-dashboard?pageId=' + page + '&onPage=' + onPage, (res) => {
        pageAttacks = JSON.parse(res.res);
        mainContent.innerHTML = compiledTemplate(pageAttacks);
    }, (err) => {
        console.log(err);
    })
}
