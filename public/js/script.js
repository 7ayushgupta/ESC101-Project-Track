jQuery(function($){
var socket = io.connect();
var $formUsername = $('#formUsername');
var $error = $('#error');
var $inputUsername = $('#inputUsername');
var $onlineUsers = $('#onlineUsers');
var $formSendMessage = $('#formSendMessage');
var $inputMessage = $('#inputMessage');
var $chat = $('#chatMessages');
 
$formUsername.submit(function(e){
e.preventDefault();
socket.emit('new user', $inputUsername.val(), function(data){
if(data){
$('#login').hide();
$('#content').show();
} else{
$error.html('sorry, that username has been taken, try another one!');
}
});
$inputUsername.val('');
});
 
$formSendMessage.submit(function(e){
e.preventDefault();
socket.emit('chat message', $inputMessage.val());
$inputMessage.val('');
});
 
socket.on('usernames', function(data){
var html = '<h2>online users:</h2><hr />';
for(i=0; i < data.length; i++){
html += data[i] + '<br />';
}
$onlineUsers.html(html);
});
 
socket.on('chat message', function(data){
$chat.append("<li><b>" + data.user_id + " </b>" + data.text + "</li><br />");
});
})