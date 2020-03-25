function addPiechart(){
  let piechartDivision = document.querySelector('.pie-1');
  google.charts.load('current', {'packages':['corechart']});
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
      'title' : 'Most frequently attacked',
      'fontSize' : 20,
      'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
      'width':650, 
      'height':400, 
      'is3D':true, 
      'backgroundColor': 'transparent',
    };
    var chart = new google.visualization.PieChart(piechartDivision);
    chart.draw(data, options);
  }
}

function addPiechart2(){
  let piechartDivision = document.querySelector('.pie-2');
  google.charts.load('current', {'packages':['corechart']});
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
      'title' : 'Most used attack',
      'fontSize' : 20,
      'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
      'width':650, 
      'height':400, 
      'is3D':true, 
      'backgroundColor': 'transparent',
    };
    var chart = new google.visualization.PieChart(piechartDivision);
    chart.draw(data, options);
  }
}

function addPiechart3(){
  let piechartDivision = document.querySelector('.pie-3');
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
      var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Trump', 6],
      ['America', 10],
      ['Unknown', 10]
    ]);
    var options = {
      'title' : 'Most used attack',
      'fontSize' : 20,
      'colors': ['#054a4d', '#065e61', '#0da3a8', '#09865d', '#062a61'],
      'width':650, 
      'height':400, 
      'is3D':true, 
      'backgroundColor': 'transparent',
    };
    var chart = new google.visualization.PieChart(piechartDivision);
    chart.draw(data, options);
  }
}