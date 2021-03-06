var frequencyOfCountries;
var frequencyOfRegions;
var frequencyOfSuccess;
var frequencyOfTargets;
var frequencyOfAttacks;
var frequencyOfWeaponType;
var windowWidth;
var objSVG2dPlots = {};

function initStatisticsResult2D(node) {
    parsed1Copy = parsed1;
    mainContent.innerHTML = loadPage(node.template);

    sort(countries);
    sort(attackTypes);
    sort(targTypes);
    sort(regions);
    sort(weaponTypes);
    sort(damages);

    createMatrices();
    getFrequencies();
    window.addEventListener('resize', drawAllCharts);
    drawAllCharts();
    document.querySelector('#scroll-to').scrollIntoView();
}

function removeDownloadSvgButton(chartType) {
    let toQuery = '.svg-' + chartType + '-button';
    let doc = document.querySelector(toQuery);
    if (doc != null) {
        console.log(toQuery);
        doc.remove();
    }
}

function digitToStr(dig) {
    if (dig < 0 || dig > 6) {
        return 'null';
    }
    if (dig == 1) {
        return 'one;'
    } else if (dig == 2) {
        return 'two';
    } else if (dig == 3) {
        return 'three';
    } else if (dig == 4) {
        return 'four';
    } else if (dig == 5) {
        return 'five';
    }
    return 'six';
}

function drawAllCharts() {
    let headingStatistics2D;
    windowWidth = window.innerWidth;

    let added = 0;

    addSuccessRate();
    if (windowWidth <= 520) {
        windowWidth = windowWidth + 160;
    }
    if (countries.length > 5) {
        objSVG2dPlots.countries = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        addCountryPreferences();
        ++added;
    } else {
        headingStatistics2D = document.querySelector('#headerCountries');
        headingStatistics2D.remove();
        removeDownloadSvgButton('countries');
    }

    if (regions.length > 5) {
        objSVG2dPlots.regions = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        addRegionsPreferences();
        ++added;
    } else {
        headingStatistics2D = document.querySelector('#headerRegions');
        headingStatistics2D.remove();
        removeDownloadSvgButton('regions');
    }

    if (targTypes.length > 5) {
        objSVG2dPlots.attackTargets = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        addTargetPreferences();
        ++added;
    } else {
        headingStatistics2D = document.querySelector('#headerTargets');
        headingStatistics2D.remove();
        removeDownloadSvgButton('attack-targets');
    }

    if (attackTypes.length > 5) {
        objSVG2dPlots.attackMethods = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        addAttackPreferences();
        ++added;
    } else {
        headingStatistics2D = document.querySelector('#headerAttacks');
        headingStatistics2D.remove();
        removeDownloadSvgButton('attack-methods');
    }

    if (weaponTypes.length > 5) {
        objSVG2dPlots.attackWeapons = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        addWeaponTypePreferences();
        ++added;
    } else {
        headingStatistics2D = document.querySelector('#headerWeapons');
        headingStatistics2D.remove();
        removeDownloadSvgButton('weapons');
    }

    let strClass = digitToStr(added);
    let obj = document.querySelector('.statistics-2d-page-csv-options');
    if (obj != null) {
        obj.className = 'optionsCSV statistics-2d-page-csv-options ' + strClass + '-options';
    }
}

// stackoverflow.com/questions/8301400/how-do-you-easily-create-empty-matrices-javascript
function createMatrices() {
    let i;
    let j;
    frequencyOfCountries = [];
    frequencyOfTargets = [];
    frequencyOfAttacks = [];
    frequencyOfRegions = [];
    frequencyOfWeaponType = [];
    for (i = 1; i < countries.length; i++) {
        frequencyOfCountries[countries[i][0]] = [];
        for (j = 0; j <= 2015; j++) {
            frequencyOfCountries[countries[i][0]][j] = 0;
        }
    }
    for (i = 1; i < regions.length; i++) {
        frequencyOfRegions[regions[i][0]] = [];
        for (j = 0; j <= 2015; j++) {
            frequencyOfRegions[regions[i][0]][j] = 0;
        }
    }
    for (i = 1; i < targTypes.length; i++) {
        frequencyOfTargets[targTypes[i][0]] = [];
        for (j = 0; j <= 2015; j++) {
            frequencyOfTargets[targTypes[i][0]][j] = 0;
        }
    }
    for (i = 1; i < attackTypes.length; i++) {
        frequencyOfAttacks[attackTypes[i][0]] = [];
        for (j = 0; j <= 2015; j++) {
            frequencyOfAttacks[attackTypes[i][0]][j] = 0;
        }
    }
    for (i = 1; i < weaponTypes.length; i++) {
        frequencyOfWeaponType[weaponTypes[i][0]] = [];
        for (j = 0; j <= 2015; j++) {
            frequencyOfWeaponType[weaponTypes[i][0]][j] = 0;
        }
    }

    frequencyOfSuccess = [];
    for (i = 0; i <= 2015; i++) {
        frequencyOfSuccess[i] = 0;
    }
}

function getFrequencies() {
    let dateOccured;
    let yearOccured;
    let countryAttacked;
    let successStatus;
    let targetAttacked;
    let attackType;
    let weaopnType;
    for (attack in parsed1) {
        dateOccured = parsed1[attack]["date"];
        dateOccured = dateOccured.substring(0, 4);
        yearOccured = parseInt(dateOccured);

        countryAttacked = parsed1[attack]["country"];
        regionAttacked = parsed1[attack]["region"];
        successStatus = parsed1[attack]["success"];
        targetAttacked = parsed1[attack]["targType"];
        attackType = parsed1[attack]["attackType"];
        weaopnType = parsed1[attack]["weaponType"];

        frequencyOfCountries[countryAttacked][yearOccured] = frequencyOfCountries[countryAttacked][yearOccured] + 1;
        frequencyOfRegions[regionAttacked][yearOccured] = frequencyOfRegions[regionAttacked][yearOccured] + 1;
        frequencyOfTargets[targetAttacked][yearOccured] = frequencyOfTargets[targetAttacked][yearOccured] + 1;
        frequencyOfAttacks[attackType][yearOccured] = frequencyOfAttacks[attackType][yearOccured] + 1;
        frequencyOfWeaponType[weaopnType][yearOccured] = frequencyOfWeaponType[weaopnType][yearOccured] + 1;
        if (successStatus == 1) {
            frequencyOfSuccess[yearOccured] = frequencyOfSuccess[yearOccured] + 1;
        }
    }
}

function createCSVCountries() {
    let csvArray = [
        ["Year",
            "Country",
            "Number_of_attacks"
        ]
    ];

    let i, j;
    for (i = 1; i < countries.length; i++) {
        for (j = 1970; j <= 2015; j++) {
            csvArray.push([j, countries[i][0], frequencyOfCountries[countries[i][0]][j]]);
        }
    }
    return csvArray;
}

function createCSVRegions() {
    let csvArray = [
        ["Year",
            "Regions",
            "Number_of_attacks"
        ]
    ];

    let i, j;
    for (i = 1; i < regions.length; i++) {
        for (j = 1970; j <= 2015; j++) {
            csvArray.push([j, regions[i][0], frequencyOfRegions[regions[i][0]][j]]);
        }
    }
    return csvArray;
}

function createCSVTargetType() {
    let csvArray = [
        ["Year",
            "Target_type",
            "Number_of_attacks"
        ]
    ];

    let i, j;
    for (i = 1; i < targTypes.length; i++) {
        for (j = 1970; j <= 2015; j++) {
            csvArray.push([j, targTypes[i][0], frequencyOfTargets[targTypes[i][0]][j]]);
        }
    }
    return csvArray;
}

function createCSVAttackType() {
    let csvArray = [
        ["Year",
            "Attack_type",
            "Number_of_attacks"
        ]
    ];

    let i, j;
    for (i = 1; i < attackTypes.length; i++) {
        for (j = 1970; j <= 2015; j++) {
            csvArray.push([j, attackTypes[i][0], frequencyOfAttacks[attackTypes[i][0]][j]]);
        }
    }
    return csvArray;
}

function createCSVWeaponType() {
    let csvArray = [
        ["Year",
            "Weapon_type",
            "Number_of_attacks"
        ]
    ];

    let i, j;
    for (i = 1; i < weaponTypes.length; i++) {
        for (j = 1970; j <= 2015; j++) {
            csvArray.push([j, weaponTypes[i][0], frequencyOfWeaponType[weaponTypes[i][0]][j]]);
        }
    }
    return csvArray;
}

function downloadCsv2D(whichRaport) {
    let rows;
    if (whichRaport.localeCompare('country') == 0) {
        rows = createCSVCountries();
    } else if (whichRaport.localeCompare('region') == 0) {
        rows = createCSVRegions();
    } else if (whichRaport.localeCompare('target') == 0) {
        rows = createCSVTargetType();
    } else if (whichRaport.localeCompare('attack') == 0) {
        rows = createCSVAttackType();
    } else {
        rows = createCSVWeaponType();
    }

    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "countries.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

function addCountryPreferences() {
    let i;
    let data;
    let countryPreferencesDocument = document.querySelector('.plotCountry');

    objSVG2dPlots.countries[6] = [countries[1][0], countries[2][0], countries[3][0], countries[4][0], countries[5][0]];
    data = [];
    data.push(['Year', countries[1][0], countries[2][0], countries[3][0], countries[4][0], countries[5][0]]);
    for (i = 1970; i <= 2025; i++) {
        objSVG2dPlots.countries[0].push(frequencyOfCountries[countries[1][0]][i]);
        objSVG2dPlots.countries[1].push(frequencyOfCountries[countries[2][0]][i]);
        objSVG2dPlots.countries[2].push(frequencyOfCountries[countries[3][0]][i]);
        objSVG2dPlots.countries[3].push(frequencyOfCountries[countries[4][0]][i]);
        objSVG2dPlots.countries[4].push(frequencyOfCountries[countries[5][0]][i]);
        objSVG2dPlots.countries[5].push(i);

        data.push([i.toString(), frequencyOfCountries[countries[1][0]][i], frequencyOfCountries[countries[2][0]][i], frequencyOfCountries[countries[3][0]][i], frequencyOfCountries[countries[4][0]][i], frequencyOfCountries[countries[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of attacks per country in the last years',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(countryPreferencesDocument);
        chart.draw(dataForChart, options);
    }
}

function addRegionsPreferences() {
    let i;
    let data;
    let countryPreferencesDocument = document.querySelector('.plotRegion');

    objSVG2dPlots.regions[6] = [regions[1][0], regions[2][0], regions[3][0], regions[4][0], regions[5][0]];
    data = [];
    data.push(['Year', regions[1][0], regions[2][0], regions[3][0], regions[4][0], regions[5][0]]);
    for (i = 1970; i <= 2025; i++) {
        objSVG2dPlots.regions[0].push(frequencyOfRegions[regions[1][0]][i]);
        objSVG2dPlots.regions[1].push(frequencyOfRegions[regions[2][0]][i]);
        objSVG2dPlots.regions[2].push(frequencyOfRegions[regions[3][0]][i]);
        objSVG2dPlots.regions[3].push(frequencyOfRegions[regions[4][0]][i]);
        objSVG2dPlots.regions[4].push(frequencyOfRegions[regions[5][0]][i]);
        objSVG2dPlots.regions[5].push(i);

        data.push([i.toString(), frequencyOfRegions[regions[1][0]][i], frequencyOfRegions[regions[2][0]][i], frequencyOfRegions[regions[3][0]][i], frequencyOfRegions[regions[4][0]][i], frequencyOfRegions[regions[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of attacks per globe region in the last years',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(countryPreferencesDocument);
        chart.draw(dataForChart, options);
    }
}

function addSuccessRate() {
    let i;
    let data;
    let successRateDocument = document.querySelector('.plotSuccess');
    data = [];
    data.push(['Year', 'Successful terrorist attacks']);
    for (i = 1970; i <= 2025; i++) {
        data.push([i.toString(), frequencyOfSuccess[i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of successful attacks in the last years',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(successRateDocument);
        chart.draw(dataForChart, options);
    }
}

function addTargetPreferences() {
    let i;
    let data;

    objSVG2dPlots.attackTargets[6] = [targTypes[1][0], targTypes[2][0], targTypes[3][0], targTypes[4][0], targTypes[5][0]];
    let countryTargetDocument = document.querySelector('.plotTargets');
    data = [];
    data.push(['Year', targTypes[1][0], targTypes[2][0], targTypes[3][0], targTypes[4][0], targTypes[5][0]]);
    for (i = 1970; i <= 2025; i++) {
        objSVG2dPlots.attackTargets[0].push(frequencyOfTargets[targTypes[1][0]][i]);
        objSVG2dPlots.attackTargets[1].push(frequencyOfTargets[targTypes[2][0]][i]);
        objSVG2dPlots.attackTargets[2].push(frequencyOfTargets[targTypes[3][0]][i]);
        objSVG2dPlots.attackTargets[3].push(frequencyOfTargets[targTypes[4][0]][i]);
        objSVG2dPlots.attackTargets[4].push(frequencyOfTargets[targTypes[5][0]][i]);
        objSVG2dPlots.attackTargets[5].push(i);

        data.push([i.toString(), frequencyOfTargets[targTypes[1][0]][i], frequencyOfTargets[targTypes[2][0]][i], frequencyOfTargets[targTypes[3][0]][i], frequencyOfTargets[targTypes[4][0]][i], frequencyOfTargets[targTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of attacks which had a certain type of target',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(countryTargetDocument);
        chart.draw(dataForChart, options);
    }
}

function addAttackPreferences() {
    let i;
    let data;
    let countryTargetDocument = document.querySelector('.plotAttacks');

    objSVG2dPlots.attackMethods[6] = [attackTypes[1][0], attackTypes[2][0], attackTypes[3][0], attackTypes[4][0], attackTypes[5][0]];
    data = [];
    data.push(['Year', attackTypes[1][0], attackTypes[2][0], attackTypes[3][0], attackTypes[4][0], attackTypes[5][0]]);
    for (i = 1970; i <= 2025; i++) {
        objSVG2dPlots.attackMethods[0].push(frequencyOfAttacks[attackTypes[1][0]][i]);
        objSVG2dPlots.attackMethods[1].push(frequencyOfAttacks[attackTypes[2][0]][i]);
        objSVG2dPlots.attackMethods[2].push(frequencyOfAttacks[attackTypes[3][0]][i]);
        objSVG2dPlots.attackMethods[3].push(frequencyOfAttacks[attackTypes[4][0]][i]);
        objSVG2dPlots.attackMethods[4].push(frequencyOfAttacks[attackTypes[5][0]][i]);
        objSVG2dPlots.attackMethods[5].push(i);

        data.push([i.toString(), frequencyOfAttacks[attackTypes[1][0]][i], frequencyOfAttacks[attackTypes[2][0]][i], frequencyOfAttacks[attackTypes[3][0]][i], frequencyOfAttacks[attackTypes[4][0]][i], frequencyOfAttacks[attackTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of attacks which used a certain method of attacking',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(countryTargetDocument);
        chart.draw(dataForChart, options);
    }
}

function addWeaponTypePreferences() {
    let i;
    let data;
    let countryTargetDocument = document.querySelector('.plotWeaponType');

    objSVG2dPlots.attackWeapons[6] = [weaponTypes[1][0], weaponTypes[2][0], weaponTypes[3][0], weaponTypes[4][0], weaponTypes[5][0]];
    data = [];
    data.push(['Year', weaponTypes[1][0], weaponTypes[2][0], weaponTypes[3][0], weaponTypes[4][0], weaponTypes[5][0]]);
    for (i = 1970; i <= 2025; i++) {
        objSVG2dPlots.attackWeapons[0].push(frequencyOfWeaponType[weaponTypes[1][0]][i]);
        objSVG2dPlots.attackWeapons[1].push(frequencyOfWeaponType[weaponTypes[2][0]][i]);
        objSVG2dPlots.attackWeapons[2].push(frequencyOfWeaponType[weaponTypes[3][0]][i]);
        objSVG2dPlots.attackWeapons[3].push(frequencyOfWeaponType[weaponTypes[4][0]][i]);
        objSVG2dPlots.attackWeapons[4].push(frequencyOfWeaponType[weaponTypes[5][0]][i]);
        objSVG2dPlots.attackWeapons[5].push(i);

        data.push([i.toString(), frequencyOfWeaponType[weaponTypes[1][0]][i], frequencyOfWeaponType[weaponTypes[2][0]][i], frequencyOfWeaponType[weaponTypes[3][0]][i], frequencyOfWeaponType[weaponTypes[4][0]][i], frequencyOfWeaponType[weaponTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dataForChart = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Number of attacks which used a certain weapon',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        var chart = new google.visualization.LineChart(countryTargetDocument);
        chart.draw(dataForChart, options);
    }
}

function goBackToMainStatisticsPage() {
    parsed1 = parsed1Copy;
    mainContent.innerHTML = getLoaderHTML();
    setTimeout(() => {
        navigateRoot('/statistics-results');
    }, 100);
}

// https://plotly.com/javascript/line-charts/
function downloadSVG2D(fileName, objProp, plotName) {
    if (objSVG2dPlots[objProp] == null) {
        return;
    }

    let trace1 = {
        x: objSVG2dPlots[objProp][5],
        y: objSVG2dPlots[objProp][0],
        mode: 'lines',
        name: objSVG2dPlots[objProp][6][0]
    };
    let trace2 = {
        x: objSVG2dPlots[objProp][5],
        y: objSVG2dPlots[objProp][1],
        mode: 'lines',
        name: objSVG2dPlots[objProp][6][1]
    };
    let trace3 = {
        x: objSVG2dPlots[objProp][5],
        y: objSVG2dPlots[objProp][2],
        mode: 'lines',
        name: objSVG2dPlots[objProp][6][2]
    };
    let trace4 = {
        x: objSVG2dPlots[objProp][5],
        y: objSVG2dPlots[objProp][3],
        mode: 'lines',
        name: objSVG2dPlots[objProp][6][3]
    };
    let trace5 = {
        x: objSVG2dPlots[objProp][5],
        y: objSVG2dPlots[objProp][4],
        mode: 'lines',
        name: objSVG2dPlots[objProp][6][4]
    };

    let data = [trace1, trace2, trace3, trace4, trace5];
    let layout = {
        title: plotName
    };

    let el = document.createElement('div');
    Plotly.newPlot(el, data, layout).then(function (gd) {
        Plotly.downloadImage(gd, {
            format: 'svg',
            filename: fileName
        });
    });
}
