function UI(cvs){
	this.cvsbuf = document.createElement('canvas');
	this.cvsbuf.width = cvs.width;
	this.cvsbuf.height = cvs.height;
	this.cvs = cvs;
	this.height = cvs.height; 
	this.width = cvs.width;
	this.cvsbufctx = this.cvsbuf.getContext('2d');
	this.cvsctx = cvs.getContext('2d');
	this.draw = function(matrix, rows, cols){
		this.cvsbufctx.clearRect(0, 0, this.cvsbuf.width, this.cvsbuf.height);
		this.cvsctx.clearRect(0, 0, cvs.width, cvs.height);
		var gridWidth = this.width / cols;
		var gridHeight = this.height / rows;
		var x = 0; 
		var y = 0;
		this.cvsbufctx.strokeStyle = "#fff";
		for (var i = 0; i < rows; i++){
			x = 0;
			for (var j = 0; j < cols; j++){
				if (matrix[i][j] == 1) {
					this.cvsbufctx.fillStyle = "#888";
					this.cvsbufctx.fillRect(x, y, gridWidth, gridHeight);
					this.cvsbufctx.strokeRect(x, y, gridWidth, gridHeight);
				}
				else if (matrix[i][j] == 2){
					this.cvsbufctx.fillStyle = "#000";
					this.cvsbufctx.fillRect(x, y, gridWidth, gridHeight);
					this.cvsbufctx.strokeRect(x, y, gridWidth, gridHeight);
				}
				x += gridWidth;
			}
			y += gridHeight;
		}
		this.cvsctx.drawImage(this.cvsbuf, 0, 0);
	}
}