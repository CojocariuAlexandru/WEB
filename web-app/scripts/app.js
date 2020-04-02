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
    webapp = false;
    rootForContent.className = "root presentation";
    if (pageIsLoaded('presentation')) {
        setPresentationTemplateAsSiteAsync();
    } else {
        asyncLoadPage('presentation', setPresentationTemplateAsSiteAsync);
    }
}

function setPresentationTemplateAsSiteAsync() {
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
    webapp = true;
    rootForContent.className = "root web-app";
    if (pageIsLoaded('web-app')) {
        setWebAppTemplateAsSiteAsync();
    } else {
        asyncLoadPage('web-app', setWebAppTemplateAsSiteAsync);
    }
}

function setWebAppTemplateAsSiteAsync() {
    rootForContent.innerHTML = loadPage('web-app');
    mainContent = document.querySelector('#content');
    setWebAppTemplateAsSiteInit();
    navigate(window.location.pathname);
}

function setWebAppTemplateAsSiteInit() {
    let username = localStorage.getItem('username');
    let usernameContainer = document.querySelector('#web-app-username');
    usernameContainer.innerHTML = username;
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
