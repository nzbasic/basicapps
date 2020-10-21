var ppChart;
var rankChart;
var accChart;
var countryChart;
var playChart;
var ppPoints = [];
var accPoints = [];
var countryPoints = [];
var playPoints = [];
var rankPoints = [];

function addData(data) {
    for (var i = 0; i < data.table.length; i++) {
        ppPoints.push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].pp)
        });
        rankPoints.push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].rank)
        });
        accPoints.push({
            x: new Date(data.table[i].date),
            y: parseFloat(data.table[i].acc)
        });
        countryPoints.push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].country)
        });
        playPoints.push({
            x: new Date(data.table[i].date),
            y: parseInt(data.table[i].plays)
        });
    }
    ppChart.render();
    accChart.render();
    countryChart.render();
    playChart.render();
    rankChart.render();
}

window.onload = function() {
    ppChart = new CanvasJS.Chart("ppContainer", {
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
            dataPoints: ppPoints
        }]
    });

    rankChart = new CanvasJS.Chart("rankContainer", {
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
            dataPoints: rankPoints
        }]
    });

    accChart = new CanvasJS.Chart("accContainer", {
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
            dataPoints: accPoints
        }]
    });

    countryChart = new CanvasJS.Chart("countryContainer", {
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
            dataPoints: countryPoints
        }]
    });

    playChart = new CanvasJS.Chart("playContainer", {
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
            dataPoints: playPoints
        }]
    });

    $.getJSON("http://basicapps.net/rank.json", addData);
}