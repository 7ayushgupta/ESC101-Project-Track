//Importing the various libraries and requirements needed
var express = require('express');  
var path = require('path');  
var logger = require('morgan');  
var cookieParser = require('cookie-parser');  
var bodyParser = require('body-parser');
var routes = require('./routes/index');  

//the port at which the process is running
var port = process.env.PORT || 4000;  

var passport = require('passport');  
var LocalStrategy = require('passport-local').Strategy;  
var mongoose = require('mongoose');  
var flash = require('connect-flash');  
var session = require('express-session');
var passportSocketiO = require('passport.socketio');

//configuring Database for Session key settings
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//importing the various database schemas (MongoDB)
var Room = require('./models/room');
var Chat = require('./models/chat').message;

//initialising an express server
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');

//middleware for easy cookie parsing
app.use(logger('dev'));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));

//configuration for app to use the Session storage
app.use(session({ 
    store: sessionStore,
    secret: 'foxtrot',
    key: 'lol'
}));

//use of Passport for authentication
app.use(passport.initialize());  
app.use(passport.session());  
app.use(flash());

//routing using the index.js file in routes folder
app.use('/', routes); 
require('./config/passport')(passport);

//some basic error handling which was already available in the boilerplate code
app.use(function(req, res, next) {  
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});

if (app.get('env') === 'development') {  
  app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.render('error', {
      message: error.message,
      error: error,
    });
  });
}
app.use(function(error, req, res, next) { 
  console.log(req); 
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: {},
  });
});

//initiailising a Socket.IO object now
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//making sure the Socket.IO objects also have access to the Session storage stuff
//acknowledgements to Yash Srivastav for helping me out here
io.use(passportSocketiO.authorize({
    cookieParser: cookieParser,
    secret: 'foxtrot',
    key: 'lol',
    store: sessionStore
}));

//two different namespaces, for two different situtations
io.of('/rooms').on('connection', function(socket) {
  // Create a new room
  socket.on('createRoom', function(title) {
    Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(error, room){
      if(error) 
        throw error;
      if(room){
        socket.emit('updateRoomsList', { error: 'Room title already exists.' });
      } else {
        Room.create({ 
          title: title
        }, function(error, newRoom){
          if(error) throw error;
          socket.emit('updateRoomsList', newRoom);
          socket.broadcast.emit('updateRoomsList', newRoom);
        });
      }
    });
  });
});

// Chatroom namespace
io.of('/chatroom').on('connection', function(socket) {

  var userId = socket.request.user._id;
  var rooms_list = [];
  var allusers = [];

  Room.find(function(error, rooms){
    if(error) 
      throw error;
    rooms_list = rooms;
  });

  // Join a chatroom
  socket.on('join', function(roomId) {

    Room.findById(roomId, function(error, room){
      
      if(error) 
        throw error;
      
      if(!room){
        // Assuming that you already checked in router that chatroom exists
        // Then, if a room doesn't exist here, return an error to inform the client-side.
        socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
      }
      else {
        // Check if user exists in the session
        if(socket.request.user == null){
          return;
      }

      Room.addUser(room, socket, function(error, newRoom){

        // Join the room channel
        socket.join(newRoom.id);

        Room.getUsers(newRoom, socket, function(error, users, currentUserInRoom){
          if(error)
            throw error;
          Chat.find({}, function(error, docs){
            if(error)
              throw error;
            //console.log("Sending the older messages" + docs);
            socket.emit('load old messages', docs);
            });
            // Return list of all user connected to the room to the current user
            socket.emit('updateUsersList', users, true);

            /*
            Commented out code is for finding out currently active online users in all the rooms

            console.log(newRoom);
            console.log(rooms_list);

            for(var i = 0; i<rooms_list.length; i++)
            {
              console.log("starting again" + rooms_list[i].title);
              if(rooms_list[i].connections.length>0){
              Room.getUsers(rooms_list[i], socket, function(error, users, currentUserInRoom){
                socket.emit('updateAllUsers', users);
              });
              }
            }
           */
            
            // Return the current user to other connecting sockets in the room 
            // ONLY if the user wasn't connected already to the current room
            if(currentUserInRoom === 1){
              socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
            }
          });
        });
      }
    });
  });

  // When a socket exits
  socket.on('disconnect', function() {

    // Check if user exists in the session
    if(socket.request.user == null){
      return;
    }

    // Find the room to which the socket is connected to, 
    // and remove the current user + socket from this room
    Room.removeUser(socket, function(error, room, currentUserInRoom){
      if(error) throw error;

      // Leave the room channel
      socket.leave(room.id);

      // Return the user id ONLY if the user was connected to the current room using one socket
      // The user id will be then used to remove the user from users list on chatroom page
      if(currentUserInRoom === 1){
        socket.broadcast.to(room.id).emit('removeUser', userId);
      }
    });
  });

  // When a new message arrives
  socket.on('newMessage', function(roomId, message){
    
    //console.log(message);
    var newMsg = new Chat({
      message_body: message.content, 
      user: message.username,
      room: roomId,
      created_at: message.date
    });
    
    //save the messages to our database
    newMsg.save(function(error){
      if(error)
        throw error;
		});
    
    // No need to emit 'addMessage' to the current socket
    // As the new message will be added manually in 'main.js' file
    // socket.emit('addMessage', message);
    socket.broadcast.to(roomId).emit('addMessage', message);

  });
});

server.listen(port);
module.exports = server;