const $game = $('#game');
var cols = 30;
var rows = 13;
var wallKeep = 0;
var rVars = 0;
var startCheck = 0;
var endCheck = 0;


function gameBoard(rows, cols) {
    /*var meme = detectmob();
    if (meme) {
        const $text = $('<div>').text('Sorry, this does not work on mobile.')
        $game.append($text);
    }
    else { */
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
    //}
}

function detectmob() { 
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
       return true;
     }
    else {
       return false;
     }
}

function setup() {
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
            $($reset).text('');
        }
    }
}

function setupReset() {
    queue = new Array(0);
    sorted = 0;
    temp = 0;
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

var clickNum = 0;
var moveStart = 0;
var moveEnd = 0;
var endRemoved = 0;
var startRemoved = 0;
var R;
var C;
var RE;
var CE;
var keepEnd = 0;
var keepStart = 0;
var CO;
var RO;
var C1;
var R1;
var keeper = 0;
var mouseDown;

$game.on('mousedown', '.col', function() {
    var $cell = $(this); 
    mouseDown = 1;
    if (clickNum == 0 || startRemoved == 1) {
        $cell.addClass('start');
        R = $cell.data('row');
        C = $cell.data('col');
        R1 = R;
        C1 = C;
        clickNum++;        
        if (startRemoved == 1) {
            startRemoved = 0;
        }
    }
    else if (clickNum == 1 || endRemoved == 1) {
        if (!$cell.hasClass('start')) {
            $cell.addClass('end');
            RE = $cell.data('row');
            CE = $cell.data('col');
            RO = RE;
            CO = CE;
            clickNum++;
        }
        if (endRemoved == 1) {
            endRemoved = 0;
        }
    }
    else if (clickNum > 0 && $cell.hasClass('start')) {
        moveStart = 1;
        $cell.removeClass('start');

        if (yeet2 == 0){
            reset(1, keepStart, 1, 1);
        }
    }
    else if (clickNum > 1 && $cell.hasClass('end')) {
        moveEnd = 1;
        $cell.removeClass('end');

        if (yeet2 == 0){
            reset(keepEnd, 1, 1, 1);
        }
    }
    else if ($cell.hasClass('wall')) {
        $cell.removeClass('wall');
        checkNodes();
        if (startCheck && endCheck) {
            vis();
            startCheck = 0;
            endCheck = 0;
        }
    }
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

$game.on('mouseup', '.col', function(){
    var $cell = $(this);
    mouseDown = 0;
    if (moveStart == 1) {
        moveStart = 0;
        if ($cell.hasClass('wall')) {
            $cell.removeClass('wall')
        }
        $cell.addClass('start');
        R = $cell.data('row');
        C = $cell.data('col');
        R1 = R;
        C1 = C;
        if ($cell.hasClass('end')) {
            resetButton();
        }

    }
    else if (moveEnd == 1) {
        moveEnd = 0;
        if ($cell.hasClass('wall')) {
            $cell.removeClass('wall')
        }
        $cell.addClass('end');
        RE = $cell.data('row');
        CE = $cell.data('col');
        RO = RE;
        CO = CE;

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

var ogDist;
var newDist;
var finalDist;
var queue = new Array(0);
var sorted;
var temp;
var yeet = 1;
var yeet2 = 1;

function vis() {
    checkNodes();
    reset(0,0,1,0);
    
    var $start = document.querySelectorAll(`[data-row='${R}'][data-col='${C}']`);
    var $end = document.querySelectorAll(`[data-row='${RE}'][data-col='${CE}']`);

    $($start).addClass('start');
    $($end).addClass('end');

    yeet2 = 1;
    yeet = 1;

    var $og = document.querySelectorAll(`[data-row='${R}'][data-col='${C}']`);
    $($og).attr('weight', 0);

    recur(R,C);

    while(yeet) {

        sorted = queue.sort((a,b) => a[0] - b[0]);
        temp = sorted.shift();
        R = temp[1];
        C = temp[2];
        recur(R,C);
    }

    while(yeet2) {
        path(RE,CE);
    }

}

function clearPath() {
    for (var i=0; i<rows; i++) {
        for (var j=0; j<cols; j++){
            var $clear = document.querySelectorAll(`[data-row='${i}'][data-col='${j}']`);
            if ($($clear).hasClass('path')) {
                $($clear).removeClass('path');
            }
        }
    }
}

function movePath() {
    yeet2 = 1;
    while(yeet2) {
        path(RE,CE);
    }
}

function path(R,C) {
    var $end = document.querySelectorAll(`[data-row='${RE}'][data-col='${CE}']`);
    oldDist = parseInt($($end).attr('weight'));

    if (RE-1 >= 0) {
        var $temp = document.querySelectorAll(`[data-row='${RE-1}'][data-col='${CE}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                yeet2 = 0;
                return;
            }
            $($temp).addClass('path');
            RE = RE-1;
            return;
        }
    }
    if (RE+1 < rows) {
        var $temp = document.querySelectorAll(`[data-row='${RE+1}'][data-col='${CE}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                yeet2 = 0;
                return;
            }
            $($temp).addClass('path');
            RE = RE+1;
            return;
        }
    }
    if (CE-1 >= 0) {
        var $temp = document.querySelectorAll(`[data-row='${RE}'][data-col='${CE-1}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                yeet2 = 0;
                return;
            }
            $($temp).addClass('path');
            CE = CE-1;
            return;
        }
    }
    if (CE+1 < cols) {
        var $temp = document.querySelectorAll(`[data-row='${RE}'][data-col='${CE+1}']`);
        newDist = parseInt($($temp).attr('weight'));

        if (newDist == oldDist - 1){
            if (newDist == 0) {
                yeet2 = 0;
                return;
            }
            $($temp).addClass('path');
            CE = CE+1;
            return;
        }
    }
}

function checkNodes() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var $check = document.querySelectorAll(`[data-row='${i}'][data-col='${j}']`);
            if ($($check).hasClass('start')) {
                startCheck = 1;
                R = i;
                C = j;
            }
            if ($($check).hasClass('end')) {
                endCheck = 1;
                RE = i;
                CE = j;
            }
        }
    }
}


function recur(R, C) {

    var $og = document.querySelectorAll(`[data-row='${R}'][data-col='${C}']`);
    var OG = parseInt($($og).attr('weight'));
    $($og).addClass('searched');

    if (R-1 >= 0) {
        
        var $vcell = document.querySelectorAll(`[data-row='${R-1}'][data-col='${C}']`);
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
                yeet = 0;
                $($vcell).addClass('searched');
                return;
            }

            if (!$($vcell).hasClass('searched')) {
                queue.push([finalDist, R-1, C]);
                $($vcell).addClass('searched');
            }
        }
    }

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
                yeet = 0;
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
                yeet = 0;
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
                yeet = 0;
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

var wallArray = new Array(0);
var temp;

function wallKeeper() {
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
        temp = wallArray.shift();
        var $wallPlace = document.querySelectorAll(`[data-row='${temp[0]}'][data-col='${temp[1]}']`);
        $($wallPlace).addClass('wall');
    }
}



function reset(keepEnd, keepStart, wallKeep, rVars) {

    if (rVars) {
        clickNum = 0;
        moveStart = 0;
        moveEnd = 0;
        endRemoved = 0;
        startRemoved = 0;
        R = 0;
        C = 0;
        yeet = 1;
        yeet2 = 1;
        queue = new Array(0);
        sorted = 0;
        temp = 0;
    }

    if (wallKeep) {
        wallKeeper();
    }
    else {
        setupReset();
    }

    if (keepEnd == 1) {
        var $end = document.querySelectorAll(`[data-row='${RO}'][data-col='${CO}']`);
        $($end).addClass('end');
        moveStart = 1;
        clickNum = 2;
        RE = RO;
        CE = CO;
        keepEnd = 0;
        keeper = 1;
    }

    if (keepStart == 1) {
        var $start = document.querySelectorAll(`[data-row='${R1}'][data-col='${C1}']`);
        $($start).addClass('start');
        moveEnd = 1;
        clickNum = 2;
        R = R1;
        C = C1;
        keepStart = 0;
        keeper = 1;
    }
}

function resetButton() {
    clickNum = 0;
    moveStart = 0;
    moveEnd = 0;
    endRemoved = 0;
    startRemoved = 0;
    R = 0;
    C = 0;
    yeet = 1;
    yeet2 = 1;
    queue = new Array(0);
    sorted = 0;
    temp = 0;
    endCheck = 0;
    startCheck = 0;
    gameBoard(rows,cols);
}
