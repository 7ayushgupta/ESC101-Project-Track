jQuery(function($){

	var $formUsername = $('#formUsername');
	var $error = $('#error');
	var $inputUsername = $('#inputUsername');
	var $onlineUsers = $('#onlineUsers');
	var $formSendMessage = $('#formSendMessage');
	var $inputMessage = $('#inputMessage');
	var $chat = $('#chatMessages');
 	var $formRoom = $('#formRoom');
 	var $inputRoom = $('#inputRoom');
 	var $status = $('#statusArea');

 	var socket = io.connect();

	$formUsername.submit(function(e){
		e.preventDefault();
		var usernametry = $inputUsername.val();
		socket.emit('new user', usernametry, function(data){
			if(data){
				$status.append("<p> Logged in as:" + usernametry + "</p>");
				$('#login').hide();
				$('#content').show();
			}
			else {
				$error.html('sorry, that username has been taken, try another one!');
			}
		});
		$inputUsername.val('');
	});

	$formRoom.submit(function(e){
		e.preventDefault();
		socket.emit('join room', $inputRoom.val());
		$inputRoom.val('');
	});
 
	$formSendMessage.submit(function(e){
		e.preventDefault();
		socket.emit('chat message', $inputMessage.val());
		$inputMessage.val('');
	});
 
	socket.on('usernames', function(data){
		var html = '<h3>Online Users:</h3><hr/>';
		for(i=0; i < data.length; i++){
			html += data[i] + '<br />';
		}
		$onlineUsers.html(html);
	});
 
	socket.on('chat message', function(data){
		$chat.append("<li><b>" + data.user_id + " </b>" + data.text + "</li><br/>");
	});
	socket.on('load old messages', function(docs){
		for(var i = 0; i<docs.length; i++) 
			$chat.append("<li><b>" + docs[i].username + " </b>" + docs[i].msg + "</li>");
	});

	//a broad notification function which I intend to use more
	socket.on('update', function(data){
		if(data.update_type === "roomJoining" && data.room!="default"){
			console.log(data.user_id + ' has joined the room ' + data.room);
			$chat.append(data.user_id + ' has joined the room ' + data.room + "<br>");
		}
		if(data.update_type === "newUser"){
			console.log(data.user_id + ' is online');
			$chat.append("<li>" + data.user_id + ' is now online </li><br>');
		}
	}); 
})