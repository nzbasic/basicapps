// Setting up const for main div
const $game = $('#game');

// Game data
var cols = 30;
var rows = 13;

// Setting up variables used between functions

// Keeps track of if start and end are placed
var startCheck = 0;
var endCheck = 0;

// Keep track of click number 
var clickNum = 0;

// Used when moving either the start or the end tile
var moveStart = 0;
var moveEnd = 0;

// Data for the start and end tiles and a backup of the data
var rowStart;
var colStart;
var rowEnd;
var colEnd;
var rowEnd2;
var colEnd2;
var colStart2;
var rowStart2;

// Keeps track of if the mouse is still held down
var mouseDown;

// Queue for Dijkstra's 
var queue = new Array(0);
var tempShift;
var recurring = 1;
var pathing = 1;

// Setting up game board by appending rows of divs to the main div, attributes contain the row and col data and weight for later on.
function gameBoard(rows, cols) {
    $game.empty()
    for (var i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (var j = 0; j < cols; j++) {
            const $col = $('<div>')
                .addClass('col')
                .attr('data-row', i)
                .attr('data-col', j)
                .attr('weight', 999);
            $row.append($col);
        }
        $game.append($row);
    }
}

// Function that removes all attributes and classes instead of recreating the gameBoard, useful later for other functions.
function setupReset() {
    queue = new Array(0);
    tempShift = 0;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var $reset = document.querySelectorAll(`[data-row='${i}'][data-col='${j}']`);
            $($reset).attr('weight', 999);
            if ($($reset).hasClass('searched')) {
                $($reset).removeClass('searched');
            }
            if ($($reset).hasClass('path')) {
                $($reset).removeClass('path');
            }
            if ($($reset).hasClass('start')) {
                $($reset).removeClass('start');
            }
            if ($($reset).hasClass('end')) {
                $($reset).removeClass('end');
            }
            if ($($reset).hasClass('wall')) {
                $($reset).removeClass('wall');
            }
            $($reset).text('');
        }
    }
}

gameBoard(rows,cols);

// Event listener for mousedown over any tile
$game.on('mousedown', '.col', function() {
    var $cell = $(this); 
    mouseDown = 1;

    // For the first click, place down the starting tile and increase click number
    if (clickNum == 0) {
        $cell.addClass('start');
        rowStart = $cell.data('row');
        colStart = $cell.data('col');
        rowStart2 = rowStart;
        colStart2 = colStart;
        clickNum++;        
    }

    // For second click, place down the ending tile
    else if (clickNum == 1) {
        if (!$cell.hasClass('start')) {
            $cell.addClass('end');
            rowEnd = $cell.data('row');
            colEnd = $cell.data('col');
            rowEnd2 = rowEnd;
            colEnd2 = colEnd;
            clickNum++;
        }
    }

    // If the tile being held is start, initiate moving
    else if (clickNum > 0 && $cell.hasClass('start')) {
        moveStart = 1;
        $cell.removeClass('start');

        if (pathing == 0){
            reset(1, 0, 1, 1);
        }
    }

    // If the tile being held is end, initiate moving
    else if (clickNum > 1 && $cell.hasClass('end')) {
        moveEnd = 1;
        $cell.removeClass('end');

        if (pathing == 0){
            reset(0, 1, 1, 1);
        }
    }

    // If the tile has a wall in it, remove the wall and then recalculate
    else if ($cell.hasClass('wall')) {
        $cell.removeClass('wall');
        checkNodes();
        if (startCheck && endCheck) {
            vis();
            startCheck = 0;
            endCheck = 0;
        }
    }

    // Place down a wall and recalculate
    else {
        $cell.addClass('wall');
        if ($cell.hasClass('searched')) {
            $cell.removeClass('searched');
        }
        checkNodes();
        if (startCheck && endCheck) {
            vis();
            startCheck = 0;
            endCheck = 0;
        }
    }
})

// Even listener for mouse being released over a tile
$game.on('mouseup', '.col', function(){
    var $cell = $(this);
    mouseDown = 0;

    // If moveStart was initialised, move the start node to the released location.
    if (moveStart == 1) {
        moveStart = 0;
        if ($cell.hasClass('wall')) {
            $cell.removeClass('wall')
        }
        $cell.addClass('start');
        rowStart = $cell.data('row');
        colStart = $cell.data('col');
        rowStart2 = rowStart;
        colStart2 = colStart;
        if ($cell.hasClass('end')) {
            resetButton();
        }

    }

    // If moveEnd was initialised, move the end node to the released location.
    else if (moveEnd == 1) {
        moveEnd = 0;
        if ($cell.hasClass('wall')) {
            $cell.removeClass('wall')
        }
        $cell.addClass('end');
        rowEnd = $cell.data('row');
        colEnd = $cell.data('col');
        rowEnd2 = rowEnd;
        colEnd2 = colEnd;

        if ($cell.hasClass('start')) {
            resetButton();
        }
    }
    startCheck = 0;
    endCheck = 0;
    checkNodes();
    if (startCheck && endCheck) {
        vis();
        startCheck = 0;
        endCheck = 0;
    }
})

// Event listener for mouse being over a tile, and if mouseDown is active, it places down walls.
$game.on('mouseover', '.col', function() {

    if (mouseDown == 1) {
        var $cell2 = $(this);
        if (!($cell2.hasClass('start') || $cell2.hasClass('end') || moveEnd || moveStart)) {
            $cell2.addClass('wall');
            if ($cell2.hasClass('searched')) {
                $cell2.removeClass('searched');
            }
        }
    }
})


// The visualizer function
function vis() {

    // Start by grabbing the start and end data,
    checkNodes();
    // Then reset the board, keeping the walls.
    reset(0,0,1,0);

    // Replace the start and end node
    var $start = document.querySelectorAll(`[data-row='${rowStart}'][data-col='${colStart}']`);
    var $end = document.querySelectorAll(`[data-row='${rowEnd}'][data-col='${colEnd}']`);
    $($start).addClass('start');
    $($end).addClass('end');

    pathing = 1;
    recurring = 1;

    // For Dijkstra's, start by setting the initial node's weight to 0, all others are infinite (or 999 in this case)
    $($start).attr('weight', 0);

    // Then, go to the surrounding tiles and update their weights to 1 and add them to the queue
    recur(rowStart,colStart);
    var sortedQueue;

    // Then, go through the queue in weight order, calculating all of their surrounding tiles.
    while(recurring) {
        sortedQueue = queue.sort((a,b) => a[0] - b[0]);
        tempShift = sortedQueue.shift();
        rowStart = tempShift[1];
        colStart = tempShift[2];
        recur(rowStart,colStart);
    }

    while(pathing) {
        path(rowEnd,colEnd);
    }

}

// Shows the fastest path from start to end node.
// It works by starting at the end node, finding its weight and then drawing the path where the next weight is its own minus one.
function path(R,C) {
    var $end = document.querySelectorAll(`[data-row='${rowEnd}'][data-col='${colEnd}']`);
    oldDist = parseInt($($end).attr('weight'));

    if (rowEnd-1 >= 0) {
        var $temp = document.querySelectorAll(`[data-row='${rowEnd-1}'][data-col='${colEnd}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                pathing = 0;
                return;
            }
            $($temp).addClass('path');
            rowEnd = rowEnd-1;
            return;
        }
    }
    if (rowEnd+1 < rows) {
        var $temp = document.querySelectorAll(`[data-row='${rowEnd+1}'][data-col='${colEnd}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                pathing = 0;
                return;
            }
            $($temp).addClass('path');
            rowEnd = rowEnd+1;
            return;
        }
    }
    if (colEnd-1 >= 0) {
        var $temp = document.querySelectorAll(`[data-row='${rowEnd}'][data-col='${colEnd-1}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                pathing = 0;
                return;
            }
            $($temp).addClass('path');
            colEnd = colEnd-1;
            return;
        }
    }
    if (colEnd+1 < cols) {
        var $temp = document.querySelectorAll(`[data-row='${rowEnd}'][data-col='${colEnd+1}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                pathing = 0;
                return;
            }
            $($temp).addClass('path');
            colEnd = colEnd+1;
            return;
        }
    }
}

// Finds start and end nodes.
function checkNodes() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var $check = document.querySelectorAll(`[data-row='${i}'][data-col='${j}']`);
            if ($($check).hasClass('start')) {
                startCheck = 1;
                rowStart = i;
                colStart = j;
            }
            if ($($check).hasClass('end')) {
                endCheck = 1;
                rowEnd = i;
                colEnd = j;
            }
        }
    }
}

// Checks adjacent tiles to see if they can be added to the queue.
function recur(R, C) {
    var finalDist;
    var $og = document.querySelectorAll(`[data-row='${R}'][data-col='${C}']`);

    // Finds weight of current tile and updates it to searched
    var OG = parseInt($($og).attr('weight'));
    $($og).addClass('searched');

    // Checks if adjacent tile is within the boundary
    if (R-1 >= 0) {
        var $vcell = document.querySelectorAll(`[data-row='${R-1}'][data-col='${C}']`);

        // Makes sure the tile isnt a wall
        if (!$($vcell).hasClass('wall')) {

            // The new weight will be the original weight plus one
            newDist = OG + parseInt(1);
            oldDist = $($vcell).attr('weight');
            
            // If the new weight is smaller, that will be its new weight.
            if (newDist < oldDist) {
                finalDist = newDist;   
            }
            else {
                finalDist = oldDist;
            }
            
            $($vcell).attr('weight', parseInt(finalDist));
            $($vcell).text(parseInt(finalDist));

            // If the tile is the end node, end the recursion 
            if ($($vcell).hasClass('end')) { 
                recurring = 0;
                $($vcell).addClass('searched');
                return;
            }

            // Add to the queue
            if (!$($vcell).hasClass('searched')) {
                queue.push([finalDist, R-1, C]);
                $($vcell).addClass('searched');
            }
        }
    }

    // Repeat for each other adjacent tile
    if (R+1 < rows) {
        var $vcell = document.querySelectorAll(`[data-row='${R+1}'][data-col='${C}']`);
        if (!$($vcell).hasClass('wall')) {
            newDist = OG + parseInt(1);
            oldDist = $($vcell).attr('weight');
            
            if (newDist < oldDist) {
                finalDist = newDist;   
            }
            else {
                finalDist = oldDist;
            }
            
            $($vcell).attr('weight', parseInt(finalDist));
            $($vcell).text(parseInt(finalDist));

            if ($($vcell).hasClass('end')) { 
                recurring = 0;
                $($vcell).addClass('searched');
                return;
            }
            
            if (!$($vcell).hasClass('searched')) {
                queue.push([finalDist, R+1, C]);
                $($vcell).addClass('searched');
            }
        }
    }

    if (C-1 >= 0) {
        var $vcell = document.querySelectorAll(`[data-row='${R}'][data-col='${C-1}']`);
        if (!$($vcell).hasClass('wall')) {
            newDist = OG + parseInt(1);
            oldDist = $($vcell).attr('weight');
            
            if (newDist < oldDist) {
                finalDist = newDist;   
            }
            else {
                finalDist = oldDist;
            }
            
            $($vcell).attr('weight', parseInt(finalDist));
            $($vcell).text(parseInt(finalDist));

            if ($($vcell).hasClass('end')) { 
                recurring = 0;
                $($vcell).addClass('searched');
                return;
            }

            if (!$($vcell).hasClass('searched')) {
                queue.push([finalDist, R, C-1]);
                $($vcell).addClass('searched');
            }
        }
    }

    if (C+1 < cols) {
        var $vcell = document.querySelectorAll(`[data-row='${R}'][data-col='${C+1}']`);
        if (!$($vcell).hasClass('wall')) {
            newDist = OG + parseInt(1);
            oldDist = $($vcell).attr('weight');
            
            if (newDist < oldDist) {
                finalDist = newDist;   
            }
            else {
                finalDist = oldDist;
            }
            
            $($vcell).attr('weight', parseInt(finalDist));
            $($vcell).text(parseInt(finalDist));

            if ($($vcell).hasClass('end')) { 
                recurring = 0;
                $($vcell).addClass('searched');
                return;
            }

            if (!$($vcell).hasClass('searched')) {
                queue.push([finalDist, R, C+1]);
                $($vcell).addClass('searched');
            }
        }
    }
}

// Stores the wall data for when the board is reset to keep the walls.
function wallKeeper() {
    var wallArray = new Array(0);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var $wallCheck = document.querySelectorAll(`[data-row='${i}'][data-col='${j}']`);
            if ($($wallCheck).hasClass('wall')) {
                wallArray.push([i, j]);
            }
        }
    }
    setupReset();
    var len = wallArray.length;
    for (var k = 0; k < len; k++) {
        tempShift = wallArray.shift();
        var $wallPlace = document.querySelectorAll(`[data-row='${tempShift[0]}'][data-col='${tempShift[1]}']`);
        $($wallPlace).addClass('wall');
    }
}


// Some reset functions
function reset(keepEnd, keepStart, wallKeep, rVars) {
    if (rVars) {
        clickNum = 0;
        moveStart = 0;
        moveEnd = 0;
        rowStart = 0;
        colStart = 0;
        recurring = 1;
        pathing = 1;
        queue = new Array(0);
        tempShift = 0;
    }

    if (wallKeep) {
        wallKeeper();
    }
    else {
        setupReset();
    }

    if (keepEnd == 1) {
        var $end = document.querySelectorAll(`[data-row='${rowEnd2}'][data-col='${colEnd2}']`);
        $($end).addClass('end');
        moveStart = 1;
        clickNum = 2;
        rowEnd = rowEnd2;
        colEnd = colEnd2;
        keepEnd = 0;
    }

    if (keepStart == 1) {
        var $start = document.querySelectorAll(`[data-row='${rowStart2}'][data-col='${colStart2}']`);
        $($start).addClass('start');
        moveEnd = 1;
        clickNum = 2;
        rowStart = rowStart2;
        colStart = colStart2;
        keepStart = 0;
    }
}

function resetButton() {
    clickNum = 0;
    moveStart = 0;
    moveEnd = 0;
    rowStart = 0;
    colStart = 0;
    recurring = 1;
    pathing = 1;
    queue = new Array(0);
    tempShift = 0;
    endCheck = 0;
    startCheck = 0;
    gameBoard(rows,cols);
}
