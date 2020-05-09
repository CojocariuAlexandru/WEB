function attackUpdateIdPageInit(node, id) {
    mainContent.innerHTML = '';
    httpGET(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + id, (res) => {
        // cod in caz de success
        let parsed = JSON.parse(res.res)[0];
        let compiledTemplate = Handlebars.compile(loadPage(node.template));
        // console.log(parsed);
        if (parsed.succes == "0")
            parsed.succes = "";
        if (parsed.extended == "0")
            parsed.extended = "";
        if (parsed.suicide == "0")
            parsed.suicide = "";
        mainContent.innerHTML = compiledTemplate(parsed);

        generateUpdate(regions, parsed.region, ".update-region", "Region", "allRegions", `<input list='allRegions'
         id='allRegionsInput' onchange="populate('allRegionsInput', '.update-country')" >`);
        generateUpdate(emptyObject, parsed.country, ".update-country", 'Country', 'allCountries',
            `<input list='allCountries' id='allCountriesInput'>`);
        generateUpdate(emptyObject, parsed.city, '.update-city', 'City', 'allCities',
            `<input list='allCities' id='allCitiesInput'>`);

        generateUpdate(targetSubtypes, parsed.targType, '.update-targType', 'TargetType', 'allTargets',
            `<input list='allTargets' id='allTargetsInput' onchange="populateTargetSubtypes('allTargetsInput', '.update-targSubtype')">`);
        generateUpdate(emptyObject, parsed.targetSubtypes, '.update-targSubtype', 'TargetSubtype', 'allSubTargets', `<input list='allSubTargets' id='allSubTargetsInput'>`);


        generateUpdate(emptyObject, parsed.groupName, ".update-groupName", 'Group', 'allGroups', `<input list='allGroups' id='allGroupsInput'>`);
        generateUpdate(attacksTypes, parsed.attackType, ".update-attackType", 'Attack Type', 'allAttacks', `<input list='allAttacks' id='allAttacksInput'>`)
        generateUpdate(weaponSubtypes, parsed.weaponType, ".update-weaponType", "Weapon Type", 'allWeapons',
            `<input list='allWeapons' id='allWeaponsInput'
          onchange="populateWeaponsSubtypes('allWeaponsInput', '.update-weaponSubtype')" >`)

        generateUpdate(emptyObject, parsed.weaponSubtype, ".update-weaponSubtype", "Weapon Subtype", 'allSubWeapons',
            `<input list='allSubWeapons' id='allSubWeaponsInput'>`)

        generateUpdate(propExtent, parsed.propExtent, ".update-propExtent", "Amount of damage",
            'allDamages',
            `<input list='allDamages' id='allDamagesInput'>`);

    }, (err) => {
        // cod in caz de eroare
    });
}

function generateUpdate(listOfValues, selected, selectClass, name, id, input) {
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
    // console.log(values);
    divElement.innerHTML = divElement.innerHTML + input;
    let index = 0;
    for (index = 0; index < values.length; index++)
        optionChoose.innerHTML = optionChoose.innerHTML + `<option value="${values[index]}">`;

    divElement.innerHTML = divElement.innerHTML + '</datalist>';
    divElement.appendChild(optionChoose);
    selectedForm.appendChild(divElement);
}

function generateAttackUpdateObject() {
    let dateUpdate = document.querySelector('#dateInput');
    let regionUpdate = document.querySelector('#allRegionsInput');
    let countryUpdate = document.querySelector('#allCountriesInput');
    let cityUpdate = document.querySelector('#allCitiesInput');
    let latitudeUpdate = document.querySelector('#latitudeInput');
    let longitudeUpdate = document.querySelector('#longitudeInput');
    let killsUpdate = document.querySelector('#quantityKillsInput');
    let terrUpdate = document.querySelector('#quantityTerroristsInput');
    let woundedUpdate = document.querySelector('#quantityWoundedInput');
    let targetTypeUpdate = document.querySelector('#allTargetsInput');
    let attackTypeUpdate = document.querySelector('#allAttacksInput');
    let weaponTypeUpdate = document.querySelector('#allWeaponsInput');
    let subTargetUpdate = document.querySelector('#allSubTargetsInput');
    let groupUpdate = document.querySelector('#allGroupsInput');
    let subWeaponUpdate = document.querySelector('#allSubWeaponsInput');
    let successUpdate = document.querySelector('#succesInput');
    let extendedUpdate = document.querySelector('#extendedInput');
    let suicideUpdate = document.querySelector('#suicideInput');
    let damageUpdate = document.querySelector('#allDamagesInput');
    let dagamesDetailsUpdate = document.querySelector('#propComment');
    let weaponDetailsUpdate = document.querySelector('#weaponDetails');
    let targetUpdate = document.querySelector('#targetName');
    let nationUpdate = document.querySelector('#targetNat');
    let sumaryUpdate = document.querySelector('#summary');
    let motiveUpdate = document.querySelector('#motive');
    let noteUpdate = document.querySelector('#notes');
    let scite1Update = document.querySelector('#scite1');
    let scite2Update = document.querySelector('#scite2');
    let scite3Update = document.querySelector('#scite3');

    filters = {
        date: `${dateUpdate.value}`,
        terrCount: `${terrUpdate.value}`,
        killsCount: `${killsUpdate.value}`,
        woundedCount: `${woundedUpdate.value}`,
        city: `${cityUpdate.value}`,
        weaponType: `${weaponTypeUpdate.value}`,
        weaponSubtype: `${subWeaponUpdate.value}`,
        attackType: `${attackTypeUpdate.value}`,
        targType: `${targetTypeUpdate.value}`,
        targSubtype: `${subTargetUpdate.value}`,
        targetName: `${targetUpdate.value}`.trim(),
        targetNat: `${nationUpdate.value}`.trim(),
        groupName: `${groupUpdate.value}`,
        propExtent: `${damageUpdate.value}`,
        region: `${regionUpdate.value}`,
        country: `${countryUpdate.value}`,
        success: `${successUpdate.checked}`,
        extended: `${extendedUpdate.checked}`,
        suicide: `${suicideUpdate.checked}`,
        latitude: `${latitudeUpdate.value}`,
        longitude: `${longitudeUpdate.value}`,
        propComment: `${dagamesDetailsUpdate.value}`.trim(),
        weaponDetail: `${weaponDetailsUpdate.value}`.trim(),
        summary: `${sumaryUpdate.value}`.trim(),
        motive: `${motiveUpdate.value}`.trim(),
        addNotes: `${noteUpdate.value}`.trim(),
        sCite1: `${scite1Update.value}`.trim(),
        sCite2: `${scite2Update.value}`.trim(),
        sCite3: `${scite3Update.value}`.trim()
    };
    if (filters["date"] == "")
        filters["date"] = "0000-00-00"
    filters = JSON.stringify(filters);
    console.log(filters);

    let currentURL = window.location.href; //get current URL
    let currentAttackID = currentURL.split("/"); //get current attack ID - currentAttackID[5]
    console.log(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + currentAttackID[5]);

    httpPUT(URL_MICROSERVICE_ATTACKS + "/api/attacks/" + currentAttackID[5], filters, (result) => {
        console.log(result.res);
        navigateRoot('/attacks/' + currentAttackID[5]);
    }, (error) => {
        //ALERT
    });
}
