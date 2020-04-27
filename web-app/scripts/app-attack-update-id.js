function attackUpdateIdPageInit(node, id) {
    mainContent.innerHTML = '';
    httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + id, (res) => {
        // cod in caz de success
        let parsed = JSON.parse(res.res)[0];
        let compiledTemplate = Handlebars.compile(loadPage(node.template));
        console.log(parsed);
        if (parsed.succes=="0")
            parsed.succes="";
        if (parsed.extended=="0")
            parsed.extended="";
        if (parsed.suicide=="0")
            parsed.suicide="";
        mainContent.innerHTML = compiledTemplate(parsed);

        generateUpdate(regions, parsed.region, ".update-region", "Region", "allRegions",  `<input list='allRegions'
         id='allRegionsInput' onchange="populate('allRegionsInput', '.update-country')" >`);
        generateUpdate(emptyObject, parsed.country, ".update-country", 'Country', 'allCountries', 
        `<input list='allCountries' id='allCountriesInput'>`);
        generateUpdate(emptyObject, parsed.city, '.update-city',  'City', 'allCities', 
        `<input list='allCities' id='allCitiesInput'>`);

        generateUpdate(targetSubtypes, parsed.targType, '.update-targType', 'TargetType', 'allTargets', 
        `<input list='allTargets' id='allTargetsInput' onchange="populateTargetSubtypes('allTargetsInput', '.update-targSubtype')">`);
        generateUpdate(emptyObject, parsed.targetSubtypes,'.update-targSubtype',  'TargetSubtype', 'allSubTargets', `<input list='allSubTargets' id='allSubTargetsInput'>`);
       

        generateUpdate(emptyObject,parsed.groupName,  ".update-groupName", 'Group', 'allGroups', `<input list='allGroups' id='allGroupsInput'>`);
        generateUpdate(attacksTypes, parsed.attackType, ".update-attackType", 'Attack Type', 'allAttacks', `<input list='allAttacks' id='allAttacksInput'>`)
        generateUpdate(weaponSubtypes, parsed.weaponType, ".update-weaponType", "Weapon Type", 'allWeapons',
         `<input list='allWeapons' id='allWeaponsInput'
          onchange="populateWeaponsSubtypes('allWeaponsInput', '.update-weaponSubtype')" >`)

        generateUpdate(emptyObject, parsed.weaponSubtype, ".update-weaponSubtype", "Weapon Subtype", 'allSubWeapons',
          `<input list='allSubWeapons' id='allSubWeaponsInput'>`)

        generateUpdate(propExtent, parsed.propExtent, ".update-propExtent", "Amount of damage",
        'allDamages',
        `<input list='allDamages' id='allDamagesInput'>` );

         
    }, (err) => {
        // cod in caz de eroare
    });
}

function generateUpdate(listOfValues, selected, selectClass, name, id, input){
    let selectedForm = document.querySelector(selectClass);
    let header = document.createElement('h3');
    header.innerHTML = name;
    selectedForm.appendChild(header);

    let paragraph = document.createElement('p');
    paragraph.innerHTML = selected;
    selectedForm.appendChild(paragraph);
  
    let divElement = document.createElement('div')
    let optionChoose = document.createElement('datalist');
    optionChoose.setAttribute('id', id);
  
    let values = Object.keys(listOfValues); 
    console.log(values);
    divElement.innerHTML = divElement.innerHTML + input;
    let index = 0;
    for (index = 0; index < values.length; index++)
        optionChoose.innerHTML = optionChoose.innerHTML + `<option value="${values[index]}">`;
    
    divElement.innerHTML = divElement.innerHTML + '</datalist>';
    divElement.appendChild(optionChoose);
    selectedForm.appendChild(divElement);
  }
