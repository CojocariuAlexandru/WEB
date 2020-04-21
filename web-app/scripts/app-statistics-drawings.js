var setIdCriteria=-1;
var setLocationCriteria=-1;
var setDateCriteria=-1;
var setTargetTypeCriteria=-1;
var setAttackTypeCriteria=-1;
var currentPageNumber = 1;
var advancedFormOn = 0;

function statisticsDrawingsPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);
    generateRecords();
}

let parsed;
let numberPerPage = 10;

function generateRecords() {
    let attackListHead = document.querySelector('.recordList');
    let table = document.createElement('table');
    table.setAttribute('id', 'attacksTable');
    table.setAttribute('class', 'attacksTable')
    attackListHead.appendChild(table);
    httpGET("http://localhost:8001/api/attacks",
        (result) => {
            parsed = JSON.parse(result.res);
            console.log(parsed);
            window.addEventListener('resize', showRecordsByWidth);
            displayRecords(1, window.innerWidth);
            showProperPlaceHolderAdvancedText(window.innerWidth);
        }, (error) => {
            console.log(error);
        }
    );
}

function showRecordsByWidth(){
    showProperPlaceHolderAdvancedText(window.innerWidth);
    displayRecords(currentPageNumber, window.innerWidth);
}

function showProperPlaceHolderAdvancedText(windowWidth){
    let advancedSearch = document.querySelector('#searchText');
    if(windowWidth >= 600){
        advancedSearch.setAttribute('placeholder', 'Search attack by ID');
    }
    else{
        advancedSearch.setAttribute('placeholder', 'Search by ID');
    }
}

function displayRecords(pageNumber, windowWidth) {
    console.log(currentPageNumber);
    let table = document.getElementById('attacksTable');
    table.innerHTML = ``;

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');

    if(windowWidth >= 1000){
        particularRecord.innerHTML = `
                                            <th id='attackIDHeader' class='tableCellDataID' onclick='sortByID()'>ID &#x21C5</th> 
                                            <th id='locationIDHeader' class='tableCellDataAttack' onclick='sortByLocation()'>Location &#x21C5</th> 
                                            <th id='dateIDHeader' class='tableCellData'>Date &#x21C5</th>
                                            <th id='attackTypeHeader' class='tableCellData'>Attack Type &#x21C5</th>
                                            <th id='targetTypeHeader' class='tableCellData'>Target Type &#x21C5</th>
                                    `;
        }
        else{
            particularRecord.innerHTML = `<th class='attackInformation'>Attacks information</th> `
        }
    table.appendChild(particularRecord);

    for (let i = (pageNumber - 1) * numberPerPage; i < pageNumber * numberPerPage && i < parsed.length; i++) {
        particularRecord = document.createElement('tr');
        particularRecord.setAttribute('class', 'particularRecord');
        if(windowWidth >= 1000){
            particularRecord.innerHTML = `
                                <td id='attackID' class='tableCellDataID'>${parsed[i].id}</td>
                                <td id='locationID' class='tableCellDataAttack'>${parsed[i].country}, ${parsed[i].region} </td>
                                <td id='dateID' class='tableCellData'>YYYY/MM/DD</td>
                                <td id='attackType' class='tableCellData'>Attack Type</td>
                                <td id='targetType' class='tableCellData'>Target Type</td>
                                `;
            }
            else{
                particularRecord.innerHTML = 
                `
                <td class='attackInformation'>
                    <p><span class='smallScreenHeader'>ID:         </span> ${parsed[i].id}                          </p>
                    <p><span class='smallScreenHeader'>Location:   </span> ${parsed[i].country}, ${parsed[i].region}</p>
                    <p><span class='smallScreenHeader'>Date:       </span>                                          </p>
                    <p><span class='smallScreenHeader'>Target type:</span>                                          </p>
                    <p><span class='smallScreenHeader'>Attack type:</span>                                          </p>
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

function generateOtherLists(pageNumber) {
    let attackListHead = document.querySelector('.otherLists');
    attackListHead.innerHTML = ``;
    let otherAttackList = document.createElement('footer');
    let listText = `<p class = 'numberList'>`;
    console.log(pageNumber * numberPerPage);
    console.log(parsed.length);

    if (pageNumber == 1) {
        listText = listText + `1`;
        if (pageNumber * numberPerPage < parsed.length) {
            listText = listText + `,<span class="changePage" onclick="increasePageNumber();showRecordsByWidth()">2</span> >>`;
        }
    } else if (pageNumber * numberPerPage >= parsed.length) {
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


function sortByID(){
    if(setIdCriteria == 1){
        parsed.sort(sortIdCriteriaAscending);
        setIdCriteria = -1;
    }
    else{
        parsed.sort(sortIdCriteriaDescending)
        setIdCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortIdCriteriaAscending(a, b){
    let valA = parseInt(a.id);
    let valB = parseInt(b.id);
    if(valA > valB){
        return 1;
    }
    else if(valB > valA){
        return -1;
    }
    else{
        return 0;
    }
}

function sortIdCriteriaDescending(a, b){
    let valA = parseInt(a.id);
    let valB = parseInt(b.id);
    if(valA > valB){
        return -1;
    }
    else if(valB > valA){
        return 1;
    }
    else{
        return 0;
    }
}

function sortByLocation(){
    if(setLocationCriteria == 1){
        parsed.sort(sortLocationCriteriaAscending);
        setLocationCriteria = -1;
    }
    else{
        parsed.sort(sortLocationCriteriaDescending)
        setLocationCriteria = 1;
    }
    displayRecords(1, window.innerWidth);
}

function sortLocationCriteriaAscending(a, b){
    valA = a.country; 
    valB = b.country;
    if(valA > valB){
        return 1;
    }
    else if(valB > valA){
        return -1;
    }
    else{
        valA = a.region;
        valB = b.region;
        if(valA > valB){
            return 1;
        }
        else if(valB > valA){
            return -1;
        }
        else{
            return 0;
        }
    }
}

function sortLocationCriteriaDescending(a, b){
    valA = a.country; 
    valB = b.country;
    if(valA > valB){
        return -1;
    }
    else if(valB > valA){
        return 1;
    }
    else{
        valA = a.region;
        valB = b.region;
        if(valA > valB){
            return -1;
        }
        else if(valB > valA){
            return 1;
        }
        else{
            return 0;
        }
    }
}

function reducePageNumber(){
    currentPageNumber = currentPageNumber - 1;
}

function increasePageNumber(){
    currentPageNumber = currentPageNumber + 1;
}


function showAdvancedForm(){
    let listOfAttacksPage = document.querySelector('.listOfAttacks');
    if(advancedFormOn == 0){

        let advancedForm = document.createElement('div');
        advancedForm.setAttribute('id', 'advancedForm');
        advancedForm.innerHTML = 
        `
        <div id = 'searchCriteriaAdvancedForm'>
            <p id='advancedID'>       ID          </p>
            <p id='advancedLocation'> Location    </p>
            <p id='advancedDate'>     Date        </p>
            <p id='advancedAttack'>   Attack type </p>
            <p id='advancedTarget'>   Target type </p>
        </div>
        <div id = 'searchCriteriaAdvancedInput'>
            <input type='text' id='advancedIdInput'>
            <input type='text' id='advancedLocationInput'>
            <div id = 'advancedDateInput'>
                <input class='dataForm1' type='date' id='dateInputStart'></input>
                <span>-</span>
                <input class='dataForm1' type='date' id='dateInputFinal'></input>
            </div>
            <input type='text' id='advancedAttackInput'>
            <input type='text' id='advancedTargetInput'>
        </div>
        `;
        listOfAttacksPage.insertBefore(advancedForm, listOfAttacksPage.children[2]);
        advancedFormOn = 1;
    }
    else{
        listOfAttacksPage.removeChild(listOfAttacksPage.children[2]);
        advancedFormOn = 0;
    }
}