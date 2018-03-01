var exp = require('express')();	//webdev framework for nodejs
var http = require('http').Server(exp);
var socketio = require('socket.io')(http);

exp.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

socketio.on('connection',function(socket){
	console.log('A User connected');

	socket.on('chat message',function(msg){
		console.log('message: ' + msg);
		socketio.emit('chat message',msg);
	});

	socket.on('disconnect',function(){
		console.log('A user disconnected');
	});
});	


http.listen(3000,function(){
	console.log('listening on *:3000');
})