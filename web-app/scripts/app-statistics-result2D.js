var frequencyOfCountries;
var frequencyOfSuccess;
var frequencyOfTargets;
var frequencyOfAttacks;
var windowWidth;


function initStatisticsResult2D(node){
    mainContent.innerHTML = loadPage(node.template);
    console.log(attackTypes);
    createMatrices();
    getFrequencies();
    window.addEventListener('resize', drawAllCharts);

    drawAllCharts();
}

function drawAllCharts(){
    windowWidth = window.innerWidth;
    if(windowWidth <= 520)
        windowWidth = windowWidth + 160;
    addCountryPreferences();
    addSuccessRate();
    addTargetPreferences();
    addAttackPreferences();
}

// stackoverflow.com/questions/8301400/how-do-you-easily-create-empty-matrices-javascript
function createMatrices(){
    let i;
    let j;
    frequencyOfCountries = [];
    frequencyOfTargets = [];
    frequencyOfAttacks = [];
    for(i=1; i < countries.length; i++){
        frequencyOfCountries[countries[i][0]] = [];
        for(j=0; j<=2015; j++){
            frequencyOfCountries[countries[i][0]][j] = 0;
        }
    }
    for(i=1; i < targTypes.length; i++){
        frequencyOfTargets[targTypes[i][0]] = [];
        for(j=0; j<=2015; j++){
            frequencyOfTargets[targTypes[i][0]][j] = 0;
        }
    }
    for(i=1; i < attackTypes.length; i++){
        frequencyOfAttacks[attackTypes[i][0]] = [];
        for(j=0; j<=2015; j++){
            frequencyOfAttacks[attackTypes[i][0]][j] = 0;
        }
    }

    frequencyOfSuccess = [];
    for(i=0; i<=2015; i++){
        frequencyOfSuccess[i] = 0;
    }
}

function getFrequencies(){
    let dateOccured;
    let yearOccured;
    let countryAttacked;
    let successStatus;
    let targetAttacked;
    let attackType;
    for(attack in parsed1){
        dateOccured = parsed1[attack]["date"];
        dateOccured = dateOccured.substring(0, 4);
        yearOccured = parseInt(dateOccured);

        countryAttacked = parsed1[attack]["country"];
        successStatus = parsed1[attack]["success"];
        targetAttacked = parsed1[attack]["targType"];
        attackType = parsed1[attack]["attackType"];

        frequencyOfCountries[countryAttacked][yearOccured] = frequencyOfCountries[countryAttacked][yearOccured] + 1;
        frequencyOfTargets[targetAttacked][yearOccured] = frequencyOfTargets[targetAttacked][yearOccured] + 1;
        frequencyOfAttacks[attackType][yearOccured] = frequencyOfAttacks[attackType][yearOccured] + 1;
        if(successStatus == 1){
            frequencyOfSuccess[yearOccured] =  frequencyOfSuccess[yearOccured] + 1;
        }
    }
}

function addCountryPreferences(){
    let i;
    let data;
    let countryPreferencesDocument = document.querySelector('.plotCountry');

    data = [];
    data.push(['Year', countries[1][0], countries[2][0], countries[3][0], countries[4][0], countries[5][0]]);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfCountries[countries[1][0]][i], frequencyOfCountries[countries[2][0]][i], frequencyOfCountries[countries[3][0]][i], frequencyOfCountries[countries[4][0]][i], frequencyOfCountries[countries[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of attacks per country in the last years',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(countryPreferencesDocument);
          chart.draw(dataForChart, options);
    }
}

function addSuccessRate(){
    let i;
    let data;
    let successRateDocument = document.querySelector('.plotSuccess');
    data = [];
    data.push(['Year', 'Successful terrorist attacks']);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfSuccess[i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of successful attacks in the last years',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(successRateDocument);
          chart.draw(dataForChart, options);
    }
}

function addTargetPreferences(){
    let i;
    let data;
    let countryTargetDocument = document.querySelector('.plotTargets');
    data = [];
    data.push(['Year', targTypes[1][0], targTypes[2][0], targTypes[3][0], targTypes[4][0], targTypes[5][0]]);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfTargets[targTypes[1][0]][i], frequencyOfTargets[targTypes[2][0]][i], frequencyOfTargets[targTypes[3][0]][i], frequencyOfTargets[targTypes[4][0]][i], frequencyOfTargets[targTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of attacks which had a certain type of target',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(countryTargetDocument);
          chart.draw(dataForChart, options);
    }
}

function addAttackPreferences(){
    let i;
    let data;
    let countryTargetDocument = document.querySelector('.plotAttacks');
    data = [];
    data.push(['Year', attackTypes[1][0], attackTypes[2][0], attackTypes[3][0], attackTypes[4][0], attackTypes[5][0]]);
    for(i=1970; i<=2025; i++){
        data.push([i.toString(), frequencyOfAttacks[attackTypes[1][0]][i], frequencyOfAttacks[attackTypes[2][0]][i], frequencyOfAttacks[attackTypes[3][0]][i], frequencyOfAttacks[attackTypes[4][0]][i], frequencyOfAttacks[attackTypes[5][0]][i]]);
    }
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var dataForChart = google.visualization.arrayToDataTable(data);
          var options = {
            title: 'Number of attacks which used a certain method of attacking',
            backgroundColor: 'lightgray',
            width: windowWidth * 0.8,
            height: windowWidth * 0.8 / 2.5,
            curveType: 'function',
            legend: { position: 'bottom' }
          };
          var chart = new google.visualization.LineChart(countryTargetDocument);
          chart.draw(dataForChart, options);
    }
}