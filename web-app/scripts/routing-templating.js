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
    constructor(url, leaf, template, initCallback, children, guards) {
        this.url = url;
        this.leaf = leaf;
        this.template = template;
        this.initCallback = initCallback;
        this.children = children;
        this.guards = guards;
    }
}

class RouteGuard {
    constructor(guardCallback, redirectTo) {
        this.guardCallback = guardCallback;
        this.redirectTo = redirectTo;
    }
}

const adminGuard = new RouteGuard(userIsAdmin, '/home');

class RouteBuilder {
    constructor(url, leaf) {
        this.url = url;
        this.leaf = leaf;
        this.template = null;
        this.initCallback = null;
        this.children = null;
        this.guards = null;
    }

    setTemplate(template) {
        this.template = template;
        return this;
    }

    setInitCallback(initCallback) {
        this.initCallback = initCallback;
        return this;
    }

    setChildren(children) {
        this.children = children;
        return this;
    }

    setGuards(guards) {
        this.guards = guards;
        return this;
    }

    build() {
        return new Route(this.url, this.leaf, this.template, this.initCallback, this.children, this.guards);
    }
}

const homeRoute = new RouteBuilder('home', true)
    .setTemplate('web-app-home')
    .setInitCallback(homePageInit)
    .build();

const statisticsFormRoute = new RouteBuilder('statistics', true)
    .setTemplate('web-app-statistics')
    .setInitCallback(statisticsPageInit)
    .build();

const statisticsResultRoute = new RouteBuilder('statistics-results', true)
    .setTemplate('web-app-statistics-result')
    .setInitCallback(statisticsResultsPageInit)
    .build();

const statistics2DResultsRoute = new RouteBuilder('statistics-results-2D', true)
    .setTemplate('web-app-statistics-result2D')
    .setInitCallback(initStatisticsResult2D)
    .build();

const statisticsDrawingsRoute = new RouteBuilder('statistics-drawings', true)
    .setTemplate('web-app-statistics-drawings')
    .setInitCallback(statisticsDrawingsPageInit)
    .build();

const mapRoute = new RouteBuilder('map', true)
    .setTemplate('web-app-map')
    .setInitCallback(mapPageInit)
    .build();

const attackIdPageRoute = new RouteBuilder(':id', true)
    .setTemplate('web-app-id-attack')
    .setInitCallback(attackIdPageBefore)
    .build();

const attacksPageRoute = new RouteBuilder('attacks', true)
    .setTemplate('web-app-attacks')
    .setInitCallback(attacksPageInit)
    .setChildren([attackIdPageRoute])
    .build();

const attackIdUpdateRoute = new RouteBuilder(':id', true)
    .setTemplate('web-app-update-id-attack')
    .setInitCallback(attackUpdateIdPageInit)
    .build();

const attackIdUpdateRouteParent = new RouteBuilder('attacks-update', false)
    .setChildren([attackIdUpdateRoute])
    .build();

const attacksInsertRoute = new RouteBuilder('attacks-insert', true)
    .setTemplate('web-app-insert-id-attack')
    .setInitCallback(attacksInsertPageInit)
    .build();

const adminPanelRoute = new RouteBuilder('admin', true)
    .setTemplate('web-app-admin-panel')
    .setInitCallback(adminPanelInit)
    .setGuards([adminGuard])
    .build();

const usersDashboardRoute = new RouteBuilder('users-dashboard', true)
    .setTemplate('web-app-dashboard-users')
    .setInitCallback(usersDashboardInit)
    .setGuards([adminGuard])
    .build();

const root = new RouteBuilder('/app', false)
    .setChildren([homeRoute, statisticsFormRoute, statisticsResultRoute, statistics2DResultsRoute, statisticsDrawingsRoute,
        mapRoute, attacksPageRoute, attackIdUpdateRouteParent, attacksInsertRoute, adminPanelRoute, usersDashboardRoute
    ])
    .build();

// ------------------ Routing logic -------------------------

function checkGuards(node) {
    if (node.guards != null) {
        for (let i = 0; i < node.guards.length; ++i) {
            if (!node.guards[i].guardCallback()) {
                return false;
            }
        }
    }
    return true;
}

function updateMainContentRecursive(node, pathParts, index) {
    // Leaf route with parameter
    if (node.url && node.url[0] == ':' && index == pathParts.length && node.leaf === true) {
        if (checkGuards(node)) {
            if (pageIsLoaded(node.template)) {
                node.initCallback(node, pathParts[index - 1]);
            } else {
                asyncLoadPage(node.template, node.initCallback, node, pathParts[index - 1]);
            }
            return false;
        } else {
            return true;
        }
    }
    // Leaf route with no parameter
    if (index == pathParts.length && node.leaf === true && checkGuards(node)) {
        if (checkGuards(node)) {
            if (pageIsLoaded(node.template)) {
                node.initCallback(node);
            } else {
                asyncLoadPage(node.template, node.initCallback, node);
            }
            return false;
        } else {
            return true;
        }
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
