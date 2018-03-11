'use strict';

//Packages required by the chat app (dependencies)
var express 	= require('express');
var app 		= express();						//webdev framework for nodejs
var path 		= require('path');
var server 		= require('http').Server(app);		//starting http server
var socketio 	= require('socket.io')(server);		//creating a layer of websockets
var passport 	= require('passport'); 	
var strategy 	= require('passport-local').Strategy;													//importing models for Passport
var session 	= require('express-session');
var mongoose 	= require('mongodb').MongoClient;

mongoose.Promise= global.Promise;
var user = require('./app/models/user');


// mongoose.connect('mongodb://localhost/node-auth')
// 	.then(() =>  console.log('connection succesful'))
// 	.catch((err) => console.error(err));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');	//serving the initial file when connection is established
});

app.use(express.static("public"));				//serving the css and js files in public 

const PORT = 3000;	
var user_ids = [];							//keep the userids in store, to check for repeated id


//initialising passport and setting sessions
app.use(passport.initialize());
app.use(passport.session())
// passport.use(new strategy(user.authenticate()));
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

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
	});

	socket.on('disconnect',function(data){
		console.log('A user disconnected');
		if(!socket.user_id)
			return;
		user_ids.splice(user_ids.indexOf(socket.user_id),1);
		updateOnlineUsers();
	});
});	



server.listen(PORT,function(){					//starting the server
	console.log('listening on *:3000');
})