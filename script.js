var ws;
var socket_address = "ws://127.0.0.1:9877"

function init() 
{
  var servermsg = document.getElementById("servermsg");
  ws = new WebSocket(socket_address);
  ws.onopen = function(){
    servermsg.innerHTML = servermsg.innerHTML + "<br>Server connected";
  };
  ws.onmessage = function(e){
    servermsg.innerHTML = servermsg.innerHTML + "<br><< Recieved data: " + e.data;
  };
  ws.onclose = function(){
    servermsg.innerHTML = servermsg.innerHTML + "<br>Server disconnected";
  };
  
}
function postmsg()
{
  var text = document.getElementById("message").value;
  ws.send(text);
  servermsg.innerHTML = servermsg.innerHTML + "<br>>> Data sent: " + text;
}


//function connectionOpened(){}
//function connectionClosed(){}
//function messageRecieved() {}
//function messageSend() {}