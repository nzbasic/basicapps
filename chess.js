// Creating a const for the div
const $game = $('#game');
var other = 1;

// Setting up the board by appending divs to the main div, also adding the row and col numbers as attributes
function gameBoard(rows, cols) {
    $game.empty()
    for (var i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (var j = 0; j < cols; j++) {
            var $col = $('<div>')
                .addClass('col')
                .attr('row', i)
                .attr('col', j);
            
            // Making every other square have the class ODD so I can make them black with CSS
            if (other % 2 == 0) {
                $col.addClass('ODD');
            }
            other++;
            $row.append($col);
        }
        $game.append($row);
        other--;
    }
}

gameBoard(8,8);

// Placing the pieces 

for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
        var $cell = document.querySelectorAll(`[row='${i}'][col='${j}']`);
        // pawns
        if (i == 1){
            $($cell).addClass('b pawn');
            $($cell).text('♟');
        }
        if (i == 6){
            $($cell).addClass('w pawn');
            $($cell).text('♙');
        }
        // rooks
        if (i == 0 && (j == 0 || j == 7)){
            $($cell).addClass('b rook');
            $($cell).text('♜');
        }
        if (i == 7 && (j == 0 || j == 7)){
            $($cell).addClass('w rook');
            $($cell).text('♖');
        }
        // bishops 
        if (i == 0 && (j == 2 || j == 5)){
            $($cell).addClass('b bishop');
            $($cell).text('♝');
        }
        if (i == 7 && (j == 2 || j == 5)){
            $($cell).addClass('w bishop');
            $($cell).text('♗');
        }
        // queens
        if (i == 0 && j == 3){
            $($cell).addClass('b queen');
            $($cell).text('♛');
        }
        if (i == 7 && j == 3){
            $($cell).addClass('w queen');
            $($cell).text('♕');
        }
        // kings
        if (i == 0 && j == 4){
            $($cell).addClass('b king');
            $($cell).text('♚');
        }
        if (i == 7 && j == 4){
            $($cell).addClass('w king');
            $($cell).text('♔');
        }
        // knights
        if (i == 0 && (j == 1 || j == 6)){
            $($cell).addClass('b knight');
            $($cell).text('♞');
        }
        if (i == 7 && (j == 1 || j == 6)){
            $($cell).addClass('w knight');
            $($cell).text('♘');
        }
    }
}


$game.on('click', '.col', function(){
    var $cell = $(this);
    if ($cell.hasClass('w pawn')) {
        
    }
})
