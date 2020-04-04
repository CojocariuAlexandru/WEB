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
            displayRecords(1);
        }, (error) => {
            console.log(error);
        }
    );
}

function displayRecords(pageNumber) {
    let table = document.getElementById('attacksTable');
    table.innerHTML = ``;

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');
    particularRecord.innerHTML = `
                                        <th class='attackID'>ID</th> 
                                        <th class='locationID'>Location</th> 
                                        <th class='dateID'>Date</th>
                                `;
    table.appendChild(particularRecord);

    for (let i = (pageNumber - 1) * numberPerPage; i < pageNumber * numberPerPage && i < parsed.length; i++) {
        particularRecord = document.createElement('tr');
        particularRecord.setAttribute('class', 'particularRecord');
        particularRecord.innerHTML = `
                            <td class='attackID'>${parsed[i].id}</td>
                            <td class='locationID'>${parsed[i].country}, ${parsed[i].region} </td>
                            <td class='dateID'>YYYY/MM/DD</td>
                            `;
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
