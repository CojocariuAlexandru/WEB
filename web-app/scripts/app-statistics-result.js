function statisticsResultsPageInit(node) {
    mainContent.innerHTML = loadPage(node.template);

    addPiechart();
    addPiechart2();
    addPiechart3();
    addColumnChart();
}

function addPiechart() {
    let piechartDivision = document.querySelector('.pie-1');
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Romania', 8],
            ['Italy', 5],
            ['Iran', 7],
            ['Unknown', 10]
        ]);
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
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Bombs', 6],
            ['Weapons', 10],
            ['Chemical', 2],
            ['Biological', 1],
            ['Unknown', 10]
        ]);
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
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Trump', 6],
            ['America', 10],
            ['Unknown', 10]
        ]);
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
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Year', 'number'],
            ['2014', 1000],
            ['2015', 1170],
            ['2016', 660],
            ['2017', 1030]
        ]);

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