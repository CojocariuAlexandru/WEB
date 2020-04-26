function attackUpdateIdPageInit(node, id) {
    mainContent.innerHTML = '';
    httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + id, (res) => {
        // cod in caz de success
        let parsed = JSON.parse(res.res)[0];
        let compiledTemplate = Handlebars.compile(loadPage(node.template));
        mainContent.innerHTML = compiledTemplate({
            id: parsed.id
        });
    }, (err) => {
        // cod in caz de eroare
    });
}
