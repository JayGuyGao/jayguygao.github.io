// CREATE A REFERENCE TO FIREBASE
var rootRef = new Firebase('https://incandescent-heat-5481.firebaseio.com/');
var room1Ref = rootRef.child("Room1");
var room2Ref = rootRef.child("Room2");
var messagesRef = [0, room1Ref.child("messageList"), room2Ref.child("messageList")];
var nameRef = [0, room1Ref.child("nameList"), room2Ref.child("nameList")];
var userRef = null;

//当前房间号
var currentRoom = 1;

//用户是否已经登陆成功
var loginSuc = false;

// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#example-messages');
var nameList = $("#userList");

//当前用户名
var username = "";
//当前用户列表
var usernames = [0, [],[]];

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
	if (!loginSuc){
		return;
	}
	if (e.keyCode == 13) {
		//FIELD VALUES
		//var username = nameField.val();
		var message = messageField.val();

		//SAVE DATA TO FIREBASE AND EMPTY FIELD
		messagesRef[currentRoom].push({name:username, text:message});
		messageField.val('');
	}
});

//窗口加载完毕时预处理
$(window).ready(function (){
	//将聊天室调整至居中
	$("#chatRoom").css({
		marginLeft : ($(window).width() - $("#chatRoom").width()) / 2,
		marginTop : ($(window).height() - $("#chatRoom").height()) / 2
	});
	
	//将登陆框调整至居中
	$("#loginBox").css({
		left : ($(window).width() - $("#loginBox").width()) / 2,
		top : ($(window).height() - $("#loginBox").height()) / 2
	});
	
	//绑定登陆按钮
	$("#loginButton").click(function(){
		//alert('click!');
		username = $("#nameInput").val();
		if (checkUsername()){
			userRef = nameRef[currentRoom].push(username);
			$("#background").hide();
			$("#loginBox").hide();
			console.log('publish!');
			loginSuc = true;
		}
		else {
			alert("用户名太短或已被占用，请重新输入！");
		}
	});
	//绑定消息列表
	messagesRef[1].limitToLast(10).on('child_added', function (snapshot) {
		if (currentRoom == 1) {
			insertMessage(snapshot);
		}
	});
	messagesRef[2].limitToLast(10).on('child_added', function (snapshot) {
		if (currentRoom == 2) {
			insertMessage(snapshot);
		}
	});
	//绑定用户列表
	nameRef[1].on("value", function (snapshot){
		updateUsernames(1, snapshot);
	});
	nameRef[2].on("value", function (snapshot){
		updateUsernames(2, snapshot);
	});
	
	//默认进入一号房间
	enterRoom(1);
});

//关闭窗口前删除用户
$(window).bind("beforeunload", function () {
	if (userRef != null){
		userRef.remove();
	}
});

//更新用户列表
function updateUsernames(room, snapshot){
	usernames[room] = [];
	if (room == currentRoom){
		nameList.empty();
	}
	var data = snapshot.val();
	for (var arg in data){
		usernames[room].push(data[arg]);
		if (room == currentRoom){
			var nameElement = $("<li></li>");
			nameElement.text(data[arg]);
			nameList.append(nameElement);
		}
	}
}

//添加消息
function insertMessage(snapshot){
	//GET DATA
	var data = snapshot.val();
	var username = data.name || "anonymous";
	var message = data.text;

	//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
	var messageElement = $("<li>");
	var nameElement = $("<strong class='username'></strong>");
	nameElement.text(username + ": ");
	messageElement.text(message).prepend(nameElement);

	//ADD MESSAGE
	messageList.append(messageElement);

	//SCROLL TO BOTTOM OF MESSAGE LIST
	messageList[0].scrollTop = messageList[0].scrollHeight;
}

//判断重名
function checkUsername(){
	if (username.length === 0){
		return false;
	}
	
	for (var i = 0; i < usernames[currentRoom].length; i ++){
		if (usernames[currentRoom][i] == username){
			return false;
		}
	}
	
	return true;
}

//进入新的房间
function enterRoom(roomNum){
	//在原来房间中删除用户
	if (userRef != null){
		userRef.remove();
		userRef = null;
	}
	
	loginSuc = false;
	
	//更新当前房间号
	currentRoom = roomNum;
	
	//清空消息列表和用户列表
	messageList.empty();
	nameList.empty();
	
	//显示登陆界面
	$("#background").show();
	$("#loginBox").show();
}
