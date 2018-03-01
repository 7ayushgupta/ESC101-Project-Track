jQuery(function($){
var socket = io.connect();
var $nickForm = $('#setNick');
var $nickError = $('#error');
var $nickBox = $('#nickname');
var $users = $('#users');
var $messageForm = $('#send-message');
var $messageBox = $('#message');
var $chat = $('#cht');
 
$nickForm.submit(function(e){
e.preventDefault();
socket.emit('new user', $nickBox.val(), function(data){
if(data){
$('#nickWrap').hide();
$('#contentWrap').show();
} else{
$nickError.html('sorry, that username has been taken, try another one!');
}
});
$nickBox.val('');
});
 
$messageForm.submit(function(e){
e.preventDefault();
socket.emit('chat message', $messageBox.val());
$messageBox.val('');
});
 
socket.on('usernames', function(data){
var html = '<h2>online users:</h2><hr />';
for(i=0; i < data.length; i++){
html += data[i] + '<br />';
}
$users.html(html);
});
 
socket.on('chat message', function(data){
$chat.append("<li><b>" + data.user_id + " </b>" + data.text + "</li><br />");
});
})