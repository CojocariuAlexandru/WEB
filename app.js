// The routing system was implementing having the following tutorial as a starting point 
// https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573

let mainContent;

let homePage = `
    <section id="home">
        Home Page
    </section>
`;

let statisticsPage = `
    <section id="statistics">
        Statistics Page
    </section>
`;

let mapPage = `
    <section id="map">
        Map Page
    </section>
`;

class routeInfo {
    constructor(template, callback) {
        this.template = template;
        this.callback = callback;
    }
}

let routes = {}

routes['/'] = new routeInfo(homePage, () => {
    console.log('Home page entered');
});

routes['/statistics'] = new routeInfo(statisticsPage, () => {
    console.log('Statistics page entered');
});

routes['/map'] = new routeInfo(mapPage, () => {
    console.log('Map page entered');
});

function updateMainContent(pathName){
    mainContent.innerHTML = routes[pathName].template;
    routes[pathName].callback();
}

function navigate(pathName) {
    window.history.pushState({},
        pathName,
        window.location.origin + pathName
    );
    updateMainContent(pathName);
}

function setContent() {
    mainContent = document.querySelector('#content');
    if (!(window.location.pathname in routes)) {
        window.location.pathname = '/';
    }
    updateMainContent(window.location.pathname);
}

window.onpopstate = () => {
    updateMainContent(window.location.pathname);
}

document.addEventListener('DOMContentLoaded', setContent);
