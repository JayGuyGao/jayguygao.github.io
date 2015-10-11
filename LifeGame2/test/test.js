
describe("Test game_board.js", function() {
	describe("Test GameBoard", function() {
		describe("Test GameBoard(5, 6, 0.5)", function () {
			it("should init (cols, rows, proportion) = (5, 6, 0,5)", function() {
				var test = new GameBoard(5, 6, 0.5);
				assert.equal(test.cols, 5);
				assert.equal(test.rows, 6);
				assert.equal(test.proportion, 0.5);
			});
		});

		describe("Test init(6, 7, 0.3)", function () {
			it("should init (cols, rows, proportion) = (6, 7, 0.3)", function() {
				var test = new GameBoard(5, 6, 0.5);
				test.init(6, 7, 0.3)
				assert.equal(test.cols, 6);
				assert.equal(test.rows, 7);
				assert.equal(test.proportion, 0.3);
			});
		});

		describe("Test start", function () {
			it("should init every grid with 0 or 1", function() {
				var test = new GameBoard(5, 6, 0.5);
				test.start();
				var map = test.getMap();
				for (var i = 0; i < 6; i ++)
					for (var j = 0; j < 5; j ++)
						assert.include([0, 1], map[i][j]);
			});
		});

		describe("Test turn", function () {
			it("should turn grid from 0 to 1", function() {
				var test = new GameBoard(5, 6, 0);
				test.start();
				test.getMap()[0][0] = 0;
				test.turn(0, 0);
				assert.equal(test.getMap()[0][0], 1);
			});
			it("should turn grid from 1 to 2", function() {
				var test = new GameBoard(5, 6, 0);
				test.start();
				test.getMap()[0][0] = 1;
				test.turn(0, 0);
				assert.equal(test.getMap()[0][0], 2);
			});
			it("should turn grid from 2 to 0", function() {
				var test = new GameBoard(5, 6, 0);
				test.start();
				test.getMap()[0][0] = 2;
				test.turn(0, 0);
				assert.equal(test.getMap()[0][0], 0);
			});
		});

		describe("Test update", function () {
			it("should turn the map from [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]] to [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 0, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]]", function() {
				var test = new GameBoard(5, 5, 0);
				test.start();
				var src = [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]];
				var dst = [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 0, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]];
				for (var i = 0; i < 5; i ++)
					for (var j = 0; j < 5; j ++)
						test.getMap()[i][j] = src[i][j];
				test.update();
				assert.deepEqual(test.getMap(), dst);
			});
			it("should turn the map from [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 2, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]] to [[0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 2, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0]]", function() {
				var test = new GameBoard(5, 5, 0);
				test.start();
				var src = [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 2, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]];
				var dst = [[0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 2, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0]];
				for (var i = 0; i < 5; i ++)
					for (var j = 0; j < 5; j ++)
						test.getMap()[i][j] = src[i][j];
				test.update();
				assert.deepEqual(test.getMap(), dst);
			});
		});
	});
});