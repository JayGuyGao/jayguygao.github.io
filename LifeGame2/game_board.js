function GameBoard(cols, rows, proportion){
	this.rows = rows;
	this.cols = cols;
	this.proportion = proportion;
	this.map = new Array(2);
	for (var k = 0; k < 2; k ++){
		this.map[k] = new Array(rows);
		for (var i = 0; i < rows; i ++){
			this.map[k][i] = new Array(cols);
		}
	}
	this.cur = 0;
	this.dir = [[-1, 0],[-2, 0],[1, 0],[2, 0],[0, 1],[0, 2],[0, -1],[0, -2]];

	this.init = function(cols, rows, proportion) {
		this.rows = rows;
		this.cols = cols;
		this.proportion = proportion;
		for (var k = 0; k < 2; k ++){
			this.map[k] = new Array(rows);
			for (var i = 0; i < rows; i ++){
				this.map[k][i] = new Array(cols);
			}
		}
	}

	this.start = function () {
		this.cur = 0;
		for (var i = 0; i < this.rows; i ++){
			for (var j = 0; j < this.cols; j ++){
				if (Math.random() < this.proportion){
					this.map[this.cur][i][j] = 1;
				}
				else{
					this.map[this.cur][i][j] = 0;
				}
			}
		}
	}

	this.update = function() {
		var pre = this.cur;
		var cur = 1 - pre;

		for (var i = 0; i < this.rows; i ++){
			for (var j = 0; j < this.cols; j ++){
				if (this.map[pre][i][j] == 2){
					this.map[cur][i][j] = 2;
				}
				else{
					var cnt = 0;
					for (var k = 0; k < 8; k ++){
						var ti = i + this.dir[k][0];
						var tj = j + this.dir[k][1];
						if (ti >= 0 && ti < this.rows && tj >= 0 && tj <= this.cols){
							if (this.map[pre][ti][tj] == 1){
								if (++ cnt > 3) {
									break;
								}
							}
						}
					}
					if (cnt == 2){
						this.map[cur][i][j] = this.map[pre][i][j];
					}
					else if (cnt == 3){
						this.map[cur][i][j] = 1;
					}
					else{
						this.map[cur][i][j] = 0;
					}
				}
			}
		}

		this.cur = cur;
	}

	this.turn = function(x, y) {
		this.map[this.cur][x][y] = (this.map[this.cur][x][y] + 1) % 3;
	}

	this.getMap = function() {
		return this.map[this.cur];
	}
}