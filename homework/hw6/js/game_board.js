//Author: 高贤达
var gameBoard = { //游戏逻辑对象

	//------------------------常量部分------------------------
	
	width: 1000, 	//界面宽度(对应x坐标)
	height: 400, 	//界面高度(对应y坐标)
	fps: 50, 		//帧率
	R: 60, 			//目标圈最小半径
	initialA: -0.00003,
	angleSpreadSpeed: Math.PI / 1000,
	traceFadeSpeed: 4 / 500,
	angleIncreaseSpeed: 0.0004, //角度旋转速度
	forceIncreaseSpeed: 0.04,	//力度增加速度
	
	//------------------------变量部分------------------------
	
	hard: 0.4,					//难度系数0~1，越大越难，随时间增加
	score: 0, 					//当前分数
	highScore: 0,				//最高得分
	perfect: 0, 				//当前完美击中数
	status: 1, 					//当前状态：1选方向，2选力度，3小球滚动，4画面平移
	currentTarget: 0, 			//当前目标
	lastCallTime: 0, 			//上次执行时间
	
	minAngle: -Math.PI / 2, 	//最小角度
	maxAngle: Math.PI / 2, 		//最大角度 
	currentAngle: 0, 			//当前角度
	angleIncrease: 1, 			//角度旋转方向：1逆时针，-1顺时针
	
	currentForce: 0, 			//当前力度
	minForce: 0, 				//最小力度
	maxForce: 100, 				//最大力度
	forceIncrease: 1, 			//1力度增加，-1力度减小
	
	ball: { 					//小球
		x: 0, 					//x坐标
		y: 0, 					//y坐标
		r: 13, 					//半径
		v: { 					//速度向量
			x: 0,
			y: 0
		},
		a: this.initialA, 		//加速度
	},
	
	trace: [					//小球轨迹动画对象
		{
			x: 0,
			y: 0,
			r: 10
		}
	],
	
	target: [ 					//目标圈对象数组
		{ 						//目标圈对象
			x: 0, 				//x坐标
			y: 0, 				//y坐标
			r1: 4, 				//内圈半径
			r2: 10, 			//外圈半径
			f1: false,			//小球是否在内圈
			f2: false,			//小球是否在外圈
			enterAngle: 0,		//小球进入的角度(相对于Target圆形)
			spreadAngle: 0,		//控制角度扩张动画
			animLine:[			//阴影内流动线条动画
				{
					dr: 0,
					dt: 0,
					dl: 0,
					moveSpeed: 0,
				}
			],
		}
	],
	
	//------------------------函数部分------------------------
	
	//开始游戏
	start: function(){
		this.hard = 0.4;
		this.ball.x = this.ball.r + 1;
		this.ball.y = this.height / 2;
		this.trace = [];
		this.target = [];
		this.createNewTarget(3);
		this.score = 0;
		this.perfect = 0;
		this.status = 1;
		this.currentTarget = 0;
		this.calculateAngle();
		this.lastCallTime = this.getTime();
		setTimeout("gameBoard.run()", 1000 / this.fps);
	},
	
	//运行一次迭代
	run: function(){
		var currentTime = this.getTime();
		
		if (this.status == 1){			//正在选方向
			this.rotateAngle(currentTime);
		}
		else if (this.status == 2){		//正在选力度
			this.changeForce(currentTime);
		}
		else if (this.status == 3){		//正在滚动小球
			if (!this.rollBall(currentTime)) {
				this.highScore = Math.max(this.highScore, this.score);
				$.publish("gameover");
				return false;
			}
		}
		else if (this.status == 4){		//正在平移画布
			this.moveBoard(currentTime);
		}
		else{
			return false;
		}
		
		this.handleAnimation(currentTime);
		
		this.lastCallTime = currentTime;
		setTimeout("gameBoard.run()", 1000 / this.fps);
		return true;
	},
	
	//处理动画
	handleAnimation: function(currentTime){
		
		
		
		//this.target = this.target.filter(function(ele, pos){ return (ele.x + ele.r2 > 0); });
		for (var i = 0; i < this.target.length; i ++){
			if (this.target[i].x + this.target[i].r2 > 0 && this.target[i].x - this.target[i].r2 < this.width){
				
				//处理Target阴影内流动线条动画
				//this.target[i].animLine = this.target[i].animLine.filter(function (ele, pos) { return (ele.dt < this.height + this.width); });
				//if (this.target[i].x + this.target[i].r2 > this.ball.x && this.target[i].x - this.target[i].r2 < this.ball.x){
				//	this.currentTarget = i;
				//}
				for (var j = 0; j < this.target[i].animLine.length; j ++){
					this.target[i].animLine[j].dt += this.target[i].animLine[j].moveSpeed * (currentTime - this.lastCallTime);
				}
				if (Math.random() < 0.04){
					//console.log("new line");
					var tmpdr = this.randomSign() * Math.random() * this.target[i].r2;
					var tmpdt = Math.sqrt(this.target[i].r2 * this.target[i].r2 + tmpdr * tmpdr) + 1;
					var tmpdl = Math.random() * this.R;
					this.target[i].animLine.push({
						dr: tmpdr,
						dt: tmpdt,
						dl: tmpdl + 10,
						moveSpeed: (Math.random() * 2 + 1) * 30 / 1000,
					});
				}
				
				//处理进入和退出Target的动画
				var it = this.inTarget(i);
				if (it != 0){
					this.target[i].f1 = (it === 2);
					
					if (!this.target[i].f2){
						var dx = this.ball.x - this.target[i].x;
						var dy = this.target[i].y - this.ball.y;
						this.target[i].f2 = true;
						this.target[i].enterAngle = Math.atan2(dy, dx);
						this.target[i].spreadAngle = 0;
					}
					else {
						this.target[i].spreadAngle += this.angleSpreadSpeed * (currentTime - this.lastCallTime);
						if (this.target[i].spreadAngle > Math.PI){
							this.target[i].spreadAngle = Math.PI;
						}
					}
				}
				else{
					if (this.target[i].f2){
						this.target[i].spreadAngle -= this.angleSpreadSpeed * (currentTime - this.lastCallTime);
						if (this.target[i].spreadAngle < 0){
							this.target[i].spreadAngle = 0;
							this.target[i].f2 = false;
						}
					}
				}
			}
		}
		
		
		//处理小球轨迹动画
		for (var i = 0; i < this.trace.length; i ++){
			this.trace[i].r -= this.traceFadeSpeed * (currentTime - this.lastCallTime);
		}
		this.trace = this.trace.filter(function(ele, pos) {return (ele.r > 0)});
		//console.log("trace: " + this.trace.length);
		

	},
	
	//处理用户消息
	clientCall: function(){
		if (this.status == 1){
			this.status = 2;
			return true;
		}
		else if (this.status == 2){
			this.status = 3;
			this.ball.a = this.initialA;
			this.ball.v.x = this.currentForce / this.maxForce / 1000 * this.width * Math.cos(this.currentAngle) * 2;
			this.ball.v.y = - this.currentForce / this.maxForce / 1000 * this.width * Math.sin(this.currentAngle) * 2;
			this.currentForce = 0;
			return true;
		}
		else if (this.status == 3){
			return false;
		}
	},
	
	//平移画布(status == 4)
	moveBoard: function(currentTime){
		if (this.ball.x < this.width / 5){
			this.status = 1;
			this.currentTarget ++;
			this.calculateAngle();
			if (this.currentTarget + 3 > this.target.length){
				this.createNewTarget(3);
			}
		}
		else {
			var delta = this.ball.x * 0.6 * (currentTime - this.lastCallTime) / 500;
			this.ball.x -= delta;
			for (var i = 0; i < this.target.length; i ++){
				this.target[i].x -= delta;
			}
		}
	},
	
	//滚动小球(status == 3)
	rollBall: function(currentTime){
		var vx = this.ball.v.x;
		var vy = this.ball.v.y;
		var v = Math.sqrt(vx * vx + vy * vy);
		//if (v > 1) console.log(v);
		
		if (v > 0.2 && v < 3 && Math.random() < 0.6){
			this.trace.push({
				x: this.ball.x + this.randomSign() * Math.random() * this.ball.r,
				y: this.ball.y + this.randomSign() * Math.random() * this.ball.r,
				r: Math.random() * this.ball.r * 0.8
			});
		}
		
		this.ball.x += vx * (currentTime - this.lastCallTime);
		this.ball.y += vy * (currentTime - this.lastCallTime);
		//this.ball.v.x += this.ball.a / v * vx * (currentTime - this.lastCallTime);
		//this.ball.v.y += this.ball.a / v * vy * (currentTime - this.lastCallTime);
		this.ball.a *= (1.02);
		this.ball.v.x *= Math.pow(0.97, (currentTime - this.lastCallTime) / 16);
		this.ball.v.y *= Math.pow(0.97, (currentTime - this.lastCallTime) / 16);
		
		//判断小球是否停止
		if (v < 1e-2){
			if (this.checkScore()){
				this.status = 4;
			}
			else{
				//alert("Game Over! Your Score is: " + this.score);
				return false;
			}
		}
		
		//判断小球是否碰撞边界
		if (this.ball.y - this.ball.r < 0){
			this.ball.y = this.ball.r;
			this.ball.v.y *= -1;
		}
		if (this.ball.y + this.ball.r > this.height){
			this.ball.y = this.height - this.ball.r;
			this.ball.v.y *= -1;
		}
		
		return true;
	},
	
	//改变力度(status == 2)
	changeForce: function(currentTime){
		this.currentForce += this.forceIncreaseSpeed * (currentTime - this.lastCallTime) * this.forceIncrease;
		if (this.currentForce < this.minForce){
			this.currentForce = this.minForce;
			this.forceIncrease = 1;
		}
		else if (this.currentForce > this.maxForce){
			this.currentForce = this.maxForce;
			this.forceIncrease = -1;
		}
	},
	
	//旋转角度(status == 1)
	rotateAngle: function(currentTime){
		this.currentAngle += this.angleIncreaseSpeed * (currentTime - this.lastCallTime) * this.angleIncrease;
		if (this.currentAngle < this.minAngle){
			this.currentAngle = this.minAngle;
			this.angleIncrease = 1;
		}
		else if (this.currentAngle > this.maxAngle){
			this.currentAngle = this.maxAngle;
			this.angleIncrease = -1;
		}
	},
	
	//添加N一个新Target
	createNewTarget: function(N){
		var left = 0;
		if (this.target.length > 0){
			left = this.target[this.target.length - 1].x + this.target[this.target.length - 1].r2;
		}
		
		for (var i = 0; i < N; i ++){
			var R2 = Math.floor(this.R + Math.random() * this.R * (1 - this.hard));
			this.target.push({
				x: Math.floor(left + R2 + this.width / 2 * this.hard + Math.random() * this.width / 100),
				y: Math.floor(R2 + Math.random() * (this.height - R2 * 2)),
				r1: this.ball.r + 3,
				r2: R2,
				f1: false,
				f2: false,
				enterAngle: 0,
				spreadAngle: 0,
				animLine:[],
			});
			left = this.target[this.target.length - 1].x + this.target[this.target.length - 1].r2;
		}
		
	},
	
	//计算角度范围
	calculateAngle: function(){
		var dx = this.target[this.currentTarget].x - this.ball.x;
		var dy = this.target[this.currentTarget].y - this.ball.y;
		var angle1 = Math.atan(- dy / dx);
		var angle2 = Math.asin(Math.min(1, this.target[this.currentTarget].r2 * 2 / Math.sqrt(dx * dx + dy * dy)));
		this.minAngle = Math.max(angle1 - angle2, -Math.PI / 2);
		this.maxAngle = Math.min(angle1 + angle2, Math.PI / 2);
		this.currentAngle = this.minAngle;
	},
	
	//判断小球是否在Target[index]中
	inTarget: function(index){
		var dx = this.target[index].x - this.ball.x;
		var dy = this.target[index].y - this.ball.y;
		var ds = Math.sqrt(dx * dx + dy * dy);
		
		if (ds < this.target[index].r1){
			return 2;
		}
		else if (ds < this.target[index].r2){
			return 1;
		}
		else{
			return 0;
		}
	},
	
	//检查加分
	checkScore: function(){
		var it = this.inTarget(this.currentTarget);
		if (it >= 1){
			this.hard += (1 - this.hard) * 0.2;
			this.score ++;
			if (it == 2){
				this.perfect ++;
				this.score += this.perfect;
				//console.log("Perfect!" + this.perfect);
				$.publish("perfect");
			}
			return true;
		}
		return false;
	},
	
	//随见返回-1和1
	randomSign: function(){
		if (Math.random() < 0.5){
			return 1;
		}
		else{
			return -1;
		}
	},
	
	//获取时间
	getTime: function(){
		var myTime = new Date();
		return myTime.getTime();
	},
};