var game_board = new GameBoard(10, 10, 0.4);
game_board.start();
var ui = new UI(document.getElementById("canvas"));
function changeResolution(cols, rows){
	timer.stop();
	game_board.init(cols, rows, document.getElementById("proportion").value);
	game_board.start();
	ui.draw.call(ui, game_board.getMap(), game_board.rows, game_board.cols);
}
function trigger(){
	game_board.update.call(game_board);
	ui.draw.call(ui, game_board.getMap(), game_board.rows, game_board.cols);
	console.log("trigger");
}
var timer = new Timer(trigger, 100);

function run(){
	timer.stop();
	timer = new Timer(trigger, 1000 / document.getElementById("fps").value);
	timer.start();
}

run();
$('#canvas').click(function (e){
	var x = e.pageX - $('#canvas').position().left;
	var y = e.pageY - $('#canvas').position().top;
	var gridWidth = $('#canvas').width() / game_board.cols;
	var gridHeight = $('#canvas').height() / game_board.rows;
	var x_index = Math.floor(x / gridWidth);
	var y_index = Math.floor(y / gridHeight);
	game_board.turn(y_index, x_index);
	ui.draw.call(ui, game_board.getMap(), game_board.rows, game_board.cols);
});