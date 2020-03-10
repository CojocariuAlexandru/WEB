// Main js file for the project

let rootForContent; // when the page is loaded, this will get a reference to the HTML element containing the root of the web app
let mainContent; // when the page is loaded, this will get a reference to the HTML element containing the main content of the web app

// ------------------------------------------------------ Application models -------------------------------------------------

class Attack {
    constructor(id, latitude, langitude) {
        this.id = id;
        this.latitude = latitude;
        this.langitude = langitude;
    }
}

// ------------------------------------------------------ Fake database ------------------------------------------------------

let attacks = [];

attacks.push(new Attack(1, 18.456792, -69.9512));
attacks.push(new Attack(2, 19.37189, -99.0866));
attacks.push(new Attack(3, 15.4786, -120.5997));

// ------------------------------------------------------ Templates ----------------------------------------------------------

let homePage = `
<section id="home">
    <div class="left-container" onclick="navigate('/statistics')">
        <img src="/img/web-app-home-plot.png">
        <div class="description">
            <span class="title">
                Detailed statistics about attacks
            </span>
            <span class="text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Sit saepe quidem, aspernatur quis earum cum cupiditate consectetur? Perferendis, 
            </span>
        </div>
    </div>
    <div class="right-container" onclick="navigate('/map')">
        <img src="/img/web-app-home-map.png">
        <div class="description">
            <span class="title">
                Exact location on the map
            </span>
            <span class="text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Sit saepe quidem, aspernatur quis earum cum cupiditate consectetur? Perferendis, 
            </span>
        </div>
    </div>
</section>
`;

let statisticsPage = `
<div class='statisticsForm'>
    <!-- <section class='videoContainer'>
     <video autoplay muted loop id="myVideo">
         <source src="soldiers.mp4" type="video/mp4">
     </video>
 </section> -->

    <h1>Terrorism record search</h1>

    <div class='firstRow1'>
        <div class='dateForm'>
            <label for='dateInput' id='textDateInterval'><b>Date Interval:</b></label>
            <input type='date' id='dateInput'></input>
            <span>-</span>
            <input type='date' id='dateInput'></input>
        </div>
    </div>
    <div class='firstRow2'>
        <div class='nrTerrForm'>
            <label for='nrTerrInput'><b>Number of terrorists:</b></label>
            <input type='text' id='nrTerrInput'></input>
            <span>-</span>
            <input type='text' id='nrTerrInput'></input>
        </div>
        <div class='nrDeathsForm'>
            <label for='nrDeathsInput'><b>Number of deaths:</b></label>
            <input type='text' id='nrDeathsInput'></input>
            <span>-</span>
            <input type='text' id='nrDeathsInput'></input>
        </div>
        <div class='nrWoundedForm'>
            <label for='nrWoundedInput'><b>Number of wounded:</b></label>
            <input type='text' id='nrWoundedInput'></input>
            <span>-</span>
            <input type='text' id='nrWoundedInput'></input>
        </div>
    </div>

    <div class='secondRow'>
        <div class='attackTypeForm'>
            <!-- Attack list is generated in actions.js-->
        </div>
        <div class='targetTypeForm'>
            <!-- Target list is generated in actions.js-->
        </div>
        <div class='weaponTypeForm'>
            <!-- Weapon list is generated in actions.js-->
        </div>
        <div class='damageForm'>
            <label><b>Amount of damage made</b></label>
            <br>
            <input type='radio' id='minorDamage' name='amountDamage'>Minor damages</input>
            <br>
            <input type='radio' id='majorDamage' name='amountDamage'>Major damages</input>
            <br>
            <input type='radio' id='catastrophicDamage' name='amountDamage'>Catastrophic damages</input>
            <br>
            <input type='radio' id='unknownDamage' name='amountDamage'>Unknown damages</input>
        </div>
    </div>

    <div class='thirdRow'>
        <div class='regionForm'>
            <!-- Region list is generated in actions.js-->
        </div>
        <div class='countryForm'>
            <!-- Country list is generated in actions.js-->
        </div>
    </div>

    <div class='fourthRow'>
        <div class='successForm'>
            <label for='succesInput'><b>Successfull attack</b></label>
            <input type='checkbox' id='succesInput'></input>
        </div>
        <div class='knownForm'>
            <label for='knownInput'><b>It is known who attacked</b></label>
            <input type='checkbox' id='knownInput'></input>
        </div>
    </div>
    <section class='submitForm'>
        <input type='button' value='Submit' id='submitButton'> </input>
    </section>
</div>
`;

let mapPage = `
    <div id="mapDiv"></div>
`;

let attacksPage = `
    <div id="attacksPage">
        <div class="searchAnAttack">
            <div>
                View detailed information about an attack
            </div>
            <div class="searchZone">
                <div class="inputZone">
                    <label for="searchAttackButton">Attack id</label>
                    <input type="text" id="searchAttackButton">
                </div>
            <button onclick="searchAttack()">Search</button>
            </div>
        </div>
        <div class="mostInterestingAttacks">
            The most interesting attacks
        </div>
    </div>
`;

// ---------------------------------------------------- Routing -------------------------------------------------------------
// The routing system was implementing having the following tutorial as a starting point 
// https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573

class route {
    constructor(url) {
        this.url = url;
        this.children = [];
    }
}

let root = new route('');

let homeRoute = new route('home');
homeRoute.template = homePage;
homeRoute.afterCallback = () => {
    console.log('Entered home');
};
root.children.push(homeRoute);

let statisticsRoute = new route('statistics');
statisticsRoute.template = statisticsPage;
statisticsRoute.afterCallback = () => {
    generateWeapons();
    generateAttacks();
    generateTargets();
    generateRegions();
    generateCountries();
}
root.children.push(statisticsRoute);

let mapRoute = new route('map');
mapRoute.template = mapPage;
mapRoute.afterCallback = () => {
    let el = document.querySelector("#mapDiv");
    map = new google.maps.Map(el, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
}
root.children.push(mapRoute);

let thatAttackRoute = new route(':id');
thatAttackRoute.processCallback = function (arg) {
    this.beforeCallback(arg);
    this.afterCallback();
}
thatAttackRoute.beforeCallback = function (id) {
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
        return;
    }
    mainContent.innerHTML = this.templateCallback(currentAttack);
}

thatAttackRoute.templateCallback = function (attack) {
    return `
                <div class='thatAttackGrid'>
                    <div class='attackHeader'>
                        <h1>Terrorist attack #ID description</h1>
                        <h3>Region, Subregion - YYYY/MM/DD</h3>
                    </div>
                    <div class='attackAbout'>
                        <h4> About </h4>
                        <ul>
                            <li>Country: Romania</li>
                            <li>Region: Vaslui</li>
                            <li>Number of terrorists: 100</li>
                            <li>Number of kills: 10</li>
                            <li>Number of wounded: 10</li>
                            <li>Succesful attack: NO</li>
                            <li>Known attackers: YES</li>
                            <li>Weapons used: ciomag, sticla de tuica</li>
                        </ul>
                    </div>
                    
                    <div id='mapAttack'>
                    </div>
                    
                    <div class='attackDetailTitle1'>
                        <h3>Motive</h3>
                    </div>
                    <div class='attackDetailTitle2'>
                        <h3>Weapon details</h3>
                    </div>
                    <div class='attackDetailTitle3'>
                        <h3>Ransom</h3>
                    </div>
                    

                    <div class='attackDetailText1'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    </div>
                    
                    <div class='attackDetailText2'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    </div>

                    <div class='attackDetailText3'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                     </div>

                     <div class='attackOtherDetailsHeading'>
                        <h2>Other details</h2>
                    </div>

                    <div class='attackOtherDetails'>
                         <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                         </p>
                     </div>
                </div>
            `;
}

thatAttackRoute.afterCallback = function() {
    let attackAttack = document.querySelector('#mapAttack');
    map = new google.maps.Map(attackAttack, {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
}

let attacksRoute = new route('attacks');
attacksRoute.template = attacksPage;
attacksRoute.afterCallback = () => {
    console.log('Attacks page entered');
}
attacksRoute.children.push(thatAttackRoute);
root.children.push(attacksRoute);

function updateMainContentRecursive(node, pathParts, index) {
    // Leaf route with parameter
    if (node.url && node.url[0] == ':' && index == pathParts.length) {
        node.processCallback(pathParts[index - 1]);
        return false;
    }
    // Leaf route with no parameter
    if (index == pathParts.length) {
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
    if (pathParts[0] === root.url) {
        redirect = updateMainContentRecursive(root, pathParts, 1);
    } else {
        redirect = true;
    }
    if (redirect) {
        navigate(root.url + '/home');
    }
}

function navigate(pathName) {
    window.history.pushState({},
        pathName,
        window.location.origin + pathName
    );
    updateMainContent(pathName);
}

function initPage() {
    rootForContent = document.querySelector('#root');
    if (userIsLoggedIn()){
        setWebAppTemplateAsSite();
        navigate(root.url+'/home');
    } else {
        setPresentationTemplateAsSite();
    }
}

window.onpopstate = () => {
    updateMainContent(window.location.pathname);
}

document.addEventListener('DOMContentLoaded', initPage);

function userLogin(){
    setWebAppTemplateAsSite();
    navigate(root.url+'/home');
}

function userIsLoggedIn(){
    return true;
}

function setPresentationTemplateAsSite(){
    rootForContent.innerHTML = presentationSiteTemplate;
    rootForContent.className = "root presentation";
}

function setWebAppTemplateAsSite(){
    rootForContent.innerHTML = webAppTemplate;
    rootForContent.className = "root web-app";
    mainContent = document.querySelector('#content');
}

let login = true;

function changeLogin(){
    if (login){
        return;
    }
    switchLoginSignup();
}

function changeSignUp(){
    if (!login){
        return;
    }
    switchLoginSignup();
}

function switchLoginSignup(){
    let loginComponent = document.querySelector('#login-component');
    let signupComponent = document.querySelector('#sign-up-component');
    if (login){
        loginComponent.style.display = 'none';
        signupComponent.style.display = 'block';
        login = false;
    } else {
        loginComponent.style.display = 'block';
        signupComponent.style.display = 'none';
        login = true;
    }
}

function signUp(){
    let username = 'random';
    let pwd = 'parola';

    let users = JSON.parse(localStorage.getItem('users'));
    console.log(users);
    if (users == null){
        users = [];
    }
    users.push({
        'username':username,
        'password':pwd
    });
    localStorage.setItem('users', JSON.stringify(users));
    switchLoginSignup();
}

// ----------------------------------------------- Statistics form ----------------------------------------------------------

function generateWeapons() {
    let weaponForm = document.querySelector('.weaponTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Weapon1', 'Weapon2', 'Weapon3', 'Weapon4', 'Weapon5', 'Weapon6', 'Weapon7', 'Weapon8', 'Weapon9']
    weaponFormTitle.innerHTML = `<b>Weapon Type</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateAttacks() {
    let weaponForm = document.querySelector('.attackTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Attack1', 'Attack2', 'Attack3', 'Attack4', 'Attack5', 'Attack6', 'Attack7', 'Attack8', 'Attack9']
    weaponFormTitle.innerHTML = `<b>Attack Type</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateTargets() {
    let weaponForm = document.querySelector('.targetTypeForm')
    let weaponFormTitle = document.createElement('label')
    let weaponList = ['Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8', 'Target9']
    weaponFormTitle.innerHTML = `<b>Who was the target</b>`
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<br>`
    let index = 0;
    for (index = 0; index < weaponList.length; index++)
        weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + ` <input type='radio'>${weaponList[index]}</input> <br>`
    weaponForm.appendChild(weaponFormTitle)
}

function generateRegions() {
    let regionForm = document.querySelector('.regionForm')
    let regionFormTitle = document.createElement('label')
    let regionOptionChoose = document.createElement('datalist');
    regionOptionChoose.setAttribute('id', 'allRegions')
    let regionList = ['Central America & Caribbean', 'Eastern Europe', 'Middle East & North Africa', 'North America', 'South America', 'Southeast Asia',
        'Sub-Saharan Africa', 'Western Europe'
    ]
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<b>Region of the attack</b> <br>
                                                            <input list='allRegions'>`
    let index = 0;
    for (index = 0; index < regionList.length; index++)
        regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
    regionFormTitle.appendChild(regionOptionChoose)
    regionForm.appendChild(regionFormTitle)
}

// -------------------------------------------------- Attacks page --------------------------------------------------

function searchAttack() {
    let attackInput = document.querySelector('#searchAttackButton');
    navigate('/attacks/' + attackInput.value);
}

//***************************************************Pages Templates*******************************************************/

let presentationSiteTemplate = `
<header>
    <div class="nav">
        <img src="img/icon.png" alt="icon">
        <h3>
            TeVi
        </h3>
        <ul>
            <li><a onclick="changeLogin()">Login</a></li>
            <li id="signup" onclick="changeSignUp()"><a>SignUp</a></li>
            <li id="about"><a href="">About</a></li>
            <li><a href="">Contact</a></li>
        </ul>
    </div>
</header>

<div class="grid-container">
    <div class="login">
        <span class="background"></span>>
        <div class="widget-login widget" id="login-component">

            <h2 class="title">Login</h2>

            <form>
                <label for="username"><i class="fa fa-user-circle-o" style="font-size:24px"></i>Username:</label>
                <input type="text" id="username" name="username">
                <label for="pwd"><i class="fa fa-eye-slash" style="font-size:24px"></i>Password:</label>
                <input type="password" id="pwd" name="pwd">
                <input type="button" value="Sign In" onclick="userLogin()">
            </form>
            <p>Not a member?</p><a onclick="changeSignUp()">SignUp now</a>

        </div>
        <div class="widget-sign-up widget" id="sign-up-component">

            <h2 class="title">Sign Up</h2>

            <form>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username">
                <label for="pwd">Password:</label>
                <input type="password" id="pwd" name="pwd">
                <label for="rpwd">Password again:</label>
                <input type="repeatpassword" id="rpwd" name="rpwd">
                <input type="button" value="Submit" onclick="signUp()">
            </form>
        </div>
    </div>
    <div class="art">
        <!-- <img src="img/img2.svg" alt="imagine">  -->
    </div>
    <div class="about">
        <h2 class="title">
                Abous us
            </h2>
        <div class='about-body'>
            <p>
                <span></span> We devised a Web application for visualizing and creating statistics based on terrorist attacks in the last 50 years. It features a registration system for users, statistics generated based on custom options and a map visualizer. The app uses and processes hundred of thousands of terrorist attack records.
            </p>
            <p> <span></span>Having the records of terrorist attacks requested, the application is able to generate all kinds of statistics, from piecharts showing the most preferate countries as targets for attacks, to histograms and representations that can depict the success rate of the attack, the amplitude of damages made and so on. The user can get custom statistics based on a completion of a form. Based on the given input, by the user, the application is able to make specific queries to the database.
            </p>
        </div>

    </div>
    <div class="col-1">
        <img src="img/image2.png" alt="">
        <p><span></span> These powerful illustrations can be really handy for understanding any patterns involving terrorist attacks, and can be featured on thematic presentations.
        </p>
    </div>
    <div class="col-2">
        <img src="img/image.png" alt="">
        <p><span></span>Another feature is the world map, modified such that it illustrates the kind of attacks requested by the user. The exact locations of the attacks will be pin-pointed based on this geographic coordinates.
        </p>

    </div>
    <div class="col-3">
        <img src="img/image3.png" alt="">
        <p><span></span> Any graphic element generated (map or statistics) can be externally exported to the formats: png, jpg. The attacks with all the information included can be exported in csv format.
        </p>

    </div>

    <div class="us">
        <h2 class="title">
                Our team
            </h2>
        <div class='us-body'>
            <p>
                <span></span> We are the best team eveeer! Three students at FII.

            </p>
        </div>

    </div>
    <div class="profil1">
        <span class="background1"></span>
        <img src="img/ramo.png" alt="">
        <p>“Creativity Is Intelligence Having Fun.”
        </p>
        <p>Ramona Albert
            <a href="https://www.facebook.com/albert.ramona">
                <i class="fa fa-facebook-square"></i>
            </a>
            <a class="mail" href="mailto:albert.ramona99@gmail.com">
                <i class="fa fa-envelope"></i>
            </a>
        </p>
    </div>
    <div class="profil2">
        <img src="img/olo.png" alt="Oloieri Alexandru">
        <p>"Push yourself, because no one else is going to do it for you."
        </p>
        <p>Oloieri Alexandru
            <a href="https://www.facebook.com/alexandru.oloieri.3">
                <i class="fa fa-facebook-square"></i>
            </a>
            <a class="mail" href="mailto:alexoloieri2014@gmail.com">
                <i class="fa fa-envelope"></i>
            </a>
        </p>

    </div>
    <div class="profil3">
        <img src="img/alex.png" alt="">
        <p>"Do not be overheard complaining. Not even to yourself."</p>
        <p>Cojocariu Alexandru
            <a href="https://www.facebook.com/profile.php?id=100014694300615">
                <i class="fa fa-facebook-square"></i>
            </a>
            <a class="mail" href="mailto:cojocariualexandru1@gmail.com">
                <i class="fa fa-envelope"></i>
            </a>
        </p>
    </div>

    <div class="links">
        <h3>Links:</h3>
        <ul>
            <li><i class="fa fa-database"></i> <a href="https://www.kaggle.com/START-UMD/gtd">Data base</a></li>
            <li><i class="fa fa-desktop"></i> <a href="https://www.info.uaic.ro/">Faculty of Computer Science</a></li>
        </ul>
    </div>
    <div class="contact">
        <h3>Contact:</h3>
        <ul>
            <li><i id="icon" class="fa fa-briefcase"></i><span class="number">+40 232 201090</span></li>
            <li id="adresa" class="adress"><i class="fa fa-mobile"></i>Faculty of Computer Science, General Berthelor Street, nr. 16, IAŞI, Postal Code 700483, ROMANIA</li>
        </ul>
    </div>
</div>
`;

let webAppTemplate = `
<aside>
    <div class="title">
        TeVi
    </div>
    <div class="options">
        <div class="option" onclick="navigate('/home')">
            <span class="icon">
                    <i class="fa fa-home"></i>
                </span>
            <span class="text">
                    Home
                </span>
        </div>
        <div class="option" onclick="navigate('/statistics')">
            <span class="icon">
                    <i class="fa fa-pie-chart"></i>
                </span>
            <span class="text">
                    Statistics
                </span>
        </div>
        <div class="option" onclick="navigate('/map')">
            <span class="icon">
                    <i class="fa fa-map-marker"></i>
                </span>
            <span class="text">
                    Map
                </span>
        </div>
        <div class="option" onclick="navigate('/attacks')">
            <span class="icon">
                    <i class="fa fa-fighter-jet"></i>
                </span>
            <span class="text">
                    Attacks
                </span>
        </div>
    </div>
</aside>

<div class="main-wrapper">
    <header id="usernameContainer">
    </header>
    <main id="content">
    </main>
</div>
`;

function generateCountries() {
    let regionForm = document.querySelector('.countryForm')
    let regionFormTitle = document.createElement('label')
    let regionOptionChoose = document.createElement('datalist');
    regionOptionChoose.setAttribute('id', 'allCountries')
    let regionList = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan (Province of China)",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands"
    ];
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<b>Country</b> <br>
                                                            <input list='allCountries'>`
    let index = 0;
    for (index = 0; index < regionList.length; index++)
        regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
    regionFormTitle.appendChild(regionOptionChoose)
    regionForm.appendChild(regionFormTitle)
} 