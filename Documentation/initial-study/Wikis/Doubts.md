Doubts

1. Will it use authentication with the CC database, or have an independent login/user management system.
2. Websockets usually work when both the users are online, and will estalish connection between them and send messages but that if one user is offline? We need to have a way to send the message to him, even when his id is not present in the online_client list.
3. Unit test cases will be (as far as I can understand), testing the server script for incoming connections, database handling, client for interfacing with HTML, retreiving chat history, appending new messages, closing/opening connection, proper authentication, chatroom creation etc.