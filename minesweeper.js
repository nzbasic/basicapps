// Setting up const for main div
const $game = $('#game');

// Setting game values
var cols = 26;
var rows = 14;
var numBombs = 50;

// Creating a board by appending divs to main div and adding attributes for row, column, bomb number and reccurred
// to check if it has been affected by a function later on.
function gameBoard(rows, cols) {
    $game.empty()
    for (var i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (var j = 0; j < cols; j++) {
            const $col = $('<div>')
                .addClass('col hidden')
                .attr('data-row', i)
                .attr('data-col', j)
                .attr('data-num', -1)
                .attr('recurred', -1);
            $row.append($col);
        }
        $game.append($row);
    }
}

gameBoard(rows,cols);

// A function that listens to mousedowns over tiles that have not been revealed yet. 
var first = 0;
var start;
$game.on('mousedown', '.col.hidden', function() {
    // Setting up object for the tile that has been clicked
    var $cell = $(this); 
    var rowOg = $cell.data('row');
    var colOg = $cell.data('col');
    
    // After the first click (thats also a left click), it generates the number of bombs specified, so that the first click
    // cannot be a bomb. Also makes sure that no bombs are placed on other bombs.
    if (!first && event.which == 1) {
        for (var i = 0; i < numBombs; i++) {
            var running = 1;
            while (running) {
                var randX = Math.floor(Math.random() * cols);
                var randY = Math.floor(Math.random() * rows);
                var $mineCell = document.querySelectorAll(`[data-row='${randY}'][data-col='${randX}']`);
                if (!$($mineCell).hasClass('mine') && !(randX == colOg && randY == rowOg)) {
                    $($mineCell).addClass('mine');
                    running=0;
                }
            }
        }
        first = 1;
        
        // After the first click, all of the tile numbers can be calculated
        CalculateNumbers();
        
        // Get the time of the first click to compare later on.
        start = new Date().getTime();
        
        // Check to see if they have won.
        checkWin();
    }
    
    // For every left mouse event, it first checks to see if you have pressed a mine.
    if (event.which == 1) {
        if ($cell.hasClass('mine')) {
            alert('You lose :(');
            revealAll();
        }

        // Remove the hidden class to reveal the tile
        $cell.removeClass('hidden');
        var num = $cell.attr('data-num');
        
        // If the tile has no surrounding bombs, reveal every other surrounding tile that also has no surrounding bombs
        if (num == 0) {
            let i = parseInt($(this).attr('data-col'));
            let j = parseInt($(this).attr('data-row'));
            floodFill(i, j);
        }
        checkWin();
    }

    // For right clicks, add class flag or remove flag if a flag is already on the tile.
    if (event.which == 3 && first) {
        if (!$cell.hasClass('flag') ){
            $cell.addClass('flag');
        }
        else if ($cell.hasClass('flag')){
            $cell.removeClass('flag');
        }   
    }   

    // Middle mouse click shortcut for reseting board.
    if (event.which == 2) {
        reset();
    }
})

var finalI;
var finalJ;

// Function that calculates number of adjacent bombs to each tile
function CalculateNumbers() {
    
    // For each tile
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var $calcCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
            var total = 0;
            
            // For each tile adjacent
            for (var offI = -1; offI <= 1; offI++) {
                for (var offJ = -1; offJ <= 1; offJ++) {
                    finalI = i + offI;
                    finalJ = j + offJ;
                    
                    // Checks for boundaries of the grid
                    if (finalI > -1 && finalI < cols && finalJ > -1 && finalJ < rows) {
                        var $numCell = document.querySelectorAll(`[data-row='${finalJ}'][data-col='${finalI}']`);
                        
                        // If the adjacent cell has a mine, increase the total by one
                        if ($($numCell).hasClass('mine')) {
                            total++;
                        }
                    }
                }
            }
            
            // Give the tile the attribute for its total and the text of its total
            $($calcCell).attr('data-num', total);
            $($calcCell).text(total);
            if (total == 0) { $($calcCell).text(''); }
        }
    }
}

// Flood Fill function that reveals all adjacent tiles with no adjacent bombs.
function floodFill(i, j) {
    var $recurCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
    
    // Give the current tile a mark showing it has already been checked
    $($recurCell).attr('recurred', 1);
    
    // For each adjacent tile
    for (var offJ=-1; offJ<=1; offJ++){
        for (var offI=-1; offI<=1; offI++){
            finalI = i + offI;
            finalJ = j + offJ;
            
            // Checking boundaries of grid
            if (finalI > -1 && finalI < cols && finalJ > -1 && finalJ < rows) {
                var $numCell = document.querySelectorAll(`[data-row='${finalJ}'][data-col='${finalI}']`);
                
                // Reveals current tile
                $($numCell).removeClass('hidden');
                
                // If the tile also has no adjacent bombs, apply the function again.
                if ($($numCell).attr('data-num') == 0 && $($numCell).attr('recurred') == -1) {
                    floodFill(finalI, finalJ);
                }
            }
        }
    }
}

// Resets the game board
function reset() {
    gameBoard(rows,cols);
    first = 0;
}

// Checking to see if the only tiles left unrevealed are bombs
function checkWin() {
    var count1 = 0;
    var count2 = 0;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var $winCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
            
            // Counts number of hidden mines
            if ($($winCell).hasClass('hidden') && $($winCell).hasClass('mine')) {
                count1++;
            }
            
            // Counts number of hidden tiles
            if ($($winCell).hasClass('hidden')) {
                count2++;
            }
        }
    }
    
    // If the counts are the same, then the user has won
    if (count1 == numBombs && count2 == numBombs) {
        
        // Grab the current time once the user has won and compare it with the starting time
        var elapsed = new Date().getTime() - start;
        elapsed = elapsed/1000
        alert('You win! Time = ' + elapsed + 's');
        revealAll();
    }
}

// Reveals all tiles after a game is completed.
function revealAll() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var $reveal = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
            if ($($reveal).hasClass('hidden')){
                $($reveal).removeClass('hidden');
            }
        }
    }
}
