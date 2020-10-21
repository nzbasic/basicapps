
// Setup const for div 
const $game = $('#game');

// Setup board by appending rows of divs to the origin div
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

// A new div to show average time
const $ave = $('<div>').addClass('average');
$game.append($ave);
var timeAverage = 0;
$ave.text('Average:' + timeAverage + 'ms');

// Random coordinates for first object
randX = Math.floor(Math.random() * 9);
randY = Math.floor(Math.random() * 14);
var $randCell = document.querySelectorAll(`[data-row='${randX}'][data-col='${randY}']`);
$($randCell).addClass('circle')
var first = 1;
var timeLast;
var timePrev;
var timeTotal = 0;
var numClick = 0;

// Event listener for clicking a circle
$game.on('click', '.col.circle', function() {
    
    var $cell = $(this);
    $cell.removeClass('circle');
    
    // If it is the first circle, setup timing
    if (first) {
        timeNow = new Date().getTime();
        timeLast = 0;
        timeAverage = 0;
        first = 0;
    } else {
        // Increase number of clicks, grab new timings, calculate average
        numClick++;
        timePrev = timeNow;
        timeNow = new Date().getTime();
        timeLast = timeNow - timePrev;
        timeTotal = timeTotal + timeLast;
        timeAverage = timeTotal / numClick;
    }

    // If left idle, stop time from extending past div 
    if (timeLast > 99999) {
        timeLast = 'a lot';
    }
    else if (timeLast == 0) {
        timeLast = '';
    }
    
    // Update the average time on the display div
    $ave.text('Average:' + parseInt(timeAverage) + 'ms');

    // Calculate new random coords
    randX = Math.floor(Math.random() * 9);
    randY = Math.floor(Math.random() * 14);
    var $randCell = document.querySelectorAll(`[data-row='${randX}'][data-col='${randY}']`);
    $($randCell).addClass('circle')

    // Show the time taken for the last click on the next circle.
    $($randCell).text(timeLast);
})

// Reset the board.
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



