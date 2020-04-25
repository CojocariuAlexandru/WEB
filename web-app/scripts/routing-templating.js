// ------------------------------------------------------- Templating -------------------------------------------------------

let pages = {};

function pageIsLoaded(pageName) {
    return (pageName in pages);
}

function asyncLoadPage(pageName, callback, param1, param2) {
    let xmlhttp = new XMLHttpRequest();
    let pagePath = '/pages/' + pageName + '.html';
    xmlhttp.open("GET", pagePath);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            pages[pageName] = xmlhttp.responseText;
            callback(param1, param2);
        }
    }
}

function loadPage(pageName) {
    return pages[pageName];
}

// ---------------------------------------------------- Routing -------------------------------------------------------------
// The routing system was implementing having the following tutorial as a starting point 
// https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573

class Route {
    constructor(url, leaf) {
        this.url = url;
        this.children = [];
        this.leaf = leaf;
    }
}

let root = new Route('/app', false);

// ------------------ Web app routes -------------------------

//*** Home route */
let homeRoute = new Route('home', true);
homeRoute.template = 'web-app-home';
homeRoute.initCallback = homePageInit;
root.children.push(homeRoute);

//*** Statistics route */
let statisticsRoute = new Route('statistics', true);
statisticsRoute.template = 'web-app-statistics';
statisticsRoute.initCallback = statisticsPageInit;
root.children.push(statisticsRoute);

let statisticsResultsRoute = new Route('statistics-results', true);
statisticsResultsRoute.template = 'web-app-statistics-result';
statisticsResultsRoute.initCallback = statisticsResultsPageInit;
root.children.push(statisticsResultsRoute);

let statistics2DResultsRoute = new Route('statistics-results-2D', true);
statistics2DResultsRoute.template = 'web-app-statistics-result2D';
statistics2DResultsRoute.initCallback = initStatisticsResult2D;
root.children.push(statistics2DResultsRoute);

//*** Statistics drawings route */
let statisticsDrawingsRoute = new Route('statistics-drawings', true);
statisticsDrawingsRoute.template = 'web-app-statistics-drawings';
statisticsDrawingsRoute.initCallback = statisticsDrawingsPageInit;
root.children.push(statisticsDrawingsRoute);

//*** Map route */
let mapRoute = new Route('map', true);
mapRoute.template = 'web-app-map';
mapRoute.initCallback = mapPageInit;
root.children.push(mapRoute);

//*** Attack/id route */
let thatAttackRoute = new Route(':id', true);
thatAttackRoute.template = 'web-app-id-attack';
thatAttackRoute.initCallback = attackIdPageBefore;

//*** Attacks route */
let attacksRoute = new Route('attacks', true);
attacksRoute.template = 'web-app-attacks';
attacksRoute.initCallback = attacksPageInit;
attacksRoute.children.push(thatAttackRoute);
root.children.push(attacksRoute);



// ------------------ Routing logic -------------------------

function updateMainContentRecursive(node, pathParts, index) {
    // Leaf route with parameter
    if (node.url && node.url[0] == ':' && index == pathParts.length && node.leaf === true) {
        if (pageIsLoaded(node.template)) {
            node.initCallback(node, pathParts[index-1]);
        } else {
            asyncLoadPage(node.template, node.initCallback, node, pathParts[index-1]);
        }
        return false;
    }
    // Leaf route with no parameter
    if (index == pathParts.length && node.leaf === true) {
        if (pageIsLoaded(node.template)) {
            node.initCallback(node);
        } else {
            asyncLoadPage(node.template, node.initCallback, node);
        }
        return false;
    }
    if (node.children != null) {
        for (let i = 0; i < node.children.length; ++i) {
            if (node.children[i].url === pathParts[index] || node.children[i].url[0] == ':') {
                return updateMainContentRecursive(node.children[i], pathParts, index + 1);
            }
        }
    }
    // No match, redirect
    return true;
}

function updateMainContent(pathName) {
    let pathParts = pathName.split('/');
    let redirect = false;

    let rootAdd = getPathToAdd();
    let toMatch = getPathToMatch();

    if (pathParts[0 + rootAdd] === toMatch) {
        redirect = updateMainContentRecursive(root, pathParts, 1 + rootAdd);
    } else {
        redirect = true;
    }
    if (redirect && webapp) {
        navigateRoot('/home');
    }
}

function getPathToMatch() {
    let toMatch;
    let lastSlashIndex = root.url.lastIndexOf('/');
    if (lastSlashIndex == -1) {
        toMatch = '';
    } else {
        toMatch = root.url.substr(lastSlashIndex + 1);
    }
    return toMatch;
}

function getPathToAdd() {
    let result = 0;
    for (let i = 0; i < root.url.length; ++i) {
        if (root.url[i] === '/') {
            ++result;
        }
    }
    return result;
}
