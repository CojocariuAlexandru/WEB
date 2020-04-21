function statisticsPageInit(node) {
  mainContent.innerHTML = loadPage(node.template);

  generateWeapons();
  generateAttacks();
  generateTargets();
  generateRegions();
  generateCountries();
  generateCities();
  generateTargetTypes();
  generateTargetSubtypes();
  generateWeaponTypes();
  generateWeaponSubtypes();
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



function generateRegions() {
  let regionForm = document.querySelector('.regionForm');

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Region of the attack';
  regionForm.appendChild(weaponFormHeader)

  let regionFormTitle = document.createElement('div')
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allRegions');

  let regionList = Object.keys(regions); 
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input list='allRegions' id='allRegionsInput' onchange=populate('allRegionsInput') >`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value="${regionList[index]}">`

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function generateCountries() {
  let regionForm = document.querySelector('.countryForm')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Country';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allCountries');
  let regionList=[];
  
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='countries-input' list='allCountries' id='allCountriesInput'>`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${regionList[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}


function generateCities() {
  let regionForm = document.querySelector('.cityForm')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'City';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allCities');
  let regionList=[];
  
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allCities' id='allCitiesInput'>`
  let index = 0;
  for (index = 0; index < regionList.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${regionList[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function generateTargetTypes(){
  let regionForm = document.querySelector('.targTypeSelect')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'TargetType';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allTargets');
  
  let list = Object.keys(targetSubtypes);

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allTargets' id='allTargetsInput' onchange=populateTargetSubtypes('allTargetsInput')>`
  let index = 0;
  for (index = 0; index < list.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${list[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}

function generateTargetSubtypes(){
  let regionForm = document.querySelector('.targSubtypeSelect')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'TargetSubtype';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allSubTargets');
  
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allSubTargets' id='allSubTargetsInput'>`;
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}


function generateWeaponTypes(){
  let regionForm = document.querySelector('.weaponTypeSelect')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'WeaponType';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allWeapons');
  
  let list = Object.keys(weaponSubtypes);

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allWeapons' id='allWeaponsInput' onchange=populateWeaponsSubtypes('allWeaponsInput')>`
  let index = 0;
  for (index = 0; index < list.length; index++)
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
    `<option value='${list[index]}'>`
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose)
  regionForm.appendChild(regionFormTitle)
}


function generateWeaponSubtypes(){
  let regionForm = document.querySelector('.weaponSubtypeSelect')

  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'WeaponSubtype';
  regionForm.appendChild(weaponFormHeader);

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allSubWeapons');
  
  let list = Object.keys(targetSubtypes);

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='cities-input' list='allSubWeapons' id='allSubWeaponsInput'>`;
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