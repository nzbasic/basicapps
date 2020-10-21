$(document).ready(function () {
    // prepare the data
    var number = [];
    var name = [];
    var rank = [];
    var title = [];
    var diffname = [];
    var mods = [];
    var pp = [];
    var misscount = [];
    var data2 = new Array();
    $.getJSON("http://basicapps.net/top.json", function(data) {
        //console.log(data);
        //var rankGlobalTable = JSON.parse(data); //now it an object
        var scoresTable = data.table[0]['score'];

        for (let i = 0; i < 100; i++) {
            var row = {};
            row["number"] = i + 1;
            row["rank"] = scoresTable[i][0];
            row["title"] = scoresTable[i][1]
            row["mods"] = scoresTable[i][3];
            row["pp"] = parseFloat(scoresTable[i][4]);
            row["name"] = scoresTable[i][6];
            row["misscount"] = parseFloat(scoresTable[i][5]);
            row["diffname"] = scoresTable[i][2];
            row["acc"] = Math.round((100 * parseFloat(scoresTable[i][8]) + Number.EPSILON) * 100) / 100;
            data2[i] = row;
        }
        //console.log(data2);
        var source =
        {
            localdata: data2,
            datatype: "array"
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            downloadComplete: function (data, status, xhr) { },
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid").jqxGrid(
        {
            width: 776,
            height: 515.75,
            source: dataAdapter,
            columns: [
            { text: "#", datafield: 'number', width: 40 },
            { text: "Name", datafield: 'name', width: 100},
            { text: 'Rank', datafield: 'rank', width: 40 },
            { text: 'Title', datafield: 'title', width: 180 },
            { text: 'Difficulty', datafield: 'diffname', width: 140 },
            { text: 'Mods', datafield: 'mods', width: 60 },
            { text: 'Misses', datafield: 'misscount', width: 60},
            { text: 'pp', datafield: 'pp', width: 80, },
            { text: 'Acc', datafield: 'acc', width: 60 }
            ]
        });
    });

    var data3 = new Array();
    $.getJSON("http://basicapps.net/data.json", function(data) {
        //console.log(data);
        //var rankGlobalTable = JSON.parse(data); //now it an object
        var contributerTable = data.table[data.table.length-1];

        var row = {};
        row["name"] = "NZ Total";
        row["pp"] = Math.round((parseFloat(contributerTable[contributerTable.length-1]) + Number.EPSILON) * 100) / 100;
        data3[0] = row;

        for (let i = 0; i < contributerTable.length-1; i++) {
            var row = {};
            row["name"] = contributerTable[i][0];
            row["pp"] = Math.round((parseFloat(contributerTable[i][1]) + Number.EPSILON) * 100) / 100;
            data3[i+1] = row;
        }

        //console.log(data3);
        var source =
        {
            localdata: data3,
            datatype: "array"
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            downloadComplete: function (data, status, xhr) { },
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
        });
        $("#grid2").jqxGrid(
        {
            width: 196,
            scrollbarsize: 0,
            autoheight: true,
            source: dataAdapter,
            columns: [
            { text: "Name", datafield: 'name', width: 100},
            { text: 'pp', datafield: 'pp', width: 80 },
            ]
        });
    });
});



var ppChart;
var ppPoints = [];

function addData(data) {
    for (var i = 0; i < data.table.length; i++) {
        len = data.table[i].length - 1;
        ppPoints.push({
            x: i+1,
            y: parseInt(data.table[i][len])
        });
    }
    ppChart.render();

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

    $.getJSON("http://basicapps.net/data.json", addData);
}