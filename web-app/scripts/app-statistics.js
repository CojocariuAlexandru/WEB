function statisticsPageInit(node) {
  mainContent.innerHTML = loadPage(node.template);

  generateWeapons();
  generateAttacks();
  generateTargets();
  generateRegions();
  generateCountries();
  generateCities();
  sliderFunction()
}

var parsed1;
var filters;

function sendStatisticsRequest() {
    let weaponList = ['Biological', 'Chemical', 'Vehicles', 'Explosives', 'Firearms', 'Weapon6', 'Weapon7', 'Unknown'];
    let attackList = ['Attack1', 'Attack2', 'Attack3', 'Attack4', 'Attack5', 'Attack6', 'Attack7', 'Attack8'];
    let targetList = ['Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8'];


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
  let weaponList = ['Biological', 'Chemical', 'Vehicles', 'Explosives', 'Firearms', 'Weapon6', 'Weapon7', 'Unknown']
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
  weaponFormTitle.id = 'targetForm';
  let weaponList = ['Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8']
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