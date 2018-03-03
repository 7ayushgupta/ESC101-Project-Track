var express = require('express');
var app = express();			//webdev framework for nodejs
var path = require('path');
var http = require('http').Server(app);
var socketio = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static("public"));

user_ids = [];

socketio.on('connection',function(socket){
	socket.on('new user',function(data, callback){
		console.log('A new user is trying to connect');

		if(user_ids.indexOf(data)!=-1){
			callback(false);
		}
		else{
			socket.user_id = data;
			user_ids.push(socket.user_id);
			callback(true);
			updateOnlineUsers();
		}
	});
	
	function updateOnlineUsers(){
		socketio.emit('usernames',user_ids);
	}

	socket.on('chat message',function(msg){
		console.log('message: ' + msg);
		socketio.emit('chat message',{text:msg, user_id:socket.user_id});
	});

	socket.on('disconnect',function(data){
		console.log('A user disconnected');
		if(!socket.user_id)
			return;
		user_ids.splice(user_ids.indexOf(socket.user_id),1);
		updateOnlineUsers();
	});
});	


http.listen(3000,function(){
	console.log('listening on *:3000');
})