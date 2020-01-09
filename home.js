const $home = $('#home');

var n = 1;
function homePage(rows,cols) {
    for (var i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (var j = 0; j < cols; j++) {
            const $col = $('<div>').addClass('col')
                .attr('num', n);
            n++;
            $row.append($col);
        }
        $home.append($row);
    }
}

homePage(2,2);

var $firstCell = document.querySelectorAll(`[num='1']`);
$($firstCell).text('Minesweeper');
$home.on('click', 'col', function() {
    var $cell = $($this);
    var num = $cell.data('num');
    window.location="https://www.google.com/"
});