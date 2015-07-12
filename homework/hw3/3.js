function MessageBox(){
	var msgBox = document.createElement("div");
	var mouseHead = document.createElement("div");
	var closeButton = document.createElement("button");
	var msgContent = document.createElement("div");
	
	msgBox.id = "msg-box";
	msgBox.class = "27";
	msgBox.setAttribute("style", "border: solid 2px black; width: 302px; height: 202px; display: block; z-index: 1000; position: absolute; backgroundColor: #67a3d9");

	closeButton.type = "button";
	closeButton.setAttribute("style", "float:left; width: 30px; height: 30px;");
	closeButton.onclick = closeMessage;
	var tmpText = document.createTextNode("X");
	closeButton.appendChild(tmpText);
	
	mouseHead.id = "mouse-head";
	mouseHead.setAttribute("style", "border: solid 1px black; float:left; width: 270px; height: 30px; text-align: center; background: #CCCCCC;");
	var tmpText = document.createTextNode("Message Box");
	mouseHead.appendChild(tmpText);
	
	msgContent.id = "msg-content";
	msgContent.setAttribute("style", "border: solid 1px black; float:left; padding: 50px; width: 200px; height: 68px; text-align: center; background: white;");
	var tmpText = document.createTextNode("Hello! Drag me!");
	msgContent.appendChild(tmpText);
	
	msgBox.appendChild(mouseHead);
	msgBox.appendChild(closeButton);
	msgBox.appendChild(msgContent);
	
	document.body.appendChild(msgBox);
	
	//以下部分要将弹出层居中显示
	msgBox.style.left=(document.documentElement.clientWidth-msgBox.clientWidth)/2+document.documentElement.scrollLeft+"px";
	msgBox.style.top =(document.documentElement.clientHeight-msgBox.clientHeight)/2+document.documentElement.scrollTop-50+"px";
 
	//以下部分使整个页面至灰不可点击
	var procbg = document.createElement("div"); //首先创建一个div
	procbg.setAttribute("id","mybg"); //定义该div的id
	procbg.style.background = "#000000";
	procbg.style.width = "100%";
	procbg.style.height = "100%";
	procbg.style.position = "fixed";
	procbg.style.top = "0";
	procbg.style.left = "0";
	procbg.style.zIndex = "500";
	procbg.style.opacity = "0.6";
	procbg.style.filter = "Alpha(opacity=70)";
	//背景层加入页面
	document.body.appendChild(procbg);
	document.body.style.overflow = "hidden"; //取消滚动条
 
	//以下部分实现弹出层的拖拽效果
	var posX;
	var posY;
	mouseHead.onmousedown = function(e){
		if (!e) e = window.event; //IE
		posX = e.clientX - parseInt(msgBox.style.left);
		posY = e.clientY - parseInt(msgBox.style.top);
		document.onmousemove = mousemove;
	}
	document.onmouseup = function(){
		document.onmousemove = null;
	}
	function mousemove(ev){
		if (ev==null) ev = window.event;//IE
		msgBox.style.left = (ev.clientX - posX) + "px";
		msgBox.style.top = (ev.clientY - posY) + "px";
	}
	
	this.init = function(arg){
		if (arg.content){
			var content = document.getElementById("msg-content");
			content.removeChild(content.firstChild);
			var text = document.createTextNode(arg.content);
			content.appendChild(text);
		}
		if ("draggable" in arg && arg.draggable == false){
			var mouseHead = document.getElementById("mouse-head");
			mouseHead.onmousedown = function(){};
		}
		if ("closeKey" in arg){
			var msgBox = document.getElementById("msg-box");
			msgBox.class = arg.closeKey.toString();
		}
	}
	
	document.addEventListener("keydown", messageHotkey, false);
}

function messageHotkey(evt){
	var msgBox = document.getElementById("msg-box");
	if (evt.keyCode == msgBox.class) closeMessage();
}

//关闭弹出层
function closeMessage(){
	var msgBox=document.getElementById("msg-box");
	msgBox.parentNode.removeChild(msgBox);
	document.body.style.overflow = "auto"; //恢复页面滚动条
	var body = document.getElementsByTagName("body");
	var mybg = document.getElementById("mybg");
	body[0].removeChild(mybg);
}