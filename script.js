  //function called for opening the websocket connection
  function tryConnect()
  {
    websocket = new WebSocket("ws://localhost:8000/");
    websocket.onopen = function(evt) { connectionOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  //when connection is open
  function connectionOpen(evt)
  {
    displayMessage("Connected To Server\n");
    document.getElementById('startButton').disabled=true;
  }

  //when connection is
  function onClose(evt)
  {
    displayMessage("Disconnected from Server\n");
    document.getElementById("startButton").disabled=false;
  }

  function onMessage(evt)
  {
    displayMessage("response: " + evt.data + '\n');
  }
  function onError(evt)
  {
    displayMessage('error: ' + evt.data + '\n');
	websocket.close();
	document.myform.connectButton.disabled = false;
	document.myform.disconnectButton.disabled = true;
  }
  function doSend(message)
  {
    content.prepend('<p>Ayush</p>');
    websocket.send(message);
  }


  function displayMessage(message)
  {
    document.myform.outputtext.value += message
	 document.myform.outputtext.scrollTop = document.myform.outputtext.scrollHeight;
  }
  window.addEventListener("load", init, false);
   function sendText() {
		doSend( document.myform.inputtext.value );
   }

  //basic function to clear the screen display 
  function clearDisplay() {
		document.myform.outputtext.value = "";
   }

   //function to disconnect the client, by closing the websocket connection
   function tryDisconnect(){
    websocket.close();           
   }
