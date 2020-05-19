var setIdCriteria = -1;
var setLocationCriteria = -1;
var setDateCriteria = -1;
var setTargetTypeCriteria = -1;
var setAttackTypeCriteria = -1;
var currentPageNumber = 1;
var advancedFormOn = 0;
var enteredMainForm = 0;
var parsed1Copy;

function statisticsDrawingsPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);
    parsed1Copy = parsed1;

    setIdCriteria = -1;
    setLocationCriteria = -1;
    setDateCriteria = -1;
    setTargetTypeCriteria = -1;
    setAttackTypeCriteria = -1;
    currentPageNumber = 1;
    advancedFormOn = 0;

    generateRecords();
    document.querySelector('#scroll-to-element').scrollIntoView();
}

let numberPerPage = 10;

function generateRecords() {
    let attackListHead = document.querySelector('.recordList');
    let table = document.createElement('table');
    table.setAttribute('id', 'attacksTable');
    table.setAttribute('class', 'attacksTable')
    attackListHead.appendChild(table);

    window.addEventListener('resize', showRecordsByWidth);

    displayRecords(currentPageNumber, window.innerWidth);
    showProperPlaceHolderAdvancedText(window.innerWidth);
}

function showRecordsByWidth() {
    showProperPlaceHolderAdvancedText(window.innerWidth);
    if (advancedFormOn == 1)
        showRecordsByInput();
    displayRecords(currentPageNumber, window.innerWidth);
    showAdvancedForm(window.innerWidth);
    showAdvancedForm(window.innerWidth);

}

function showProperPlaceHolderAdvancedText(windowWidth) {
    let advancedSearch = document.querySelector('#searchText');
    if (windowWidth >= 600) {
        advancedSearch.setAttribute('placeholder', 'Search attack by ID');
    } else {
        advancedSearch.setAttribute('placeholder', 'Search by ID');
    }
}

function displayRecords(pageNumber, windowWidth) {
    let table = document.getElementById('attacksTable');
    let functionToParticularAttack;
    table.innerHTML = '';

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');

    if (windowWidth >= 1000) {
        particularRecord.innerHTML = `
                                            <th id='attackIDHeader' class='tableCellDataID' onclick='sortByID()'>ID &#x21C5</th> 
                                            <th id='locationIDHeader' class='tableCellDataAttack' onclick='sortByLocation()'>Location &#x21C5</th> 
                                            <th id='dateIDHeader' class='tableCellData' onclick='sortByDate()'>Date &#x21C5</th>
                                            <th id='attackTypeHeader' class='tableCellData' onclick='sortByAttack()'>Attack Type &#x21C5</th>
                                            <th id='targetTypeHeader' class='tableCellData' onclick='sortByTarget()'>Target Type &#x21C5</th>
                                    `;
    } else {
        particularRecord.innerHTML = `<th class='attackInformation'>Attacks information</th> `
    }
    table.appendChild(particularRecord);

    for (let i = (pageNumber - 1) * numberPerPage; i < pageNumber * numberPerPage && i < parsed1.length; i++) {
        functionToParticularAttack = `goToDedicatedPage(${parsed1[i].id})`;
        particularRecord = document.createElement('tr');
        particularRecord.setAttribute('class', 'particularRecord');
        particularRecord.setAttribute('onclick', functionToParticularAttack);
        if (windowWidth >= 1000) {
            particularRecord.innerHTML = `
                                <td id='attackID' class='tableCellDataID'>${parsed1[i].id}</td>
                                <td id='locationID' class='tableCellDataAttack'>${parsed1[i].country}, ${parsed1[i].region} </td>
                                <td id='dateID' class='tableCellData'>${parsed1[i].date}</td>
                                <td id='attackType' class='tableCellData'>${parsed1[i].attackType}</td>
                                <td id='targetType' class='tableCellData'>${parsed1[i].targType}</td>
                                `;
        } else {
            particularRecord.innerHTML =
                `
                <td class='attackInformation'>
                    <p><span class='smallScreenHeader'>ID:         </span> ${parsed1[i].id}                           </p>
                    <p><span class='smallScreenHeader'>Location:   </span> ${parsed1[i].country}, ${parsed1[i].region}</p>
                    <p><span class='smallScreenHeader'>Date:       </span> ${parsed1[i].date}                         </p>
                    <p><span class='smallScreenHeader'>Target type:</span> ${parsed1[i].attackType}                   </p>
                    <p><span class='smallScreenHeader'>Attack type:</span> ${parsed1[i].targType}                     </p>
                </td>
                `
        }
        if (i % 2 == 1) {
            particularRecord.style.backgroundColor = '#222831';
        }
        table.appendChild(particularRecord);
    }
    generateOtherLists(pageNumber);
}

function goToDedicatedPage(pageID) {
    let urlToAttack;
    urlToAttack = '/attacks/';
    urlToAttack = urlToAttack + pageID;
    navigateRoot(urlToAttack);
}

function generateOtherLists(pageNumber) {
    let attackListHead = document.querySelector('.otherLists');
    attackListHead.innerHTML = ``;
    let otherAttackList = document.createElement('footer');
    let listText = `<p class = 'numberList'>`;

    if (pageNumber == 1) {
        listText = listText + `1`;
        if (pageNumber * numberPerPage < parsed1.length) {
            listText = listText + `,<span class="changePage" onclick="increasePageNumber();showRecordsByWidth()">2</span> >>`;
        }
    } else if (pageNumber * numberPerPage >= parsed1.length) {
        listText = listText + `<< `;
        listText = listText + `<span class="changePage" onclick="reducePageNumber();showRecordsByWidth()">${pageNumber-1}, </span>`;
        listText = listText + `${pageNumber}`;
    } else {
        listText = listText + `<< <span class="changePage" onclick="reducePageNumber();showRecordsByWidth()">${pageNumber-1}, </span>`;
        listText = listText + `${pageNumber}, `;
        listText = listText + `<span class="changePage" onclick="increasePageNumber();showRecordsByWidth()">${pageNumber+1} </span> >>`;
    }
    otherAttackList.innerHTML = listText;
    attackListHead.appendChild(otherAttackList);
}


function sortByID() {
    if (setIdCriteria == 1) {
        parsed1.sort(sortIdCriteriaAscending);
        setIdCriteria = -1;
    } else {
        parsed1.sort(sortIdCriteriaDescending)
        setIdCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortIdCriteriaAscending(a, b) {
    let valA = parseInt(a.id);
    let valB = parseInt(b.id);
    if (valA > valB) {
        return 1;
    } else if (valB > valA) {
        return -1;
    } else {
        return 0;
    }
}

function sortIdCriteriaDescending(a, b) {
    let valA = parseInt(a.id);
    let valB = parseInt(b.id);
    if (valA > valB) {
        return -1;
    } else if (valB > valA) {
        return 1;
    } else {
        return 0;
    }
}

function sortByLocation() {
    if (setLocationCriteria == 1) {
        parsed1.sort(sortLocationCriteriaAscending);
        setLocationCriteria = -1;
    } else {
        parsed1.sort(sortLocationCriteriaDescending)
        setLocationCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortLocationCriteriaAscending(a, b) {
    valA = a.country;
    valB = b.country;
    if (valA > valB) {
        return 1;
    } else if (valB > valA) {
        return -1;
    } else {
        valA = a.region;
        valB = b.region;
        if (valA > valB) {
            return 1;
        } else if (valB > valA) {
            return -1;
        } else {
            return 0;
        }
    }
}

function sortLocationCriteriaDescending(a, b) {
    valA = a.country;
    valB = b.country;
    if (valA > valB) {
        return -1;
    } else if (valB > valA) {
        return 1;
    } else {
        valA = a.region;
        valB = b.region;
        if (valA > valB) {
            return -1;
        } else if (valB > valA) {
            return 1;
        } else {
            return 0;
        }
    }
}

function sortByDate() {
    if (setDateCriteria == 1) {
        parsed1.sort(sortDateCriteriaAscending);
        setDateCriteria = -1;
    } else {
        parsed1.sort(sortDateCriteriaDescending);
        setDateCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortDateCriteriaAscending(a, b) {
    valA = new Date(a.date);
    valA = valA.getTime();
    valB = new Date(b.date);
    valB = valB.getTime();
    if (valA > valB) {
        return 1;
    } else if (valB > valA) {
        return -1;
    } else {
        return 0;
    }
}

function sortDateCriteriaDescending(a, b) {
    valA = new Date(a.date);
    valA = valA.getTime();
    valB = new Date(b.date);
    valB = valB.getTime();
    if (valA > valB) {
        return -1;
    } else if (valB > valA) {
        return 1;
    } else {
        return 0;
    }
}

function sortByAttack() {
    if (setAttackTypeCriteria == 1) {
        parsed1.sort(sortAttackCriteriaAscending);
        setAttackTypeCriteria = -1;
    } else {
        parsed1.sort(sortAttackCriteriaDescending);
        setAttackTypeCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortAttackCriteriaAscending(a, b) {
    valA = a.attackType;
    valB = b.attackType;
    if (valA > valB) {
        return 1;
    } else if (valB > valA) {
        return -1;
    } else {
        return 0;
    }
}

function sortAttackCriteriaDescending(a, b) {
    valA = a.attackType;
    valB = b.attackType;
    if (valA > valB) {
        return -1;
    } else if (valB > valA) {
        return 1;
    } else {
        return 0;
    }
}

function sortByTarget() {
    if (setTargetTypeCriteria == 1) {
        parsed1.sort(sortTargetCriteriaAscending);
        setTargetTypeCriteria = -1;
    } else {
        parsed1.sort(sortTargetCriteriaDescending);
        setTargetTypeCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortTargetCriteriaAscending(a, b) {
    valA = a.targType;
    valB = b.targType;
    if (valA > valB) {
        return 1;
    } else if (valB > valA) {
        return -1;
    } else {
        return 0;
    }
}

function sortTargetCriteriaDescending(a, b) {
    valA = a.targType;
    valB = b.targType;
    if (valA > valB) {
        return -1;
    } else if (valB > valA) {
        return 1;
    } else {
        return 0;
    }
}

function reducePageNumber() {
    currentPageNumber = currentPageNumber - 1;
}

function increasePageNumber() {
    currentPageNumber = currentPageNumber + 1;
}

function showAdvancedForm(windowWidth) {
    let listOfAttacksPage = document.querySelector('.listOfAttacks');
    let advancedForm = document.createElement('div');
    advancedForm.setAttribute('id', 'advancedForm');
    advancedForm.setAttribute('class', 'advancedForm');

    if (windowWidth >= 1000) {
        advancedForm.innerHTML =
            `
        <div id = 'searchCriteriaAdvancedForm' class = 'searchCriteriaAdvancedForm'>
            <p id='advancedID' class='advancedID'>       ID          </p>
            <p id='advancedLocation' class='advancedLocation'> Location    </p>
            <p id='advancedDate' class='advancedDate'>     Date        </p>
            <p id='advancedAttack' class='advancedAttack'>   Attack type </p>
            <p id='advancedTarget' class='advancedTarget'>   Target type </p>
            <p id='advancedFiller' class='advancedFiller'></p>
        </div>
        <div id = 'searchCriteriaAdvancedInput' class = 'searchCriteriaAdvancedInput'>
            <input type='text' id='advancedIdInput' class='advancedIdInput'>
            <input type='text' id='advancedLocationInput' class='advancedLocationInput'>
            <div id = 'advancedDateInput' class = 'advancedDateInput'>
                <input class='dataForm1' type='date' id='dateInputStart'></input>
                <span>-</span>
                <input class='dataForm1' type='date' id='dateInputFinal'></input>
            </div>
            <input type='text' id='advancedAttackInput' class='advancedAttackInput'>
            <input type='text' id='advancedTargetInput' class='advancedTargetInput'>
            <input type='button' id='submitAdvancedInput' class='submitAdvancedInput' value='Send' onclick='showRecordsByWidth()'>
        </div>
        `;
    } else {
        console.log('here');
        advancedForm.innerHTML =
            `
            <p id='advancedID' class='advancedID'>       ID          </p>
            <input type='text' id='advancedIdInput' class='advancedIdInput'>

            <p id='advancedLocation' class='advancedLocation'> Location    </p>
            <input type='text' id='advancedLocationInput' class='advancedLocationInput'>

            <p id='advancedDate' class='advancedDate'>     Date        </p>
            <div id = 'advancedDateInput' class = 'advancedDateInput'>
                <input class='dataForm1' type='date' id='dateInputStart'></input>
                <span>-</span>
                <input class='dataForm1' type='date' id='dateInputFinal'></input>
            </div>

            <p id='advancedAttack' class='advancedAttack'>   Attack type </p>
            <input type='text' id='advancedAttackInput' class='advancedAttackInput'>

            <p id='advancedTarget' class='advancedTarget'>   Target type </p>
            <input type='text' id='advancedTargetInput' class='advancedTargetInput'>

            <p id='advancedFiller' class='advancedFiller'></p>
            <input type='button' id='submitAdvancedInput' class='submitAdvancedInput' value='Send' onclick='showRecordsByWidth()'>
        `;
        advancedForm.style.height = '300px';
        advancedForm.style.alignItems = 'center';
        advancedForm.style.textAlign = 'center';
        advancedForm.style.color = 'white';
        advancedForm.style.fontWeight = 'bold';
    }
    if (advancedFormOn == 0) {

        listOfAttacksPage.insertBefore(advancedForm, listOfAttacksPage.children[3]);
        advancedFormOn = 1;
    } else {
        listOfAttacksPage.removeChild(listOfAttacksPage.children[3]);
        advancedFormOn = 0;
    }
}

function showRecordsByInput() {
    parsed1 = parsed1Copy;
    let idValue = -1;
    let locationValue = -1;
    let dateStartValue = -1;
    let dateFinalValue = -1;
    let attackValue = -1;
    let targetValue = -1;
    let idForm;
    let locationForm;
    let dateStartForm;
    let dateFinalForm;
    let attackForm;
    let targetForm;

    if (advancedFormOn == 1) {
        idForm = document.querySelector('#advancedIdInput');
    } else {
        idForm = document.querySelector('#searchText');
    }

    if (`${idForm.value}`) {
        idValue = `${idForm.value}`;
    }

    if (advancedFormOn == 1 && enteredMainForm == 0) {
        locationForm = document.querySelector('#advancedLocationInput');
        if (`${locationForm.value}`) {
            locationValue = `${locationForm.value}`;
        }

        dateStartForm = document.querySelector('#dateInputStart');
        if (`${dateStartForm.value}`) {
            dateStartValue = `${dateStartForm.value}`;
        }
        dateStartTime = new Date(dateStartValue);

        dateFinalForm = document.querySelector('#dateInputFinal');
        if (`${dateFinalForm.value}`) {
            dateFinalValue = `${dateFinalForm.value}`;
        }
        dateFinalTime = new Date(dateFinalValue);

        attackForm = document.querySelector('#advancedAttackInput');
        if (`${attackForm.value}`) {
            attackValue = `${attackForm.value}`;
        }
        targetForm = document.querySelector('#advancedTargetInput');
        if (`${targetForm.value}`) {
            targetValue = `${targetForm.value}`;
        }
    }

    let parsed1Aux = [];
    let timeOnParticularRecord;
    //ID FILTER
    for (let i = 0; i < parsed1.length; i++) {
        timeOnParticularRecord = new Date(`${parsed1[i].date}`);
        if (
            (`${parsed1[i].id}` == idValue || idValue == -1) &&
            (`${parsed1[i].country}` == locationValue || `${parsed1[i].region}` == locationValue || locationValue == -1) &&
            (`${parsed1[i].attackType}` == attackValue || attackValue == -1) &&
            (`${parsed1[i].targType}` == targetValue || targetValue == -1) &&
            (
                enteredMainForm == 1 ||
                (dateStartTime.getTime() <= timeOnParticularRecord.getTime() &&
                    dateFinalTime.getTime() >= timeOnParticularRecord.getTime() ||
                    dateStartValue == -1 ||
                    dateFinalValue == -1
                )
            )
        ) {
            parsed1Aux.push(parsed1[i]);
        }
    }

    parsed1 = parsed1Aux;
}

function basicFormSearch() {
    if (event.keyCode == 13) {
        enteredMainForm = 1;
        showRecordsByInput();
        showRecordsByWidth();
        enteredMainForm = 0;
    }
}
