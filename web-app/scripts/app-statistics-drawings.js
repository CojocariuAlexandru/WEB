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
            window.addEventListener('resize', showRecordsByWidth);
            displayRecords(1, window.innerWidth);
        }, (error) => {
            console.log(error);
        }
    );
}

function showRecordsByWidth(){
    displayRecords(1, window.innerWidth);
}

function displayRecords(pageNumber, windowWidth) {
    let table = document.getElementById('attacksTable');
    table.innerHTML = ``;

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');

    if(windowWidth >= 1000){
        particularRecord.innerHTML = `
                                            <th id='attackID' class='tableCellDataID'>ID</th> 
                                            <th id='locationID' class='tableCellDataAttack'>Location</th> 
                                            <th id='dateID' class='tableCellData'>Date</th>
                                            <th id='attackType' class='tableCellData'>Attack Type</th>
                                            <th id='targetType' class='tableCellData'>Target Type</th>
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
                particularRecord.innerHTML = `<td class='attackInformation'>
                                                <p>ID: ${parsed[i].id}</p>
                                                <p>Location: ${parsed[i].country}, ${parsed[i].region}</p>
                                                <p>Date: data</p>
                                                <p>Target type: </p>
                                                <p>Attack type: </p>
                                            </td>`
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
            listText = listText + `,<span class="changePage" onclick="displayRecords(2)">2</span> >>`;
        }
    } else if (pageNumber * numberPerPage >= parsed.length) {
        listText = listText + `<< `;
        listText = listText + `<span class="changePage" onclick="displayRecords(${pageNumber-1})">${pageNumber-1}, </span>`;
        listText = listText + `${pageNumber}`;
    } else {
        listText = listText + `<< <span class="changePage" onclick="displayRecords(${pageNumber-1})">${pageNumber-1}, </span>`;
        listText = listText + `${pageNumber}, `;
        listText = listText + `<span class="changePage" onclick="displayRecords(${pageNumber+1})">${pageNumber+1} </span> >>`;
    }
    otherAttackList.innerHTML = listText;
    attackListHead.appendChild(otherAttackList);
}
