const $game = $('#game');
var timeTotal = 0;
var numClick = 0;
var first = 0;
var timeLast;
var timeAverage = 0;
var timePrev;

function gameBoard(rows, cols) {
    $game.empty()
    for (var i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (var j = 0; j < cols; j++) {
            const $col = $('<div>')
                .addClass('col')
                .attr('data-row', i)
                .attr('data-col', j);
            $row.append($col);
        }
        $game.append($row);
    }
}

gameBoard(10,15);

const $ave = $('<div>').addClass('average');
$game.append($ave);
$ave.text('Average:' + timeAverage + 'ms');

randX = Math.floor(Math.random() * 9);
randY = Math.floor(Math.random() * 14);
var $randCell = document.querySelectorAll(`[data-row='${randX}'][data-col='${randY}']`);
$($randCell).addClass('circle')

$game.on('click', '.col.circle', function() {
    var $cell = $(this);
    $cell.removeClass('circle');
    
    if (!first) {
        timeNow = new Date().getTime();
        timeLast = 0;
        timeAverage = 0;
        first = 1;
    } else {
        numClick++;
        timePrev = timeNow;
        timeNow = new Date().getTime();
        timeLast = timeNow - timePrev;
        timeTotal = timeTotal + timeLast;
        timeAverage = timeTotal / numClick;
    }

    if (timeLast > 99999) {
        timeLast = 'a lot';
    }
    else if (timeLast == 0) {
        timeLast = '';
    }
    
    $ave.text('Average:' + parseInt(timeAverage) + 'ms');

    randX = Math.floor(Math.random() * 9);
    randY = Math.floor(Math.random() * 14);
    var $randCell = document.querySelectorAll(`[data-row='${randX}'][data-col='${randY}']`);
    $($randCell).addClass('circle')
    $($randCell).text(timeLast);
})


function reset() {
    gameBoard(10,15);
    timeAverage = 0;
    $ave.text('Average:' + timeAverage + 'ms');
    $game.append($ave);
    timeLast = 0;
    first = 0;

    randX = Math.floor(Math.random() * 9);
    randY = Math.floor(Math.random() * 14);
    var $randCell = document.querySelectorAll(`[data-row='${randX}'][data-col='${randY}']`);
    $($randCell).addClass('circle')

}



