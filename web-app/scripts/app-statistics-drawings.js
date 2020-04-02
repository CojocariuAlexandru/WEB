function statisticsDrawingsPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);

    generateRecords();
    generateOtherLists();
}

var numberOfRecords = 10;

function generateRecords() {
    let attackListHead = document.querySelector('.recordList');
    let table = document.createElement('table');
    table.setAttribute('class', 'attacksTable');
    attackListHead.appendChild(table);

    let particularRecord = document.createElement('tr');
    particularRecord.setAttribute('class', 'headingRecordList');
    particularRecord.innerHTML = `
                                        <th class='attackID'>ID</th> 
                                        <th class='locationID'>Location</th> 
                                        <th class='dateID'>Date</th>
                                `;
    table.appendChild(particularRecord);
    for (let i = 0; i < numberOfRecords; i++) {
        particularRecord = document.createElement('tr');
        particularRecord.setAttribute('class', 'particularRecord');
        particularRecord.innerHTML = `
                                    <td class='attackID'>Terrorist attack #${i}</td>
                                    <td class='locationID'>Country, Region</td>
                                    <td class='dateID'>YYYY/MM/DD</td>
                                    `;
        if (i % 2 == 1) {
            particularRecord.style.backgroundColor = '#222831';
        }
        table.appendChild(particularRecord);
    }
}

function generateOtherLists() {
    let attackListHead = document.querySelector('.otherLists');
    let otherAttackList = document.createElement('footer');
    let listText = "<p class = 'numberList'> << ";
    for (let i = 0; i * 20 <= numberOfRecords; i++) {
        if (i * 20 + 20 <= numberOfRecords) {
            listText = listText + `${i+1}, `;
        } else {
            listText = listText + `${i+1} >> </p> `;

        }
    }
    otherAttackList.innerHTML = listText;
    attackListHead.appendChild(otherAttackList);
}
