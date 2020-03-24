// Main js file for the project

let rootForContent; // when the page is loaded, this will get a reference to the HTML element containing the root of the website
let mainContent; // when the page is loaded, this will get a reference to the HTML element containing the main content of the web app
let webapp; // boolean flag, true = display the web app, false = display the presentation website

// ------------------------------------------------------ Application models -------------------------------------------------

class Attack {
    constructor(id, country, region, numberOfTerrorists, numberOfKills, numberOfWounded, successfullAttack, knownAttackers, weaponsUsed,
        motive, weaponDetails, ransom, otherDetails, latitude, longitude, countryLatitude, countryLongitude) {
        this.id = id;
        this.country = country;
        this.region = region;
        this.numberOfTerrorists = numberOfTerrorists;
        this.numberOfKills = numberOfKills;
        this.numberOfWounded = numberOfWounded;
        this.successfullAttack = successfullAttack;
        this.knownAttackers = knownAttackers;
        this.weaponsUsed = weaponsUsed;
        this.motive = motive;
        this.weaponDetails = weaponDetails;
        this.ransom = ransom;
        this.otherDetails = otherDetails;
        this.latitude = latitude;
        this.longitude = longitude;
        this.countryLatitude = countryLatitude;
        this.countryLongitude = countryLongitude;

    }
}

class ReplaceObject {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}

// ------------------------------------------------------ Fake database ------------------------------------------------------

let attacks = [];

attacks.push(new Attack(1, 'United States', 'New York City', 5, 1384, 8190, 'YES', 'YES', 'Vehicle (not to include vehicle-borne explosives, i.e., car or truck bombs)', 'Unknown', 'The attackers reportedly gained control of the plane using sharp objects resembling knives or other sharpened metal objects. The attackers turned the airplane into a missile when flying it into the North Tower of the World Trade Center Complex. The airplane\'s jet fuel ignited the building and resulted in a massive fire that contributed to the collapse of the North Tower. Mace may have also been used in subduing the passengers and crew members.', 'The crash resulted in the destruction of an American Airlines Boeing 767 aircraft. All personal belongings stowed on the plane were destroyed as well. Also destroyed was the North Tower of the World Trade Center complex in New York City, which collapsed as a result of the impact and subsequent fire. The building\'s collapse undoubtedly damaged the foundation of nearby buildings, though the South Tower had already fallen. Businesses located in the North Tower suffered massive economic losses. Air travel was restricted or prevented in the United States for several months following the attacks. Total losses to the United States Airline industry are unknown, but extremely high. Several major United States airlines were nearly bankrupted in the aftermath of the attacks. The attacks had a negative impact on the U.S. and world economy.', 'This attack was one of four related incidents (cf. 200109110004-07). Three people including two attendants, Karen Martin and Barbara Arestegui, were stabbed or had their throats slashed by the hijackers. American Airlines Flight 11 departed from Boston\'s Logan International Airport at 7:59 am local time. The 9/11 Commission estimated that the hijacking began at 8:14 am. Since the aircraft crashed into the North Tower at 8:46 am, the hijacking lasted 32 minutes. Details on the number of people wounded in the attacks are very difficult to confirm The numbers reported in the GTD are conservative estimates for immediate casualties, first responders, and residents, based on documentation for the September 11th Victims Compensation Fund (VCF).', 40.597132, -73.831351, 40.730610, -73.935242));
attacks.push(new Attack(2, 'Romania', 'Vaslui', 78, 10, 10, 'NO', 'YES', 10, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatisi architecto beatae vitae dicta sunt explicabo. Nemo enim  ad minima veniam, quis nostrum exercitationem ullam corporis  suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?', 41.124, -51.02));

// ------------------------------------------------------- Templating -------------------------------------------------------

function readPage(pageName) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    let filePath = '/pages/' + pageName + '.html';
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

let presentationSitePage = readPage('presentation');
let webAppTemplate = readPage('web-app');
let homePage = readPage('web-app-home.html');
let statisticsPage = readPage('web-app-statistics');
let statisticsDrawingsPage = readPage('web-app-statistics-drawings');
let mapPage = readPage('web-app-map');
let attacksPage = readPage('web-app-attacks');
let attackIdPage = readPage('web-app-id-attack');

function buildArrayOfReplaceObjectsFromObject(obj) {
    let result = [];
    Object.keys(obj).forEach(function (key) {
        result.push(new ReplaceObject(key, obj[key]));
    });
    return result;
}

function buildViewReplaceLabel(template, label, replaceValue) {
    let searchedLabel = '@{{' + label + '}}';

    return template.replace(searchedLabel, replaceValue);
}

function buildView(template, replaceObjects) {
    for (const replaceObject of replaceObjects) {
        console.log(replaceObject);
        template = buildViewReplaceLabel(template, replaceObject.label, replaceObject.value);
    }
    return template;
}

function buildViewFromObject(template, objectToIntegrate) {
    let replaceObjectsArr = buildArrayOfReplaceObjectsFromObject(objectToIntegrate);
    return buildView(template, replaceObjectsArr);
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
homeRoute.template = homePage;
homeRoute.afterCallback = homePageInit;
root.children.push(homeRoute);

//*** Statistics route */
let statisticsRoute = new Route('statistics', true);
statisticsRoute.template = statisticsPage;
statisticsRoute.afterCallback = statisticsPageInit;
root.children.push(statisticsRoute);

//*** Statistics drawings route */
let statisticsDrawingsRoute = new Route('statistics-drawings', true);
statisticsDrawingsRoute.template = statisticsDrawingsPage;
statisticsDrawingsRoute.afterCallback = statisticsDrawingsPageInit;
root.children.push(statisticsDrawingsRoute);

//*** Map route */
let mapRoute = new Route('map', true);
mapRoute.template = mapPage;
mapRoute.afterCallback = mapPageInit;
root.children.push(mapRoute);

//*** Attack/id route */
let thatAttackRoute = new Route(':id', true);
thatAttackRoute.processCallback = function (arg) {
    let attack = this.beforeCallback(arg);
    if (attack != null) {
        this.afterCallback(attack);
    }
}
thatAttackRoute.beforeCallback = attackIdPageBefore;
thatAttackRoute.templateCallback = attackIdPageTemplate;
thatAttackRoute.afterCallback = attackIdPageInit;

//*** Attacks route */
let attacksRoute = new Route('attacks', true);
attacksRoute.template = attacksPage;
attacksRoute.afterCallback = attacksPageInit;
attacksRoute.children.push(thatAttackRoute);
root.children.push(attacksRoute);

// ------------------ Routing logic -------------------------

function updateMainContentRecursive(node, pathParts, index) {
    // Leaf route with parameter
    if (node.url && node.url[0] == ':' && index == pathParts.length && node.leaf === true) {
        node.processCallback(pathParts[index - 1]);
        return false;
    }
    // Leaf route with no parameter
    if (index == pathParts.length && node.leaf === true) {
        mainContent.innerHTML = node.template;
        node.afterCallback();
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
        navigate(window.location.pathname);
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
    rootForContent.innerHTML = presentationSitePage;
    rootForContent.className = "root presentation";
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
    rootForContent.innerHTML = webAppTemplate;
    rootForContent.className = "root web-app";
    mainContent = document.querySelector('#content');
    setWebAppTemplateAsSiteInit();
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

// ------------------------------------------------------- Home page --------------------------------------------------------

function homePageInit() {

}

// ------------------------------------------------------- Statistics page ---------------------------------------------------

function statisticsPageInit() {
    generateWeapons();
    generateAttacks();
    generateTargets();
    generateRegions();
    generateCountries();
    sliderFunction()
}

// ------------------------------------------------------- Statistics drawings page ------------------------------------------

function statisticsDrawingsPageInit() {
    generateRecords();
    generateOtherLists();
}

// ------------------------------------------------------- Map page ----------------------------------------------------------

function mapPageInit() {
    let el = document.querySelector("#mapDiv");
    map = new google.maps.Map(el, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
}

// ------------------------------------------------------- Attacks page ------------------------------------------------------

function attacksPageInit() {

}

function searchAttack() {
    let attackInput = document.querySelector('#searchAttackButton');
    navigateRoot('/attacks/' + attackInput.value);
}

// ------------------------------------------------------- Attack id page ----------------------------------------------------

function attackIdPageBefore(id) {
    let found = false;
    let currentAttack;
    for (let i = 0; i < attacks.length; ++i) {
        if (attacks[i].id == id) {
            currentAttack = attacks[i];
            found = true;
        }
    }
    if (!found) {
        mainContent.innerHTML = 'Error';
        return null;
    }
    mainContent.innerHTML = this.templateCallback(currentAttack);
    return currentAttack;
}

function attackIdPageTemplate(attack) {
    console.log(attack);
    return buildViewFromObject(attackIdPage, attack);
}

function attackIdPageInit(attack) {
    let attackAttack = document.querySelector('#mapAttack');
    map = new google.maps.Map(attackAttack, {
        center: {
            lat: attack.countryLatitude,
            lng: attack.countryLongitude
        },
        zoom: 8
    });

    document.getElementById("ripple-loader-id").style.left = `calc(50% + 5px * ${latitude-countryLatitude})`;
    document.getElementById("ripple-loader-id").style.top = `calc(50% + 5px * ${longitude-countryLongitude})`;  

    map.setOptions({draggable: false});
    let attackData = document.querySelector('#terroristsData');
    if (parseInt(attackData.innerHTML) > 99) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
    attackData = document.querySelector('#killsData');
    if (parseInt(attackData.innerHTML) > 9) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#woundedData');
    if (parseInt(attackData.innerHTML) > 50) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#succesfulAttack');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }

    attackData = document.querySelector('#knownAttackers');
    if (attackData.innerHTML.localeCompare("NO") == 0) {
        attackData.style.color = "red";
    } else {
        attackData.style.color = "green";
    }
}

/***********Attack list **********************/
var numberOfRecords = 10;

function generateRecords() {
    let attackListHead = document.querySelector('.recordList');
    let table = document.createElement('table');
    table.setAttribute('class', 'attacksTable');
    attackListHead.appendChild(table);

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');
    particularRecord.innerHTML = `
                                        <th class='attackID'>ID</th> 
                                        <th class='locationID'>Location</th> 
                                        <th class='dateID'>Date</th>
                                `;
    table.appendChild(particularRecord);
    for (let i = 0; i < numberOfRecords; i++) {
        particularRecord = document.createElement('tr');
        particularRecord.setAttribute('class', 'particularRecord');
        particularRecord.innerHTML = `
                                    <td class='attackID'>Terrorist attack #${i}</td>
                                    <td class='locationID'>Country, Region</td>
                                    <td class='dateID'>YYYY/MM/DD</td>
                                    `;
        if (i % 2 == 1) {
            particularRecord.style.backgroundColor = '#222831';
        }
        table.appendChild(particularRecord);
    }
}

function generateOtherLists() {
    let attackListHead = document.querySelector('.otherLists');
    let otherAttackList = document.createElement('footer');
    let listText = "<p class = 'numberList'> << ";
    for (let i = 0; i * 20 <= numberOfRecords; i++) {
        if (i * 20 + 20 <= numberOfRecords) {
            listText = listText + `${i+1}, `;
        } else {
            listText = listText + `${i+1} >> </p> `;

        }
    }
    otherAttackList.innerHTML = listText;
    attackListHead.appendChild(otherAttackList);
}
