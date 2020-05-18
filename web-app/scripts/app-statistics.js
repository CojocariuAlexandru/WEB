function statisticsPageInit(node) {
  mainContent.innerHTML = loadPage(node.template);

  generateWeapons();
  generateAttacks();
  generateTargets();
  generate(regions, ".regionForm", "Region of the attack", "allRegions", `<label for="allRegionsInput"></label><input list='allRegions' id='allRegionsInput' onchange=populate('allRegionsInput','.countryForm') >`);
  generate(emptyObject, ".countryForm", 'Country', 'allCountries', `<label for="allCountriesInput"></label><input list='allCountries' id='allCountriesInput'>`);
  generate(emptyObject, '.cityForm', 'City', 'allCities', `<label for="allCitiesInput"></label><input list='allCities' id='allCitiesInput'>`);
  generate(targetSubtypes, '.targTypeSelect', 'TargetType', 'allTargets', `<input list='allTargets' id='allTargetsInput' onchange=populateTargetSubtypes('allTargetsInput', '.targSubtypeSelect')>`);
  generate(emptyObject, '.targSubtypeSelect', 'TargetSubtype', 'allSubTargets', `<input list='allSubTargets' id='allSubTargetsInput'>`);
  generate(weaponSubtypes, '.weaponTypeSelect', 'WeaponType', 'allWeapons', `<input list='allWeapons' id='allWeaponsInput' onchange=populateWeaponsSubtypes('allWeaponsInput','.weaponSubtypeSelect')>`);
  generate(emptyObject, '.weaponSubtypeSelect', 'WeaponSubtype', 'allSubWeapons', ` <input list='allSubWeapons' id='allSubWeaponsInput'>`);
  generate(emptyObject, ".specificTargetName", 'Target Name', 'allTargetNames', `<input list='allTargetNames' id='allTargetNamesInput'>`);
  generate(emptyObject, ".specificTargetNat", 'Target Nationality', 'allTargetNationalities', `<input list='allTargetNationalities' id='allTargetNationalitiesInput'>`);
  generate(emptyObject, ".specificGroup", 'Group of terrorists', 'allGroups', `<input list='allGroups' id='allGroupsInput'>`);

  let preButton = document.getElementById("hidden-button");
  preButton.style.display = "none";
  hiddenMoreDetails("none");

  sliderFunction();
}

var parsed1 = null;
var filters;

function sendStatisticsRequest() {
  let weaponList = ['Biological', 'Chemical', 'Explosives', 'Fake Weapons', 'Firearms', 'Incendiary', 'Melee', 'Radiological', 'Sabotage Equipment', 'Vehicle (not to include vehicle-borne explosives, i.e., car or truck bombs)', 'Unknown', 'Other'];
  let attackList = ['Armed Assault', 'Assasination', 'Bombing/Explosion', 'Facility/Infrastructure Attack', 'Hijacking', 'Hostage Taking (Kidnapping)', 'Unarmed Assault', 'Unknown'];
  let targetList = ['Airports & Aircraft', 'Business', 'Educational institution', 'Government (General)', 'Military', 'Police', '', 'Other'];

  let dateStartInput = document.querySelector('#dateInputStart');
  let dateFinalInput = document.querySelector('#dateInputFinal');
  let successInput = document.querySelector('#succesInput');
  let knownInput = document.querySelector('#knownInput');
  let terroristNumberInput = document.querySelector('#rangeTerr');
  let deathsNumberInput = document.querySelector('#rangeDeaths');
  let woundedNumberInput = document.querySelector('#rangeWound');
  let weaponFormInput = document.querySelector('#weaponForm');
  let attackFormInput = document.querySelector('#attacksForm');
  let targetFormInput = document.querySelector('#targetForm');
  let damageFormInput = document.querySelector('#damageForm');
  let regionFormInput = document.querySelector('#allRegionsInput');
  let countryFormInput = document.querySelector('#allCountriesInput');

  let cityFormInputMORE = document.querySelector('#allCitiesInput');
  let targetTypeFormInputMORE = document.querySelector('#allTargetsInput');
  let subTargetFormInputMORE = document.querySelector('#allSubTargetsInput');
  let weaponFormInputMORE = document.querySelector('#allWeaponsInput');
  let subWeaponFormInputMORE = document.querySelector('#allSubWeaponsInput');
  let targetNameFormInputMORE = document.querySelector('#allTargetNamesInput');
  let targetNatFormInputMORE = document.querySelector('#allTargetNationalitiesInput');
  let groupFormInputMORE = document.querySelector('#allGroupsInput');
  let suicideFormInput = document.querySelector('#suicideInput');

  let weaponsChecked = [];
  let attacksChecked = [];
  let targetsChecked = [];
  let damagesChecked = [];
  let index;
  for (index = 0; index < weaponFormInput.children.length; index++) {
    if (weaponFormInput.children[index].children[0].checked == true) {
      weaponsChecked.push(weaponList[index]);
    }
  }
  for (index = 0; index < attackFormInput.children.length; index++) {
    if (attackFormInput.children[index].children[0].checked == true) {
      attacksChecked.push(attackList[index]);
    }
  }
  for (index = 0; index < targetFormInput.children.length; index++) {
    if (targetFormInput.children[index].children[0].checked == true) {
      targetsChecked.push(targetList[index]);
    }
  }
  for (index = 0; index < damageFormInput.children.length; index++) {
    if (damageFormInput.children[index].children[0].checked == true) {
      if (index == 0) {
        damagesChecked.push('Minor (likely < $1 million)');
      } else if (index == 1) {
        damagesChecked.push('Major (likely >= $1 million but < $1 billion)');
      } else if (index == 2) {
        damagesChecked.push('Catastrophic (likely >= $1 billion)');
      } else if (index == 3) {
        damagesChecked.push('Unknown');
      }
    }
  }

  let finalWeaponToSend;
  if (weaponFormInputMORE.value) {
    finalWeaponToSend = `${weaponFormInputMORE.value}`;
  } else {
    finalWeaponToSend = weaponsChecked;
  }

  let finalTargetToSend;
  if (targetTypeFormInputMORE.value) {
    finalTargetToSend = `${targetTypeFormInputMORE.value}`;
  } else {
    finalTargetToSend = targetsChecked;
  }

  filters = {
    dateStart: `${dateStartInput.value}`,
    dateFinal: `${dateFinalInput.value}`,
    terrCount: `${terroristNumberInput.value}`,
    killsCount: `${deathsNumberInput.value}`,
    woundedCount: `${woundedNumberInput.value}`,
    city: `${cityFormInputMORE.value}`,
    weaponType: `${finalWeaponToSend}`,
    weaponSubtype: `${subWeaponFormInputMORE.value}`,
    attackType: `${attacksChecked}`,
    targType: `${finalTargetToSend}`,
    targSubtype: `${subTargetFormInputMORE.value}`,
    targetName: `${targetNameFormInputMORE.value}`,
    targetNat: `${targetNatFormInputMORE.value}`,
    groupName: `${groupFormInputMORE.value}`,
    propExtent: `${damagesChecked}`,
    region: `${regionFormInput.value}`,
    country: `${countryFormInput.value}`,
    success: `${successInput.checked}`,
    extended: `${extendedInput.checked}`,
    suicide: `${suicideFormInput.checked}`
  };
  filters = JSON.stringify(filters);

  httpPOST(URL_MICROSERVICE_ATTACKS + "/api/attacks/filters", filters, (result) => {
    parsed1 = JSON.parse(result.res);
    navigateRoot('/statistics-results');
  }, (eroare) => {
    console.log(eroare);
  });

  mainContent.innerHTML = getLoaderHTML();
}

function generateWeapons() {
  let weaponForm = document.querySelector('.weaponTypeForm')
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Weapon Type';
  weaponForm.appendChild(weaponFormHeader);

  let weaponFormTitle = document.createElement('div');
  weaponFormTitle.id = 'weaponForm';
  let weaponList = ['Biological', 'Chemical', 'Explosives', 'Fake Weapons', 'Firearms', 'Incendiary', 'Melee', 'Radiological', 'Sabotage Equipment', 'Vehicle', 'Unknown', 'Other'];
  weaponFormTitle.innerHTML = ``;
  let index = 0;
  for (index = 0; index < weaponList.length; index++) {
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="weapon-box-` + index + `">` + `<label for="weapon-box-` + index + `">${weaponList[index]}</label></div>`;
  }
  weaponForm.appendChild(weaponFormTitle);
}

function generateAttacks() {
  let weaponForm = document.querySelector('.attackTypeForm');
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Attack Type';
  weaponForm.appendChild(weaponFormHeader);

  let weaponFormTitle = document.createElement('div');
  weaponFormTitle.id = 'attacksForm';
  let weaponList = ['Armed Assault', 'Assasination', 'Bombing', 'Facility Attack', 'Hijacking', 'Hostage Taking', 'Unarmed', 'Unknown'];
  weaponFormTitle.innerHTML = ``;
  let index = 0;
  for (index = 0; index < weaponList.length; index++) {
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="attack-box-` + index + `">` + `<label for="attack-box-` + index + `">${weaponList[index]}</label></div>`;
  }
  weaponForm.appendChild(weaponFormTitle);
}

function generateTargets() {
  let weaponForm = document.querySelector('.targetTypeForm');
  let weaponFormHeader = document.createElement('h3');
  weaponFormHeader.innerHTML = 'Target Type';
  weaponForm.appendChild(weaponFormHeader);

  let weaponFormTitle = document.createElement('div');
  weaponFormTitle.id = 'targetForm';
  let weaponList = ['Airports', 'Business', 'Educational institution', 'Government', 'Military', 'Police', 'Religious Figures', 'Other'];
  weaponFormTitle.innerHTML = ``;
  let index = 0;
  for (index = 0; index < weaponList.length; index++) {
    weaponFormTitle.innerHTML = weaponFormTitle.innerHTML + `<div class="input1"><input type="checkbox" id="target-box-` + index + `">` + `<label for="target-box-` + index + `">${weaponList[index]}</label></div>`;
  }
  weaponForm.appendChild(weaponFormTitle);
}

//https://www.youtube.com/watch?v=UliJeDbc4cw
// -------------------------------------------DYNAMIC LIST-------------------------------------------------------
function populate(id1, name) {
  let s1 = document.getElementById(id1);

  let regionForm = document.querySelector(name + " div");
  regionForm.innerHTML = ``;

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allCountries');

  let regionList;
  let region = s1.value;
  if (!(region in regions)) {
    regionList = [''];
  } else {
    regionList = regions[region];
  }

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='countries-input' list='allCountries' id='allCountriesInput'>`;
  let index = 0;
  for (index = 0; index < regionList.length; index++) {
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML +
      `<option value='${regionList[index]}'>`;
  }
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>'
  regionFormTitle.appendChild(regionOptionChoose);
  regionForm.appendChild(regionFormTitle);
}

function populateTargetSubtypes(id1, name) {
  let s1 = document.getElementById(id1);
  let regionForm = document.querySelector(name + ' div');
  regionForm.innerHTML = ``;

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allSubTargets');

  let regionList;
  let region = s1.value;
  if (!(region in targetSubtypes)) {
    regionList = [''];
  } else {
    regionList = targetSubtypes[region];
  }
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='target-input' list='allSubTargets' id='allSubTargetsInput'>`;
  let index = 0;
  for (index = 0; index < regionList.length; index++) {
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`;
  }
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>';
  regionFormTitle.appendChild(regionOptionChoose);
  regionForm.appendChild(regionFormTitle);
}

function populateWeaponsSubtypes(id1, name) {
  let s1 = document.getElementById(id1);
  let regionForm = document.querySelector(name + ' div')

  regionForm.innerHTML = ``;

  let regionFormTitle = document.createElement('div');
  let regionOptionChoose = document.createElement('datalist');
  regionOptionChoose.setAttribute('id', 'allSubWeapons');
  let regionList;
  let region = s1.value;
  if (!(region in weaponSubtypes)) {
    regionList = [''];
  } else {
    regionList = weaponSubtypes[region];
  }

  regionFormTitle.innerHTML = regionFormTitle.innerHTML + `<input class='subweapons-input' list='allSubWeapons' id='allSubWeaponsInput'>`;
  let index = 0;
  for (index = 0; index < regionList.length; index++) {
    regionOptionChoose.innerHTML = regionOptionChoose.innerHTML + `<option value='${regionList[index]}'>`;
  }
  regionFormTitle.innerHTML = regionFormTitle.innerHTML + '</datalist>';
  regionFormTitle.appendChild(regionOptionChoose);
  regionForm.appendChild(regionFormTitle);
}

// ----------------------------------GENERATING FORM LISTS-------------------------------------

function generate(listOfValues, selectClass, name, id, input) {
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
  for (index = 0; index < values.length; index++) {
    optionChoose.innerHTML = optionChoose.innerHTML + `<option value="${values[index]}">`;
  }

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

function moreDetails() {
  let preButton = document.getElementById("hidden-button");
  preButton.style.display = 'block';

  let preButton2 = document.getElementById("hidden-button2");
  preButton2.style.display = 'none';

  hiddenMoreDetails("");
  displayMoreDetails("none");
  document.documentElement.scrollTop = 0;

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function lessDetails() {
  let preButton = document.getElementById("hidden-button2");
  preButton.style.display = 'block';

  let preButton2 = document.getElementById("hidden-button");
  preButton2.style.display = 'none';

  hiddenMoreDetails("none");
  displayMoreDetails("");
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function displayMoreDetails(displayType) {
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

function hiddenMoreDetails(displayType) {
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

function serverAttacksNotNull() {
  if (parsed1 == null) {
    return false;
  }
  return true;
}
