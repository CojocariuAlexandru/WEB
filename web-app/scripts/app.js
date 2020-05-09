// Main js file for the project

let rootForContent; // when the page is loaded, this will get a reference to the HTML element containing the root of the website
let mainContent; // when the page is loaded, this will get a reference to the HTML element containing the main content of the web app
let webapp; // boolean flag, true = display the web app, false = display the presentation website

// ------------------------------------------- Web App Navigation ---------------------------------------------

function navigate(pathName) {
    window.history.pushState({},
        pathName,
        window.location.origin + pathName
    );
    updateMainContent(pathName);
}

function navigateRoot(pathName) {
    navigate(root.url + pathName);
}

function navigateRootSidebar(pathName) {
    navigateRoot(pathName);
    toggleSidebar();
}

function initPage() {
    rootForContent = document.querySelector('#root');
    if (userIsLoggedIn()) {
        setWebAppTemplateAsSite();
    } else {
        window.history.pushState({},
            root.url + '/presentation',
            window.location.origin + root.url + '/presentation'
        );
        setPresentationTemplateAsSite();
    }
}

window.onpopstate = () => {
    updateMainContent(window.location.pathname);
}

function setPresentationTemplateAsSite() {
    if (pageIsLoaded('presentation')) {
        setPresentationTemplateAsSiteAsync();
    } else {
        asyncLoadPage('presentation', setPresentationTemplateAsSiteAsync);
    }
}

function setPresentationTemplateAsSiteAsync() {
    webapp = false;
    rootForContent.className = "root presentation";
    rootForContent.innerHTML = loadPage('presentation');
    setPresentationTemplateAsSiteInit();
}

function setPresentationTemplateAsSiteInit() {
    document.querySelector('#login-pwd').addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            userLogin();
        }
    });
    document.querySelector('#register-rpwd').addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            signUp();
        }
    })
}

function setWebAppTemplateAsSite() {
    if (pageIsLoaded('web-app')) {
        setWebAppTemplateAsSiteAsync();
    } else {
        asyncLoadPage('web-app', setWebAppTemplateAsSiteAsync);
    }
}

function setWebAppTemplateAsSiteAsync() {
    let compiledTemplate = Handlebars.compile(loadPage('web-app'));
    let userDetails = getDecodedUserToken();

    rootForContent.innerHTML = compiledTemplate({
        admin: userDetails.admin,
        username: userDetails.username
    });

    webapp = true;
    rootForContent.className = "root web-app";
    mainContent = document.querySelector('#content');
    navigate(window.location.pathname);
}

document.addEventListener('DOMContentLoaded', initPage);
window.addEventListener("resize", handleResize);

// ------------------------------------------------------- Web app ----------------------------------------------------------

function toggleSidebar() {
    if (getPageWidth() > 520) {
        return;
    }
    let sidebar = document.querySelector('#web-app-sidebar');
    if (sidebar.style.display === 'flex') {
        sidebar.removeAttribute('style');
    } else {
        sidebar.style.display = 'flex';
        sidebar.style.width = '100%';
        let h1 = getPageHeight(),
            h2 = document.querySelector('.main-wrapper').getBoundingClientRect().height;
        let h = (h1 > h2 ? h1 : h2);
        sidebar.style.height = h + 'px';
    }
}

function handleResize() {
    if (!webapp) {
        return;
    }
    if (getPageWidth() > 520) {
        let sidebar = document.querySelector('#web-app-sidebar');
        sidebar.removeAttribute('style');
    }
}

// https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
function getPageWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function getPageHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function showSuccess(message, time) {
    showAlert(message, 'success', time);
}

function showError(message, time) {
    showAlert(message, 'error', time);
}

function showAlert(message, type, time) {
    removeAlertIfExists();

    let root = document.querySelector('body');

    let alert = document.createElement('div');
    alert.id = 'app-alert';
    alert.innerHTML = getAlertHTML(message, type);

    root.appendChild(alert);

    setTimeout((alert) => {
        if (alert != null && alert.parentNode != null) {
            alert.parentNode.removeChild(alert);
        }
    }, time, alert);
}

function removeAlertIfExists() {
    let alert = document.querySelector('#app-alert');
    if (alert != null) {
        alert.parentNode.removeChild(alert);
    }
}

function getAlertHTML(message, type) {
    return `<div class="app-alert-body ${type}">
        <i class="fa fa-remove" onclick="removeAlertIfExists()"></i>
        ${message}
        </div>`
}

function getLoaderHTML() {
    return '<div class="loader-wrapper"> <div class="loader"></div> </div>';
}