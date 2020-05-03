var countries;
var attackTypes;
var targTypes;
var regions;
var dateFrequency;
var weaponTypes;

function fillField(filters1, name) {
    if (filters1[name] == "") {
        return "All";
    } else {
        return filters1[name];
    }
}

function getFilters() {
    let resultFilters = {};
    filters = JSON.parse(filters);
    if (filters["dateStart"] == "") {
        resultFilters["dateStart"] = "01/01/1970";
    } else {
        resultFilters["dateStart"] = filters["dateStart"];
    }

    //https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    if (filters["dateFinal"] == "") {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        resultFilters["dateFinal"] = today;
    } else {
        resultFilters["dateFinal"] = filters["dateFinal"];
    }

    resultFilters["country"] = fillField(filters, "country");
    resultFilters["region"] = fillField(filters, "region");

    resultFilters["terrCount"] = filters["terrCount"];
    resultFilters["killsCount"] = filters["killsCount"];
    resultFilters["woundedCount"] = filters["woundedCount"];

    resultFilters["attackType"] = attackTypes[1][0];
    resultFilters["targType"] = targTypes[1][0];

    console.log(resultFilters);

    return resultFilters;
}

function constructParagraf(countries, name, title, exclude) {
    let elem = document.querySelector(name);
    elem.innerHTML = ``;

    let header = document.createElement('h3');
    header.innerHTML = title;
    elem.appendChild(header);

    let list = document.createElement('ul');
    let i = 0;
    for (country in countries) {
        if (countries[country][0] != exclude) {
            let el = document.createElement('li');
            el.innerHTML = countries[country][0];
            list.appendChild(el);
        }
        if (i > 10) break;
        i++;
    }

    elem.appendChild(list);
}

function statisticsResultsPageInit(node) {
    countries = getData('Country', 'Most frequently attacked', "country");
    sort(countries);
    attackTypes = getData('AttackType', 'Most frequently attackTypes', "attackType");
    sort(attackTypes);
    targTypes = getData('TargetType', 'Most frequently types of target', "targType");
    sort(targTypes);
    datesAppearing = getData('date', 'Most frequent dates', 'date');
    regions = getData('region', 'Most frequently attacked regions', 'region');
    sort(regions);
    weaponTypes = getData('weaponType', 'Most frequently used weapons', 'weaponType');
    sort(weaponTypes);
    console.log(weaponTypes);

    dateFrequency = [];
    let i;
    for (i = 0; i <= 2030; i++) {
        dateFrequency[i] = 0;
    }
    for (attack in parsed1) {
        dateFrequency[parseInt(parsed1[attack][1].substring(0, 4))] = dateFrequency[parseInt(parsed1[attack][1].substring(0, 4))] + 1;
    }
    resultFilters = getFilters();

    let compiledTemplate = Handlebars.compile(loadPage(node.template));
    mainContent.innerHTML = compiledTemplate(resultFilters);

    console.log(parsed1);

    addPiechart();
    addPiechart2();
    addPiechart3();
    addColumnChart();

    constructParagraf(countries, ".details-1", "Most frequently attacked", "Country");
    constructParagraf(attackTypes, ".details-2", "Most frequently attackTypes", "AttackType");
    constructParagraf(targTypes, ".details-3", "Most frequently targetTyes", "TargetType");
}

function getData(name, details, field) {
    let data = [
        [name, details]
    ];
    let ok;

    for (attack in parsed1) {
        ok = 0;
        for (country in data) {
            if (data[country][0] == parsed1[attack][field]) {
                data[country][1]++;
                ok = 1;
            }
        }
        if (ok == 0) {
            data.push([parsed1[attack][field], 1]);
        }
    }
    return data;
}

function sort(arrayOfArrays) {
    let aux;
    let i;
    let j;
    for (i = 1; i < arrayOfArrays.length - 1; i++) {
        for (j = i + 1; j < arrayOfArrays.length; j++) {
            if (arrayOfArrays[i][1] < arrayOfArrays[j][1]) {
                aux = arrayOfArrays[i];
                arrayOfArrays[i] = arrayOfArrays[j];
                arrayOfArrays[j] = aux;
            }
        }
    }
}

function addPiechart() {
    let piechartDivision = document.querySelector('.pie-1');
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(countries);
        var options = {
            // 'title' : 'Most frequently attacked',
            'fontSize': 10,
            'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
            'width': '100%',
            'height': 300,
            'is3D': true,
            'backgroundColor': 'transparent',
            'margin': '0 auto'
        };
        var chart = new google.visualization.PieChart(piechartDivision);
        chart.draw(data, options);
    }
}

function addPiechart2() {
    let piechartDivision = document.querySelector('.pie-2');
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(attackTypes);
        var options = {
            // 'title' : 'Most used attack',
            'fontSize': 10,
            'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
            'width': '100%',
            'height': 300,
            'is3D': true,
            'backgroundColor': 'transparent',
            'margin': '0 auto'
        };
        var chart = new google.visualization.PieChart(piechartDivision);
        chart.draw(data, options);
    }
}

function addPiechart3() {
    let piechartDivision = document.querySelector('.pie-3');

    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(targTypes);
        var options = {
            // 'title' : 'Most used attack',
            'fontSize': 10,
            'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
            'width': '100%',
            'height': 300,
            'is3D': true,
            'backgroundColor': 'transparent',
            'margin': '0 auto'
        };
        var chart = new google.visualization.PieChart(piechartDivision);
        chart.draw(data, options);
    }
}

function addColumnChart() {
    let columnCharDivision = document.querySelector('.world-map-element');
    let dataForChart = [
        ['Year', 'number']
    ];
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);


    for (i in dateFrequency) {
        if (dateFrequency[i] > 0) {
            dataForChart.push([i.toString(), dateFrequency[i]]);
        }
    }

    function drawChart() {
        var data = google.visualization.arrayToDataTable(dataForChart);

        //dupa un model de pe internet
        var options = {
            focusTarget: 'category',
            backgroundColor: 'transparent',
            colors: ['#5b9a9e', 'tomato'],
            chartArea: {
                width: '80%',
                height: '50%'
            },
            bar: {
                groupWidth: '20%'
            },
            hAxis: {
                textStyle: {
                    fontSize: 12,
                    color: '#71c9ce'
                }
            },
            vAxis: {
                minValue: 0,
                maxValue: 1500,
                gridlines: {
                    count: 4
                },
                textStyle: {
                    fontSize: 12,
                    color: '#71c9ce'
                }
            },
            legend: {
                textStyle: {
                    fontSize: 12,
                    color: '#71c9ce'
                }
            }
        };

        var chart = new google.charts.Bar(columnCharDivision);

        chart.draw(data, google.charts.Bar.convertOptions(options));
    }
}

// ---------------------------------LOADING BARS -----------------------------------------

function getAttacksRate() {
    let nrSuccess = 0;
    for (attack in parsed1) {
        if (parsed1[attack]["extended"] == "1") {
            nrSuccess++;
        }
    }
    nrSuccess = nrSuccess * 100;
    return nrSuccess / parsed1.length;
}

function getExtendRate() {
    let nrExtended = 0;
    for (attack in parsed1) {
        if (parsed1[attack]["extended"] == "1") {
            nrExtended++;
        }
    }
    nrExtended = nrExtended * 100;
    return nrExtended / parsed1.length;
}

function getDamageMade() {
    let damageType1 = [
        ["Minor (likely < $1 million)", 0],
        ["unknown", 0],
        ["Major (likely >= $1 million but < $1 billion", 0]
    ];
    let ok;
    for (attack in parsed1) {
        ok = 0;
        for (damage in damageType1) {
            if (damageType1[damage][0] == parsed1[attack]["propExtent"]) {
                damageType1[damage][1]++;
                break;
            }
            if (parsed1[attack]["propExtent"] == "" && damageType1[damage][0] == "unknown") {
                damageType1[damage][1]++;
                break;
            }
        }
    }
    for (damage in damageType1) {
        damageType1[damage][1] = Math.floor(damageType1[damage][1] * 100 / parsed1.length);
    }
    let rate1 = damageType1[0][1];
    let rate2 = damageType1[1][1];

    damageType1[2][1] = 100 - (rate1 + rate2);

    console.log(damageType1[0][1]);
    console.log(damageType1[1][1]);
    console.log(damageType1[2][1]);

    return damageType1;
}

// w3 schools load bars
function move() {
    let rate = getAttacksRate();
    let valueAttackRate = rate;
    if (15 - rate > 0) {
        rate = 15;
    }
    var elem = document.getElementById("myBar");
    var width = 0;

    var elem2 = document.getElementById("myBar2");
    var elem2_2 = document.getElementById("myBar2-2");
    var elem2_3 = document.getElementById("myBar2-3");

    elem2.style.width = 0 + '%';
    elem2_2.style.width = 0 + '%';
    elem2_3.style.width = 0 + '%';

    var damage = getDamageMade();
    let value1 = damage[0][1];
    let value2 = damage[1][1];
    let value3 = damage[2][1];

    let dif1 = 20 - value1;
    let dif2 = 20 - value3;

    if (dif2 > 0) {
        damage[1][1] = damage[1][1] - dif2;
        damage[2][1] += dif2;
    }
    if (dif1 > 0) {
        damage[1][1] = damage[1][1] - dif1;
        damage[0][1] += dif1;
    }

    var width2 = 0;
    var width2_2 = damage[0][1];
    var width2_3 = damage[0][1] + damage[1][1];

    elem2_2.style.left = width2_2 + '%';
    elem2_3.style.left = width2_3 + '%';

    var id = setInterval(frame, 20);

    function frame() {
        if (width >= rate) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
            elem.innerHTML = `<p>` + valueAttackRate * 1 + '% </p>';
        }
    }

    var id2 = setInterval(frame2, 20);

    function frame2() {
        if (width2 < damage[0][1]) {
            width2++;
            elem2.style.width = width2 + '%';
            elem2.innerHTML = `<p>` + value1 * 1 + '% &#8595 </p>';
        } else if (width2_2 < damage[0][1] + damage[1][1]) {
            width2_2++;
            elem2_2.style.width = (width2_2 - damage[0][1]) + '%';
            elem2_2.innerHTML = `<p>` + value2 + '% </p>';
        } else if (width2_3 < 100) {
            width2_3++;
            elem2_3.style.width = (width2_3 - (damage[0][1] + damage[1][1])) + '%';
            elem2_3.innerHTML = `<p>` + value3 + '%  &#8593;</p>';
        } else {
            clearInterval(id2);
        }
    }

    var rate1 = getExtendRate();
    let valueExtendRate = rate1;
    if (15 - rate1 > 0) {
        rate1 = 15;
    }
    var elem3 = document.getElementById("myBar3");
    var width3 = 0;
    var id3 = setInterval(frame3, 20);

    function frame3() {
        if (width3 >= rate1) {
            clearInterval(id3);
        } else {
            width3++;
            elem3.style.width = width3 + '%';
            elem3.innerHTML = `<p>` + valueExtendRate + '% </p>';
        }
    }
}


// https://html2canvas.hertzen.com/
// https://www.youtube.com/watch?v=IEKEV02TVew
function downloadImageAs(imageType){
    console.log('exporting image...');
    let imageToBePrinted = document.querySelector('.grid-container');
    html2canvas(imageToBePrinted).then(canvas => {
        canvas.toBlob(
            function(blob){
                saveAs(blob, "raport." + imageType);
                }
            , "image/" + imageType);
    });

    
}