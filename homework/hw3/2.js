function goTop() {
	acceleration = 0.2;
	time = 16;
 
	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var x3 = 0;
	var y3 = 0;
 
	if (document.documentElement) {
		x1 = document.documentElement.scrollLeft || 0;
		y1 = document.documentElement.scrollTop || 0;
	}
	if (document.body) {
		x2 = document.body.scrollLeft || 0;
		y2 = document.body.scrollTop || 0;
	}
	var x3 = window.scrollX || 0;
	var y3 = window.scrollY || 0;
 
	// 滚动条到页面顶部的水平距离
	var x = Math.max(x1, Math.max(x2, x3));
	// 滚动条到页面顶部的垂直距离
	var y = Math.max(y1, Math.max(y2, y3));
 
	// 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
	var speed = 1 + acceleration;
	window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
 
	// 如果距离不为零, 继续调用迭代本函数
	if (x > 0 || y > 0) {
		var invokeFunction = "goTop()";
		window.setTimeout(invokeFunction, time);
	}
}

function myHotkey(evt){
	if (evt.ctrlKey && evt.shiftKey && evt.altKey && evt.keyCode == 84) goTop();
}

function BackToTop(){
	function init(){
		if (arguments.length < 1) return;
		var arg = arguments[0];
		var button = document.getElementById("back-to-top");
		if (arg.LeftUp){
			button.style.top = "10%";
			button.style.left = "10%";
		}
		else if (arg.LeftDown){
			button.style.top = "90%";
			button.style.left = "10%";
		}
		else if (arg.RightUp){
			button.style.top = "10%";
			button.style.left = "90%";
		}
		else if (arg.RightDown){
			button.style.top = "90%";
			button.style.left = "90%";
		}
		else{
			button.style.left = arg.x + "px";
			button.style.top = arg.y + "px";
		}
	}
	
	var tmpButton = document.createElement("button");
	var tmpText = document.createTextNode("BackToTop");
	tmpButton.appendChild(tmpText);
	tmpButton.type = "button";
	tmpButton.id = "back-to-top";
	tmpButton.onclick = goTop;
	tmpButton.style.position = "fixed";
	tmpButton.style.top = "90%";
	tmpButton.style.left = "90%";
	
	document.body.appendChild(tmpButton);
	document.onkeydown = myHotkey;
	document.addEventListener("scroll", checkScroll, false);
	
	this.init = init;
}

function checkScroll(evt){
	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var x3 = 0;
	var y3 = 0;
 
	if (document.documentElement) {
		x1 = document.documentElement.scrollLeft || 0;
		y1 = document.documentElement.scrollTop || 0;
	}
	if (document.body) {
		x2 = document.body.scrollLeft || 0;
		y2 = document.body.scrollTop || 0;
	}
	var x3 = window.scrollX || 0;
	var y3 = window.scrollY || 0;
 
	// 滚动条到页面顶部的水平距离
	var x = Math.max(x1, Math.max(x2, x3));
	// 滚动条到页面顶部的垂直距离
	var y = Math.max(y1, Math.max(y2, y3));
	
	var button = document.getElementById("back-to-top");
	if (x == 0 && y == 0) button.style.display = "none";
	else button.style.display = "block";
}