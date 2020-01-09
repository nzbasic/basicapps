const $game = $('#game');
var cols = 26;
var rows = 14;
var numBombs = 50;

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

var first = 0;
var start;
$game.on('mousedown', '.col.hidden', function() {
    var $cell = $(this); 
    var rowOg = $cell.data('row');
    var colOg = $cell.data('col');
    if (!first && event.which == 1) {
        var key = `${rowOg}, ${colOg}`;
        for (var i = 0; i < numBombs; i++) {
            var yeet = 1;
            while (yeet) {
                var randX = Math.floor(Math.random() * cols);
                var randY = Math.floor(Math.random() * rows);
                var $mineCell = document.querySelectorAll(`[data-row='${randY}'][data-col='${randX}']`);
                if (!$($mineCell).hasClass('mine') && !(randX == colOg && randY == rowOg)) {
                    $($mineCell).addClass('mine');
                    yeet=0;
                }
            }
        }
        first = 1;
        CalculateNumbers();
        start = new Date().getTime();
        checkWin();
    }

    if (event.which == 1) {
        if ($cell.hasClass('mine')) {
            alert('You lose :(');
            revealAll();
        }

        $cell.removeClass('hidden');
        var num = $cell.attr('data-num');
        $cell.text(num);
        if (num == 0) {
            let i = parseInt($(this).attr('data-col'));
            let j = parseInt($(this).attr('data-row'));
            floodFill(i, j);
        }
        checkWin();
    }

    if (event.which == 3 && first) {
        if (!$cell.hasClass('flag') ){
            $cell.addClass('flag');
        }
        else if ($cell.hasClass('flag')){
            $cell.removeClass('flag');
        }   
    }   

    if (event.which == 2) {
        reset();
    }
})

var finalI;
var finalJ;
function CalculateNumbers() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var $yeetCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
            var total = 0;
            for (var offI = -1; offI <= 1; offI++) {
                for (var offJ = -1; offJ <= 1; offJ++) {
                    finalI = i + offI;
                    finalJ = j + offJ;
                    if (finalI > -1 && finalI < cols && finalJ > -1 && finalJ < rows) {
                        var $numCell = document.querySelectorAll(`[data-row='${finalJ}'][data-col='${finalI}']`);
                        if ($($numCell).hasClass('mine')) {
                            total++;
                        }
                    }
                }
            }
            $($yeetCell).attr('data-num', total);
            $($yeetCell).text(total);
            if (total == 0) { $(this).text(''); }
        }
    }
}

function floodFill(i, j) {
    var $recurCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
    $($recurCell).attr('recurred', 1);
    for (var offJ=-1; offJ<=1; offJ++){
        for (var offI=-1; offI<=1; offI++){
            finalI = i + offI;
            finalJ = j + offJ;
            if (finalI > -1 && finalI < cols && finalJ > -1 && finalJ < rows) {
                var $numCell = document.querySelectorAll(`[data-row='${finalJ}'][data-col='${finalI}']`);
                $($numCell).removeClass('hidden');
                if ($($numCell).attr('data-num') == 0 && $($numCell).attr('recurred') == -1) {
                    floodFill(finalI, finalJ);
                }
            }
        }
    }
}

function reset() {
    gameBoard(rows,cols);
    first = 0;
}

function checkWin() {
    var count1 = 0;
    var count2 = 0;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            var $winCell = document.querySelectorAll(`[data-row='${j}'][data-col='${i}']`);
            if ($($winCell).hasClass('hidden') && $($winCell).hasClass('mine')) {
                count1++;
            }
            if ($($winCell).hasClass('hidden')) {
                count2++;
            }
        }
    }
    if (count1 == numBombs && count2 == numBombs) {
        var elapsed = new Date().getTime() - start;
        elapsed = elapsed/1000
        alert('You win! Time = ' + elapsed + 's');
        revealAll();
    }
}

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
