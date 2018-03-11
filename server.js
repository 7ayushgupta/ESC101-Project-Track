var express = require('express');
var app = express();			//webdev framework for nodejs
var path = require('path');
var server = require('http').Server(app);
var socketio = require('socket.io')(server);
var mongoose = require('mongoose');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static("public"));

user_ids = [];

mongoose.connect('mongodb://localhost/db', function(err){
	if(err)
		console.log(err);
	else
		console.log('Connected to database');
});

var chatSchema = mongoose.Schema({
	username: String,
	msg: String
});
var Chat = mongoose.model('Messages', chatSchema); 


socketio.on('connection',function(socket){

	socket.on('new user',function(data, callback){
		console.log('A new user is trying to connect');

		if(user_ids.indexOf(data)!=-1){
			callback(false);
		}
		else{
			socket.user_id = data;
			socket.room_id = "default";
			socket.join(socket.room_id);
			user_ids.push(socket.user_id);
			callback(true);
			socketio.emit('update', {update_type: "newUser", user_id:socket.user_id, room:"default"});
			updateOnlineUsers();
			Chat.find({}, function(err, docs){
				if(err)
					throw err;
				console.log("Sending the older messages");
				socket.emit('load old messages', docs);
			});
		}
	});


	socket.on('join room', function(room_id){
		socket.join(room_id);
		socket.room_id = room_id;
		console.log(socket.user_id + ' has joined the room ' + room_id);
		socketio.sockets.in(room_id).emit('update',{update_type :'roomJoining', user_id:socket.user_id,room:room_id});
	});
	
	function updateOnlineUsers(){
		socketio.emit('usernames',user_ids);
	}

	socket.on('chat message',function(msg){
		console.log('message: ' + msg);
		socketio.sockets.in(socket.room_id).emit('chat message',{text:msg, user_id:socket.user_id});
		var newMsg = new Chat({msg: msg, username: socket.user_id});
		newMsg.save(function(err){
			if(err)
				throw err;
		});
	});

	socket.on('disconnect',function(data){
		console.log('A user disconnected');
		if(!socket.user_id)
			return;
		user_ids.splice(user_ids.indexOf(socket.user_id),1);
		updateOnlineUsers();
	});
});	


server.listen(3000,function(){
	console.log('listening on *:3000');
})