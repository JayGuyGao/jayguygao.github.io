currentPicture = 2;
currentState = "PictureWall";
imageInfo = null;
remainingPicture = 0;
commentPage = 0;
picIndex = 0;
localLongitude = 45;
localLatitude = 90;

var tmpImg = document.getElementsByClassName("picture-item");
for (var i = 0; i < tmpImg.length; i ++){
	tmpImg[i].addEventListener("click", clickPicture, false);
}


//添加1张图片
function addOnePicture(){
	//计算当前添加图片
	currentPicture = (currentPicture + 1) % imageInfo.length;
		
	//新建图片节点
	var picDiv = document.createElement('div');
	picDiv.setAttribute("class", "picture-item");
	var picImg = document.createElement('img');
	picImg.src = imageInfo[currentPicture].miniurl;
	picImg.setAttribute("picture-index", currentPicture);
	picImg.setAttribute("class", "image");
	
	var txtNode = document.createTextNode("正在用吃奶的力气为您加载图片(也许这张图片跪了T_T)");
	picDiv.appendChild(txtNode);
	picDiv.appendChild(picImg);
	picDiv.addEventListener("click", clickPicture, false);
	
	var divNode = document.createElement("div");
	divNode.setAttribute("class", "picture-distance");
	var pNode = document.createElement("p");
	var txtNode = document.createTextNode(Math.floor(getDistance(localLatitude, localLongitude, imageInfo[currentPicture].latitude, imageInfo[currentPicture].longitude)) + "千米");
	pNode.appendChild(txtNode);
	divNode.appendChild(pNode);
	picDiv.appendChild(divNode);

	
	//查找最短的那一列
	var listPointer = document.getElementById("list0");
	for (var j = 1; j < 3; j ++){
		var tmp = document.getElementById("list" + j);
		if (listPointer.clientHeight > tmp.clientHeight){
			listPointer = tmp;
		}
	}
	
	//将图片插入最短的那一列
	//console.log(listPointer.id + ' height:' + listPointer.clientHeight + " pic:" + currentPicture);
	listPointer.appendChild(picDiv);
	
	remainingPicture --;
	if (remainingPicture){
		picImg.onload = function (){
			this.parentNode.removeChild(this.parentNode.firstChild);
			addOnePicture();
		} 
	}
	else{
		picImg.onload = function (){
			this.parentNode.removeChild(this.parentNode.firstChild);
		}
	}
}

//添加addTotal张图片
function addPicture(addTotal){
	
	remainingPicture = addTotal;
	
	addOnePicture();
	
	for (var i = 0; i < addTotal; i ++){
		
	}
}

function clickPicture(evt) {
	if (currentState == "PictureView"){
		return;
	}
	currentState = "PictureView";
	
	//创建蒙版
	var bg = document.createElement('div');
	bg.setAttribute("style", "width: 100%; height: 100%; position:fixed; z-index: 1000; top:0px; left:0px; background: #FFFFFF; filter: alpha(0pacity=80); -moz-opacity:0.80; opacity:0.80;");
	bg.setAttribute("id", 'background');
	bg.addEventListener("click", clickbg, false);
	
	//创建图片和评论的容器
	var container = document.createElement('div');
	container.setAttribute("style", "width: auto; height: auto; position:fixed; z-index: 1001; top: 50px;");
	container.setAttribute("id", "picture-view-container");
	
	//创建图片容器
	var pic = document.createElement('div');
	var picSty = "width: " + Math.floor(window.innerWidth * 0.7) + "px; height: auto; ";
	var imgSty = "width: 100%; height: auto;"
	if (this.getElementsByTagName("img")[0].clientHeight * 16.0 / 9.0 > this.getElementsByTagName("img")[0].clientWidth){
		picSty = "height: " + Math.floor(window.innerHeight * 0.7) + "px; width: auto;";
		imgSty = "height: 100%; width: auto;";
	}
	pic.setAttribute("style", picSty + "float:left; border: solid white 10px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5);");
	pic.setAttribute("id", "picture-view");
	
	//创建图片
	var img = document.createElement('img');
	img.setAttribute("style", imgSty);
	picIndex = this.getElementsByTagName("img")[0].getAttribute("picture-index");
	img.setAttribute("src", imageInfo[picIndex].bigurl);

	//创建评论容器
	var commentlist = document.createElement('div');
	commentlist.setAttribute("id", "comment-list");
	commentlist.setAttribute("style", "height: 100%; width: 300px; float:left;");
	
	for (var i = 0; i < 5; i ++){
		var comment = document.createElement('div');
		comment.setAttribute("style", "height: 15%; width: 80%; margin: 2px; background: white; border: solid white 10px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5);");
		comment.setAttribute("class", "comment-item");
		commentlist.appendChild(comment);
	}
	
	//创建“上一页”“下一页”按钮
	var prevButton = document.createElement('div');
	var nextButton = document.createElement('div');
	prevButton.setAttribute("class", "comment-button");
	prevButton.setAttribute("style", "display: inline; height: 15%; width: 40%; margin: 2px; background: white; border: solid white 10px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5); border-radius: 4px;");
	nextButton.setAttribute("class", "comment-button");
	nextButton.setAttribute("style", "display: inline; height: 15%; width: 40%; margin: 2px; background: white; border: solid white 10px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5); border-radius: 4px;");
	
	prevButton.onclick = function (evt){
		if (commentPage > 0){
			commentPage --;
			loadComment();
		}
		else{
			alert("对不起，这是第一页了...0 0");
		}
	}
	nextButton.onclick = function (evt){
		if (commentPage < imageInfo[picIndex].commenturl.length - 1){
			commentPage ++;
			loadComment();
		}
		else{
			alert("对不起，这是最后一页了...0 0");
		}
	}
	
	var pNode = document.createElement("p");
	var txtNode = document.createTextNode("上一页");
	pNode.appendChild(txtNode);
	prevButton.appendChild(pNode);
	
	var pNode = document.createElement("p");
	var txtNode = document.createTextNode("下一页");
	pNode.appendChild(txtNode);
	nextButton.appendChild(pNode);
	
	commentlist.appendChild(prevButton);
	commentlist.appendChild(nextButton);
	
	pic.appendChild(img);
	container.appendChild(pic);
	container.appendChild(commentlist);
	
	
	var body = document.body;
	body.appendChild(bg);
	body.appendChild(container);
	
	img.onload = function (evt) {
		//创建“查看大图”按钮
		var divNode = document.createElement("div");
		var aNode = document.createElement("a");
		var txtNode = document.createTextNode("查看大图");
		divNode.setAttribute("style", "clear: left; display: block; margin-top: 10px; height: 10px; width: " + document.getElementById("picture-view").clientWidth + "px; background: white; border: solid white 10px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5); border-radius: 4px; text-align: center;");
		aNode.setAttribute("href", imageInfo[picIndex].bigurl);
		aNode.setAttribute("class", "bigimage-link");
		aNode.appendChild(txtNode);
		divNode.appendChild(aNode);
		document.getElementById("picture-view-container").appendChild(divNode);
		
		adjustPictureView();
	}
	
	commentPage = 0;
	loadComment();
	
	evt.stopPropagation();
}

function loadComment(){
	var commentNode = document.getElementsByClassName('comment-item');
	if (!commentNode){
		return;
	}
	for (var i = 0; i < commentNode.length; i ++){
		while (commentNode[i].firstChild) {
			commentNode[i].removeChild(commentNode[i].firstChild);
		}
		var txtNode = document.createTextNode("正在用吃奶的力气为您加载评论...");
		commentNode[i].appendChild(txtNode);
	}
	
	var ajax = new XMLHttpRequest();
	ajax.open("GET", imageInfo[picIndex].commenturl[commentPage], true);
	ajax.send();
	ajax.onreadystatechange = function (){
		var commentlist = document.getElementById("comment-list");
		if (!commentlist){
			return;
		}
		if (ajax.readyState == 4 && ajax.status == 200){
			var commentItem = JSON.parse(ajax.responseText);
			var commentNode = document.getElementsByClassName('comment-item');
			for (var i = 0; i < 5; i ++){
				var comment = commentNode[i];
				while (comment.firstChild) {
					comment.removeChild(comment.firstChild);
				}
				var tmpP = document.createElement('p');
				var txt = document.createTextNode(commentItem[i].name + ": " + commentItem[i].comment);
				tmpP.appendChild(txt);
				
				var tmpNode = document.createElement("div");
				var txt = document.createTextNode("顶:(" + commentItem[i].agree + ") 踩:(" + commentItem[i].disagree + ")");
				tmpNode.appendChild(txt);
				tmpNode.setAttribute("style", "width: 90%; height: auto; text-align: right; font-family: 微软雅黑; font-size: 0.6em; color: grey;");
				
				comment.appendChild(tmpP);
				comment.appendChild(tmpNode);
			}
			adjustPictureView();
		}
	}
}

function adjustPictureView(){
	var container = document.getElementById("picture-view-container");
	container.style.left = Math.floor((window.innerWidth - container.clientWidth) / 2) + "px";
	var node = document.getElementById("comment-list");
	//node.setAttribute("style", "height: "document.getElementById("picture-view-container").clientHeight" width: 300px; float:left;");
	node.style.height = document.getElementById("picture-view").clientHeight + "px";
	var marginHeight = document.getElementById("picture-view").clientHeight / 50;
	var buttonHeight = marginHeight * 2;
	var eachHeight = (document.getElementById("picture-view").clientHeight - 1 * 6 - marginHeight * 5 - buttonHeight) / 5;
	
	node = document.getElementsByClassName("comment-item");
	for (var i = 0; i < node.length; i ++){
		node[i].setAttribute("style", "float: left; height: " + eachHeight + "px; width: 80%; margin-bottom: " + marginHeight + "px; margin-left: " + marginHeight + "px; background: white; border: solid white 1px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5);");
	}
	node = document.getElementsByClassName("comment-button");
	for (var i = 0; i < node.length; i ++){
		node[i].setAttribute("style", "float: left; height: " + buttonHeight + "px; margin-left: " + marginHeight * 2 + "px; width: 30%; background: white; border: solid white 1px; -webkit-box-shadow:0 0 10px rgba(0, 0, 0, .5); -moz-box-shadow:0 0 10px rgba(0, 0, 0, .5); box-shadow:0 0 10px rgba(0, 0, 0, .5); border-radius: 4px;");
	}
}

function getDistance(lat1, lng1, lat2, lng2){
	function Rad(d){
       return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    }
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var b = Rad(lng1) - Rad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	s = s * 6378.137 ;// EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000; //输出为公里
	return s;
}

function clickbg(evt) {
	if (currentState == "PictureWall"){
		return;
	}
	currentState = "PictureWall";
	
	var bg = document.getElementById("background");
	var container = document.getElementById("picture-view-container");
	document.body.removeChild(bg);
	document.body.removeChild(container);
}

//滚动条在Y轴上的滚动距离
function getScrollTop(){
　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
　　if(document.body){
　　　　bodyScrollTop = document.body.scrollTop;
　　}
　　if(document.documentElement){
　　　　documentScrollTop = document.documentElement.scrollTop;
　　}
　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
　　return scrollTop;
}

//文档的总高度
function getScrollHeight(){
　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
　　if(document.body){
　　　　bodyScrollHeight = document.body.scrollHeight;
　　}
　　if(document.documentElement){
　　　　documentScrollHeight = document.documentElement.scrollHeight;
　　}
　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
　　return scrollHeight;
}

//浏览器视口的高度
function getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
}

//判断滚动条是否到底部
window.onscroll = function (evt) {
	if (getScrollTop() + getWindowHeight() +50 >= getScrollHeight()){
		if (imageInfo != null && remainingPicture === 0){
			addPicture(10);
		}
	}
}

function locationError(error){
    switch(error.code) {
        case error.TIMEOUT:
            alert("A timeout occured! Please try again!");
            break;
        case error.POSITION_UNAVAILABLE:
            alert('We can\'t detect your location. Sorry!');
            break;
        case error.PERMISSION_DENIED:
            alert('Please allow geolocation access for this to work.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occured!');
            break;
    }
}

function locationSuccess(position){
    var coords = position.coords;
	localLatitude = coords.latitude;
	localLongitude = coords.longitude;
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{
        // 指示浏览器获取高精度的位置，默认为false
        enableHighAcuracy: true,
        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
        timeout: 5000,
        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
        maximumAge: 3000
    });
}else{
    alert("Your browser does not support Geolocation!");
}

window.onload = function(evt){
	var ajax = new XMLHttpRequest();
	ajax.open("GET", "./jsons/image_request.json", true);
	ajax.send();
	ajax.onreadystatechange = function (){
		if (ajax.readyState == 4 && ajax.status == 200){
			imageInfo = JSON.parse(ajax.responseText);
			
			var picNode = document.getElementsByClassName("picture-item");
			for (var i = 0; i < picNode.length; i ++){
				var divNode = document.createElement("div");
				divNode.setAttribute("class", "picture-distance");
				var pNode = document.createElement("p");
				var txtNode = document.createTextNode(Math.floor(getDistance(localLatitude, localLongitude, imageInfo[i].latitude, imageInfo[i].longitude)) + "千米");
				pNode.appendChild(txtNode);
				divNode.appendChild(pNode);
				picNode[i].appendChild(divNode);
			}
		}
	}
}