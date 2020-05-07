function attacksInsertPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);

    generateUpdate(regions, "", ".update-region", "Region", "allRegions", `<input list='allRegions'
    id='allRegionsInput' onchange="populate('allRegionsInput', '.update-country')" >`);
   generateUpdate(emptyObject, "", ".update-country", 'Country', 'allCountries',
       `<input list='allCountries' id='allCountriesInput'>`);
   generateUpdate(emptyObject, "", '.update-city', 'City', 'allCities',
       `<input list='allCities' id='allCitiesInput'>`);

   generateUpdate(targetSubtypes, "", '.update-targType', 'TargetType', 'allTargets',
       `<input list='allTargets' id='allTargetsInput' onchange="populateTargetSubtypes('allTargetsInput', '.update-targSubtype')">`);
   generateUpdate(emptyObject, "", '.update-targSubtype', 'TargetSubtype', 'allSubTargets', `<input list='allSubTargets' id='allSubTargetsInput'>`);


   generateUpdate(emptyObject, "", ".update-groupName", 'Group', 'allGroups', `<input list='allGroups' id='allGroupsInput'>`);
   generateUpdate(attacksTypes, "", ".update-attackType", 'Attack Type', 'allAttacks', `<input list='allAttacks' id='allAttacksInput'>`)
   generateUpdate(weaponSubtypes, "", ".update-weaponType", "Weapon Type", 'allWeapons',
       `<input list='allWeapons' id='allWeaponsInput'
     onchange="populateWeaponsSubtypes('allWeaponsInput', '.update-weaponSubtype')" >`)

   generateUpdate(emptyObject, "", ".update-weaponSubtype", "Weapon Subtype", 'allSubWeapons',
       `<input list='allSubWeapons' id='allSubWeaponsInput'>`)

   generateUpdate(propExtent, "", ".update-propExtent", "Amount of damage",
       'allDamages',
       `<input list='allDamages' id='allDamagesInput'>`);
}


function generateAttackInsertObject() {
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


    httpPOST(URL_MICROSERVICE_ATTACKS + "/api/attacks/id" , filters, (result) => {
        console.log(result.res);
        navigateRoot('/attacks');
    }, (error) => {
        //ALERT
    });

}
