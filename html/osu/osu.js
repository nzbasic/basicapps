var players = [
    'Todd',
    'Tayden',
    'Pen',
    'Zoom',
    'Big'
]

var files = [
    "http://basicapps.net/rank.json",
    "http://basicapps.net/rank2.json",
    "http://basicapps.net/rank3.json",
    "http://basicapps.net/rank4.json",
    "http://basicapps.net/rank5.json"
]

var ppChart = [];
var rankChart = [];
var accChart = [];
var countryChart = [];
var playChart = [];

var ppPoints = [];
var accPoints = [];
var countryPoints = [];
var playPoints = [];
var rankPoints = [];

function addData(data) {
    for (var i = 0; i < data.table.length; i++) {
        ppPoints[I].push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].pp)
        });
        rankPoints[I].push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].rank)
        });
        accPoints[I].push({
            x: new Date(data.table[i].date),
            y: parseFloat(data.table[i].acc)
        });
        countryPoints[I].push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].country)
        });
        playPoints[I].push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].plays)
        });
    } 
}

function genChart(index) {

    ppChart[index] = new CanvasJS.Chart("ppContainer" + players[index], {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Performance Tracker"
        },
        axisY: {
            title: "pp",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "#### pp",
            dataPoints: ppPoints[index]
        }]
    });

    rankChart[index] = new CanvasJS.Chart("rankContainer" + players[index], {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Rank Tracker"
        },
        axisY: {
            title: "Rank",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "#####",
            dataPoints: rankPoints[index]
        }]
    });

    accChart[index] = new CanvasJS.Chart("accContainer" + players[index], {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Accuracy Tracker"
        },
        axisY: {
            title: "Acc",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "## ##%",
            dataPoints: accPoints[index]
        }]
    });

    countryChart[index] = new CanvasJS.Chart("countryContainer" + players[index], {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "NZ Rank Tracker"
        },
        axisY: {
            title: "NZ Rank",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "###",
            dataPoints: countryPoints[index]
        }]
    });

    playChart[index] = new CanvasJS.Chart("playContainer" + players[index], {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Playcount Tracker"
        },
        axisY: {
            title: "Playcount",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "line",
            yValueFormatString: "###### plays",
            dataPoints: playPoints[index]
        }]
    });

    if (index == 0) {
        ppChart[0].render();
        accChart[0].render();
        countryChart[0].render();
        playChart[0].render();
        rankChart[0].render();
    }
}

function genCharts() {
    for (i = 0; i < players.length; i++) {
        genChart(i);
    }
}

function getJs() {
    for (j = 0; j < players.length; j++) {
        $.getJSON(files[j], function(data) {
            console.log(j);
            for (var k = 0; k < data.table.length; k++) {
                ppPoints[j].push({
                    x: new Date(data.table[k].date),
                    y: parseInt(data.table[k].pp)
                });
                rankPoints[j].push({
                    x: new Date(data.table[k].date),
                    y: parseInt(data.table[k].rank)
                });
                accPoints[j].push({
                    x: new Date(data.table[k].date),
                    y: parseFloat(data.table[k].acc)
                });
                countryPoints[j].push({
                    x: new Date(data.table[k].date),
                    y: parseInt(data.table[k].country)
                });
                playPoints[j].push({
                    x: new Date(data.table[k].date),
                    y: parseInt(data.table[k].plays)
                });
            } 
        });
    }
}

window.onload = function() {
    getJs();
    genCharts();
}

$('.hidden').toggle();

function togInd(index){
    $('.button').removeClass('shown');
    $('#' + players[index]).addClass('shown');

    $('.graph').hide(); 
    $('#ppContainer' + players[index]).show();
    $('#accContainer' + players[index]).show();
    $('#rankContainer' + players[index]).show();
    $('#countryContainer' + players[index]).show();
    $('#playContainer' + players[index]).show();

    ppChart[index].render();
    accChart[index].render();
    countryChart[index].render();
    playChart[index].render();
    rankChart[index].render();
}

$('.button').click(function() {
    var index = $(this).attr('index');
    togInd(index);
});
