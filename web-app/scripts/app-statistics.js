function statisticsPageInit(node) {
  mainContent.innerHTML = loadPage(node.template);

  generateWeapons();
  generateAttacks();
  generateTargets();
  generate(regions, ".regionForm", "Region of the attack", "allRegions",  `<input list='allRegions' id='allRegionsInput' onchange=populate('allRegionsInput') >`);
  generate(emptyObject, ".countryForm", 'Country', 'allCountries', `<input list='allCountries' id='allCountriesInput'>`);
  generate(emptyObject, '.cityForm',  'City', 'allCities', `<input list='allCities' id='allCitiesInput'>`);
  generate(targetSubtypes, '.targTypeSelect', 'TargetType', 'allTargets', `<input list='allTargets' id='allTargetsInput' onchange=populateTargetSubtypes('allTargetsInput')>`);
  generate(emptyObject,'.targSubtypeSelect',  'TargetSubtype', 'allSubTargets', `<input list='allSubTargets' id='allSubTargetsInput'>`);
  generate(weaponSubtypes, '.weaponTypeSelect', 'WeaponType', 'allWeapons', `<input list='allWeapons' id='allWeaponsInput' onchange=populateWeaponsSubtypes('allWeaponsInput')>` );
  generate(emptyObject, '.weaponSubtypeSelect', 'WeaponSubtype', 'allSubWeapons',  ` <input list='allSubWeapons' id='allSubWeaponsInput'>`);
  generate(emptyObject, ".specificTargetName", 'Target Name', 'allTargetNames', `<input list='allTargetNames' id='allTargetNamesInput'>`);
  generate(emptyObject, ".specificTargetNat", 'Target Nationality', 'allTargetNationalities', `<input list='allTargetNationalities' id='allTargetNationalitiesInput'>`);
  generate(emptyObject, ".specificGroup", 'Group of terrorists', 'allGroups', `<input list='allGroups' id='allGroupsInput'>`);

  let preButton = document.getElementById("hidden-button");
  preButton.style.display ="none";
  hiddenMoreDetails("none");

  sliderFunction();
}

var parsed1;
var filters;

function sendStatisticsRequest() {
    let weaponList = ['Biological', 'Chemical', 'Explosives', 'Fake Weapons', 'Firearms', 'Incendiary', 'Melee', 'Radiological', 'Sabotage Equipment', 'Vehicle', 'Unknown', 'Other'];
    let attackList = ['Armed Assault', 'Assasination', 'Bombing', 'Facility Attack', 'Hijacking', 'Hostage Taking', 'Unarmed', 'Unknown'];
    let targetList = ['Airports', 'Business', 'Educational institution', 'Government', 'Military', 'Police', 'Religious Figures', 'Other'];


    let dateStartInput       = document.querySelector('#dateInputStart');
    let dateFinalInput       = document.querySelector('#dateInputFinal');
    let successInput         = document.querySelector('#succesInput');
    let knownInput           = document.querySelector('#knownInput');
    let terroristNumberInput = document.querySelector('#rangeTerr');
    let deathsNumberInput    = document.querySelector('#rangeDeaths');
    let woundedNumberInput   = document.querySelector('#rangeWound');
    let weaponFormInput      = document.querySelector('#weaponForm');
    let attackFormInput      = document.querySelector('#attacksForm');
    let targetFormInput      = document.querySelector('#targetForm');
    let damageFormInput      = document.querySelector('#damageForm');
    let regionFormInput      = document.querySelector('#allRegionsInput');
    let countryFormInput     = document.querySelector('#allCountriesInput');


    let weaponsChecked = [];
    let attacksChecked = [];
    let targetsChecked = [];
    let damagesChecked = [];
    let index;
    for(index=0; index<weaponFormInput.children.length;index++){
        if(weaponFormInput.children[index].children[0].checked == true){
          weaponsChecked.push(weaponList[index]);
        }
    }
    for(index=0; index<attackFormInput.children.length;index++){
      if(attackFormInput.children[index].children[0].checked == true){
        attacksChecked.push(attackList[index]);
      }
    }
    for(index=0; index<targetFormInput.children.length;index++){
      if(targetFormInput.children[index].children[0].checked == true){
        targetsChecked.push(targetList[index]);
      }
    }
    for(index=0; index<damageFormInput.children.length;index++){
      if(damageFormInput.children[index].children[0].checked == true){
        if(index == 0){
          damagesChecked.push('Minor');
        }
        else if(index == 1){
          damagesChecked.push('Major');
        }
        else if(index == 2){
          damagesChecked.push('Cayastrophic');
        }
        else if(index == 3){
          damagesChecked.push('Unknown');
        }
      }
    }


  filters = {
        dateStart:       `${dateStartInput.value}`,
        dateFinal:       `${dateFinalInput.value}`,
        terrCount: `${terroristNumberInput.value}`,
        killsCount:    `${deathsNumberInput.value}`,
        woundedCount:     `${woundedNumberInput.value}`,
        weaponType:     `${weaponsChecked}`,
        attackType:     `${attacksChecked}`,
        targType:          `${targetsChecked}`,
        damages:         `${damagesChecked}`,
        region:          `${regionFormInput.value}`,
        country:         `${countryFormInput.value}`,
        success:         `${successInput.checked}`,
        knownAttacker:   `${knownInput.checked}`
    };

    filters = JSON.stringify(filters);


    httpPOST("http://localhost:8001/api/attacks", filters, (result) => { 
      // console.log(result.res);
      parsed1 = JSON.parse(result.res);
      // console.log(parsed);
      navigateRoot('/statistics-results');

      // aici se scrie cod in caz de raspuns 200
     }, (eroare) => { 
       // aici se scrie cod in caz de eroare
       } );


}

function generateWeapons() {
  let weaponForm = document.querySelector('.weaponTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Weapon Type';
  weaponForm.appendChild(weaponFormHeader)

  let weaponFormTitle = document.createElement('div')
  weaponFormTitle.id = 'weaponForm'
  let weaponList = ['Biological', 'Chemical', 'Explosives', 'Fake Weapons', 'Firearms', 'Incendiary', 'Melee', 'Radiological', 'Sabotage Equipment', 'Vehicle', 'Unknown', 'Other'];
  weaponFormTitle.innerHTML = ``
  let index = 0;
  for (index = 0; index < weaponList.length; index++)
      weaponFormTitle.innerHTML =weaponFormTitle.innerHTML+`<div class="input1"><input type="checkbox" id="weapon-box-`+index+`">`
      +`<label for="weapon-box-`+index+  `">${weaponList[index]}</label></div>`;
  weaponForm.appendChild(weaponFormTitle)
}

function generateAttacks() {
  let weaponForm = document.querySelector('.attackTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Attack Type';
  weaponForm.appendChild(weaponFormHeader)

  let weaponFormTitle = document.createElement('div')
  weaponFormTitle.id = 'attacksForm';
  let weaponList = ['Armed Assault', 'Assasination', 'Bombing', 'Facility Attack', 'Hijacking', 'Hostage Taking', 'Unarmed', 'Unknown'];
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
  weaponFormTitle.id = 'targetForm';
  let weaponList = ['Airports', 'Business', 'Educational institution', 'Government', 'Military', 'Police', 'Religious Figures', 'Other'];
  weaponFormTitle.innerHTML = ``
  let index = 0;
  for (index = 0; index < weaponList.length; index++)
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="target-box-` + index + `">` +
    `<label for="target-box-` + index + `">${weaponList[index]}</label></div>`;
  weaponForm.appendChild(weaponFormTitle)
}


//https://www.youtube.com/watch?v=UliJeDbc4cw
// -------------------------------------------DYNAMIC LIST-------------------------------------------------------
function populate(id1){
    let s1 = document.getElementById(id1);

    let regionForm = document.querySelector('.countryForm');
    regionForm.innerHTML =  ``;

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Country';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allCountries');

  let regionList;
  let region = s1.value;
  if (!(region in regions)){
    regionList = [''];
  }else
    regionList = Object.keys(regions[region]);
  
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='countries-input' list='allCountries' id='allCountriesInput' onchange=populateCities('allRegionsInput','allCountriesInput')>`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${regionList[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function populateCities(id1, id2){
  let s1 = document.getElementById(id1);
  let s2 = document.getElementById(id2);
let regionForm = document.querySelector('.cityForm')
  regionForm.innerHTML =  ``;

let weaponFormHeader = document.createElement('h3');
weaponFormHeader.innerHTML = 'City';
regionForm.appendChild(weaponFormHeader);

let regionFormTitle = document.createElement('div');
let regionOptionChoose = document.createElement('datalist');
regionOptionChoose.setAttribute('id', 'allCities');

let regionList;
let region = s1.value;
let country = s2.value;
if (!(region in regions) && !(country in regions[region])){
  regionList = [''];
}else
  regionList = regions[region][country];
console.log(regions[region][country]);

regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allCities' id='allCitiesInput'>`
let index = 0;
for (index = 0; index < regionList.length; index++)
  regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
  `<option value='${regionList[index]}'>`
regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
regionFormTitle.appendChild(regionOptionChoose)
regionForm.appendChild(regionFormTitle)
}


function populateTargetSubtypes(id1){
  let s1 = document.getElementById(id1);
  let regionForm = document.querySelector('.targSubtypeSelect');
  regionForm.innerHTML =  ``;
    let weaponFormHeader = document.createElement('h3');
    weaponFormHeader.innerHTML = 'TargetSubtype';
    regionForm.appendChild(weaponFormHeader);

    let regionFormTitle = document.createElement('div');
    let regionOptionChoose = document.createElement('datalist');
    regionOptionChoose.setAttribute('id', 'allSubTargets');

    let regionList;
    let region = s1.value;
    if (!(region in targetSubtypes)){
      regionList = [''];
    }else
      regionList = targetSubtypes[region];

      regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='target-input' list='allSubTargets' id='allSubTargetsInput'>`;
      let index = 0;
    for (index = 0; index < regionList.length; index++)
      regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
      `<option value='${regionList[index]}'>`
    regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
    regionFormTitle.appendChild(regionOptionChoose);
    regionForm.appendChild(regionFormTitle);
}

function populateWeaponsSubtypes(id1){
  let s1 = document.getElementById(id1);
  let regionForm = document.querySelector('.weaponSubtypeSelect')

  regionForm.innerHTML =  ``;
    let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'WeaponSubtype';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allSubWeapons');
  let regionList;
  let region = s1.value;
  if (!(region in weaponSubtypes)){
    regionList = [''];
  }else
    regionList = weaponSubtypes[region];

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='subweapons-input' list='allSubWeapons' id='allSubWeaponsInput'>`;
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${regionList[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose);
  regionForm.appendChild(regionFormTitle);
}

// ----------------------------------GENERATING FORM LISTS-------------------------------------

function generate(listOfValues, selectClass, name, id, input){
  let selectedForm = document.querySelector(selectClass);
  let header = document.createElement('h3');
  header.innerHTML = name;
  selectedForm.appendChild(header);

  let divElement = document.createElement('div')
  let optionChoose = document.createElement('datalist');
  optionChoose.setAttribute('id', id);

  let values = Object.keys(listOfValues); 
  divElement.innerHTML = divElement.innerHTML + input;
  let index = 0;
  for (index = 0; index < values.length; index++)
      optionChoose.innerHTML = optionChoose.innerHTML + `<option value="${values[index]}">`;

  divElement.innerHTML = divElement.innerHTML + '</datalist>';
  divElement.appendChild(optionChoose);
  selectedForm.appendChild(divElement);
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

// ---------------------------- MORE DETAILS -------------------------------------



function moreDetails(){
  let preButton = document.getElementById("hidden-button");
  preButton.style.display =  'block';

  let preButton2 = document.getElementById("hidden-button2");
  preButton2.style.display =  'none';

  hiddenMoreDetails("");
  displayMoreDetails("none");
  document.documentElement.scrollTop = 0; 
  
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

}

function lessDetails(){
  let preButton = document.getElementById("hidden-button2");
  preButton.style.display =  'block';

  let preButton2 = document.getElementById("hidden-button");
  preButton2.style.display =  'none';

  hiddenMoreDetails("none");
  displayMoreDetails("");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function displayMoreDetails(displayType){
  let elem1 = document.getElementsByClassName("firstRow1");
  let elem2 = document.getElementsByClassName("firstRow2");
  let elem3 = document.getElementsByClassName("attackTypeForm");
  let elem4 = document.getElementsByClassName("targetTypeForm");
  let elem5 = document.getElementsByClassName("weaponTypeForm");
  let elem6 = document.getElementsByClassName("damageForm");
  let elem7 = document.getElementsByClassName("regionForm");
  let elem8 = document.getElementsByClassName("countryForm");
  let elem9 = document.getElementsByClassName("fourthRow");

  elem1[0].style.display = displayType;
  elem2[0].style.display = displayType;
  elem3[0].style.display = displayType;
  elem4[0].style.display = displayType;
  elem5[0].style.display = displayType;
  elem6[0].style.display = displayType;
  elem7[0].style.display = displayType;
  elem8[0].style.display = displayType;
  elem9[0].style.display = displayType;
}

function hiddenMoreDetails(displayType){
  let elem1 = document.getElementsByClassName("cityForm");
  let elem2 = document.getElementsByClassName("targTypeSelect");
  let elem3 = document.getElementsByClassName("targSubtypeSelect");
  let elem4 = document.getElementsByClassName("weaponTypeSelect");
  let elem5 = document.getElementsByClassName("weaponSubtypeSelect");
  let elem6 = document.getElementsByClassName("specificTargetName");
  let elem7 = document.getElementsByClassName("specificTargetNat");
  let elem8 = document.getElementsByClassName("specificGroup");
  let elem9 = document.getElementsByClassName("specificParagraph");

  elem1[0].style.display = displayType;
  elem2[0].style.display = displayType;
  elem3[0].style.display = displayType;
  elem4[0].style.display = displayType;
  elem5[0].style.display = displayType;
  elem6[0].style.display = displayType;
  elem7[0].style.display = displayType;
  elem8[0].style.display = displayType;
  elem9[0].style.display = displayType;

}