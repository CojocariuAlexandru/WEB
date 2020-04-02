function statisticsPageInit(node) {
  mainContent.innerHTML = loadPage(node.template);

  generateWeapons();
  generateAttacks();
  generateTargets();
  generateRegions();
  generateCountries();
  sliderFunction()
}

function sendStatisticsRequest() {
  let successInput = document.querySelector('#succesInput');

  let filters = {
    success: `${successInput.checked}`
  };

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8001/api/attacks", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(filters));

  navigateRoot('/statistics-results');
}

function generateWeapons() {
  let weaponForm = document.querySelector('.weaponTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Weapon Type';
  weaponForm.appendChild(weaponFormHeader)

  let weaponFormTitle = document.createElement('div')
  let weaponList = ['Biological', 'Chemical', 'Vehicles', 'Explosives', 'Firearms', 'Weapon6', 'Weapon7', 'Unknown']
  weaponFormTitle.innerHTML = ``
  let index = 0;
  for (index = 0; index < weaponList.length; index++)
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="weapon-box-` + index + `">` +
    `<label for="weapon-box-` + index + `">${weaponList[index]}</label></div>`;
  weaponForm.appendChild(weaponFormTitle)
}

function generateAttacks() {
  let weaponForm = document.querySelector('.attackTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Attack Type';
  weaponForm.appendChild(weaponFormHeader)

  let weaponFormTitle = document.createElement('div')
  let weaponList = ['Attack1', 'Attack2', 'Attack3', 'Attack4', 'Attack5', 'Attack6', 'Attack7', 'Attack8']
  weaponFormTitle.innerHTML = ``
  let index = 0;
  for (index = 0; index < weaponList.length; index++)
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="attack-box-` + index + `">` +
    `<label for="attack-box-` + index + `">${weaponList[index]}</label></div>`;
  weaponForm.appendChild(weaponFormTitle)
}

function generateTargets() {
  let weaponForm = document.querySelector('.targetTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Target Type';
  weaponForm.appendChild(weaponFormHeader)

  let weaponFormTitle = document.createElement('div')
  let weaponList = ['Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8']
  weaponFormTitle.innerHTML = ``
  let index = 0;
  for (index = 0; index < weaponList.length; index++)
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="target-box-` + index + `">` +
    `<label for="target-box-` + index + `">${weaponList[index]}</label></div>`;
  weaponForm.appendChild(weaponFormTitle)
}

function generateRegions() {
  let regionForm = document.querySelector('.regionForm')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Region of the attack';
  regionForm.appendChild(weaponFormHeader)

  let regionFormTitle = document.createElement('div')
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allRegions')
  let regionList = ['Central America & Caribbean', 'Eastern Europe', 'Middle East & North Africa', 'North America', 'South America', 'Southeast Asia',
    'Sub-Saharan Africa', 'Western Europe'
  ]
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input list='allRegions'>`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value=${regionList[index]}>`

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function generateCountries() {
  let regionForm = document.querySelector('.countryForm')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Country';
  regionForm.appendChild(weaponFormHeader)

  let regionFormTitle = document.createElement('div')
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
    "Falkland Islands [Malvinas]",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
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
    "Holy See",
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
    "Lao People's Democratic Republic  ",
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
    "Marshall Islands",
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
    "Netherlands  a",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands ",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation",
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
    "United States of America",
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
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='countries-input' list='allCountries'>`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${regionList[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function sliderFunction() {

  let mySlider = document.getElementById("rangeTerr");
  let output = document.getElementById("numberTerr");

  output.innerHTML = mySlider.value;
  mySlider.oninput = function () {
    output.innerHTML = this.value;
  }

  let mySlider1 = document.getElementById("rangeDeaths");
  let output1 = document.getElementById("numberDeaths");

  output1.innerHTML = mySlider1.value;
  mySlider1.oninput = function () {
    output1.innerHTML = this.value;
  }

  let mySlider2 = document.getElementById("rangeWound");
  let output2 = document.getElementById("numberWound");

  output2.innerHTML = mySlider2.value;
  mySlider2.oninput = function () {
    output2.innerHTML = this.value;
  }


}
// w3 schools load bars
function move() {
  var elem = document.getElementById("myBar");
  var width = 0;

  var elem2 = document.getElementById("myBar2");
  var elem2_2 = document.getElementById("myBar2-2");
  var elem2_3 = document.getElementById("myBar2-3");

  elem2.style.width = 0 + '%';
  elem2_2.style.width = 0 + '%';
  elem2_3.style.width = 0 + '%';

  var width2 = 0;
  var width2_2 = 20;
  var width2_3 = 60;
  // elem2_2.style.left = width2_2 + '%';
  //   elem2_3.style.left = width3_3 + '%';


  var id = setInterval(frame, 20);

  function frame() {
    if (width >= 80) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      elem.innerHTML = `<p>` + width * 1 + '% </p>';
    }
  }


  var id2 = setInterval(frame2, 20);

  function frame2() {
    if (width2 < 20) {
      width2++;
      elem2.style.width = width2 + '%';
      elem2.innerHTML = `<p>` + width2 * 1 + '% &#8595 </p>';
    } else if (width2_2 < 60) {
      width2_2++;
      elem2_2.style.width = (width2_2 - 20) + '%';
      elem2_2.innerHTML = `<p>` + (width2_2 * 1 - 20) + '% </p>';
    } else if (width2_3 < 100) {
      width2_3++;
      elem2_3.style.width = (width2_3 - 60) + '%';
      elem2_3.innerHTML = `<p>` + (width2_3 * 1 - 60) + '%  &#8593;</p>';
    } else {
      clearInterval(id2);
    }
  }

  var elem3 = document.getElementById("myBar3");
  var width3 = 0;
  var id3 = setInterval(frame3, 20);

  function frame3() {
    if (width3 >= 100) {
      clearInterval(id3);
    } else {
      width3++;
      elem3.style.width = width3 + '%';
      elem3.innerHTML = `<p>` + width3 * 1 + '% </p>';
    }
  }
}
