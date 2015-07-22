//画小球
function drawBall(x,y,r){
	var canvas = document.getElementById("demoCanvas");
	if (canvas==null) return false;
	var context = canvas.getContext("2d");
	context.fillStyle = "#F3EA00";
	context.strokeStyle = "#004B53";
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2, true);
	context.closePath();
	context.lineWidth="3";
	context.stroke();
	context.fill();
	context.fillStyle = "#BF893C";
	context.beginPath();
	context.moveTo(x,y);
	context.arc(x, y, r, 0, Math.PI * 1.5, true);
	context.arc(x, y, r, Math.PI * 0.5, Math.PI, false);
	context.closePath();
	context.fill();
}
//画target，r1不可大于r2的0.86倍，否则中间的圆环无法显示
function drawTarget(x,y,r1,r2,f2,f1,a1,a2){
	var canvas = document.getElementById("demoCanvas");
	if (canvas==null) return false;
	var context = canvas.getContext("2d");
	//阴影角度
	var arg = Math.PI / 3;
	//画外部阴影
	context.save();
	context.translate(x,y);
	context.fillStyle = "#FFDADA";
	context.strokeStyle = "#fff";
	context.rotate(arg);
	context.fillRect(0,-(r2+2),2000,2*(r2+2));
	context.beginPath();
	context.moveTo(0,-(r2+2));
	context.lineTo(2000,-(r2+2));
	context.moveTo(0,r2+2);
	context.lineTo(2000,r2+2);
	context.stroke();
	context.restore();
	//画外边轮廓，不在r内
	context.fillStyle="#fff";
	context.beginPath();
	context.arc(x, y, r2+2, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	//画大圆
	context.fillStyle="#FF3538";
	context.beginPath();
	context.arc(x, y, r2, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	if(f1==true){
		context.save();
		context.fillStyle="orange";
		context.beginPath();
		context.moveTo(x,y);
		context.arc(x,y,r2,-a1-a2,-a1+a2,false);
		context.closePath();
		context.fill();
		context.restore;
	}
	//白圆
	context.fillStyle="#FAFAFA";
	context.beginPath();
	context.arc(x, y, 0.86*r2, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	//小圆外层红圈
	context.fillStyle="#FF3538";
	context.beginPath();
	context.arc(x, y, r1, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	if(f2==true){
		context.fillStyle="orange";
		context.beginPath();
		context.arc(x, y, r1, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}
	//内橘黄色
	context.fillStyle="orange";
	context.beginPath();
	context.arc(x, y, r1*0.7, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();
	//十字
	context.save();
	context.translate(x,y)
	context.rotate(Math.PI*0.25)
	context.strokeStyle="#FFF";
	context.beginPath();
	context.moveTo(-0.5*r1,0);
	context.lineTo(+0.5*r1,0);
	context.moveTo(0,0.5*r1);
	context.lineTo(0,-0.5*r1);
	context.closePath();
	context.lineWidth = "1.5";
	context.stroke();
	context.restore();
}
function drawArrow(x,y,r,currentAngle,per){
	var canvas = document.getElementById("demoCanvas");
	if (canvas==null) return false;
	var context = canvas.getContext("2d");
	context.fillStyle = "#823A03";
	context.save();
	context.translate(x,y);
	context.beginPath();
	context.rotate(-currentAngle);
	context.moveTo(2.5*r,0);
	context.lineTo(1.5*r,-0.4*r);
	context.lineTo(8*r,0);
	context.lineTo(1.5*r,0.4*r);
	context.closePath();
	context.fill();
	context.clip();
	if (typeof arguments[4] != "undefined"){
		context.fillStyle = "#FF5700";
		l = r * per;
		context.fillRect(1.5*r,-0.4*r,6.5*l,0.8*r);
	}
	context.restore();
}
//画阴影线
function drawLine(x,y,cx,cy,cl){
	var canvas = document.getElementById("demoCanvas");
	if (canvas==null) return false;
	var context = canvas.getContext("2d");
	var arg = Math.PI / 3;
	context.save();
	context.strokeStyle = "#E54A04";
	context.lineWidth = "1";
	context.translate(x,y);
	context.rotate(arg);
	context.beginPath();
	context.moveTo(cx,cy);
	context.lineTo(cx+cl,cy);
	context.closePath();
	context.stroke();
	context.restore();
}
//显示分数
function showInfo(x,y,score){
	var canvas = document.getElementById("demoCanvas");
	if (canvas==null) return false;
	var context = canvas.getContext("2d");
	context.font = "30px Comic Sans MS";
	context.fillStyle = "orange";
	context.fillText("score :",x,y);
	context.font = "30px 华文新魏";
	context.fillStyle = "red";
	context.fillText(score,x+100,y+1);
	context.font = "10px 微软雅黑";
	context.fillText("author:  高贤达 张永锋",x,y+355);
}

function drawDiv(){
	$("#gameover").css("top",$("#demoCanvas")[0].offsetTop-8);
	var left = 0.5*$("#demoCanvas")[0].offsetWidth+($("#demoCanvas")[0].offsetLeft-8)-0.5*$("#gameover")[0].offsetWidth;
	$("#gameover").css("left",left);
	$("#showscore").html("最高得分："+gameBoard.highScore+"<br>您的得分："+gameBoard.score);
}

function gameover(){
	$("#demoCanvas")[0].style.opacity=0.1;
	$("#gameover").slideDown();
	drawDiv();
}

$(function(){
	$("#restart").click(function(){
		$("#demoCanvas")[0].style.opacity=1;
		$("#gameover").slideUp();
		gameBoard.start();
	});
})
