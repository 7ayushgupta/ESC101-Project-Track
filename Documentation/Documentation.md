# Documentation

The various files will contain all the ideas being thought upon, and have a complete documentation of how the work took place.

#### Working of Server
1. The server will be responsible for managing the socket connections. It will constantly update whether any new user has joined the chat, and will add its name to the list of users currently online.

2. __Interaction with database__: This is an important aspect of the whole project. The database will needed for three different things:

Storing the login details of the users (need to study more, about this because this is quite dependent on whether we use the CC network authentication for our project).

Storing the details of chat-lists/rooms. At the beginning there is a need for a the chatlists being generated automatically using the datase present on the IITK network, and as people use it, there needs to e a provision for writing more lists and storing them.

### Working of Client
1. The client will need to make connections with the server, and will require a python script for it (if using Websockets ), or it will e integrated with a JS Client.

2. The database interaction will be centralised mostly, but we need to store chat histories and this can e done y keeping files on the client side, and retrieving them as the user demands them.

### Front-end

Usage of JavaScript for connecting with the webserver is the main basic idea yet, and HTML/CSS will provide for the UI.

