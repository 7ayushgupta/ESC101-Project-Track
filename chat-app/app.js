var express = require('express');  
var path = require('path');  
var logger = require('morgan');  
var cookieParser = require('cookie-parser');  
var bodyParser = require('body-parser');

var routes = require('./routes/index');  

var port = process.env.PORT || 4000;

var passport = require('passport');  
var LocalStrategy = require('passport-local').Strategy;  
var mongoose = require('mongoose');  
var flash = require('connect-flash');  
var session = require('express-session');
var passportSocketiO = require('passport.socketio');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
var Room = require('./models/room');
var Chat = require('./models/chat').message;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');

app.use(logger('dev'));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    store: sessionStore,
    secret: 'foxtrot',
    key: 'lol'
}));

app.use(passport.initialize());  
app.use(passport.session());  
app.use(flash());

app.use('/', routes); 
require('./config/passport')(passport);

app.use(function(req, res, next) {  
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {  
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}
app.use(function(err, req, res, next) { 
  console.log(req); 
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


var server = require('http').Server(app);
var io = require('socket.io').listen(server);

io.use(passportSocketiO.authorize({
    cookieParser: cookieParser,
    secret: 'foxtrot',
    key: 'lol',
    store: sessionStore
}));



io.of('/rooms').on('connection', function(socket) {

  // Create a new room
  socket.on('createRoom', function(title) {
    Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
      if(err) throw err;
      if(room){
        socket.emit('updateRoomsList', { error: 'Room title already exists.' });
      } else {
        Room.create({ 
          title: title
        }, function(err, newRoom){
          if(err) throw err;
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

  // Join a chatroom
  socket.on('join', function(roomId) {

    Room.findById(roomId, function(err, room){
      if(err) throw err;
      if(!room){
        // Assuming that you already checked in router that chatroom exists
        // Then, if a room doesn't exist here, return an error to inform the client-side.
        socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
      } else {
        // Check if user exists in the session
        if(socket.request.user == null){
          return;
        }

        Room.addUser(room, socket, function(err, newRoom){

          // Join the room channel
          socket.join(newRoom.id);

          Room.getUsers(newRoom, socket, function(err, users, cuntUserInRoom){
            if(err) throw err;
            Chat.find({}, function(err, docs){
              if(err)
                throw err;
              console.log(docs);
              console.log("Sending the older messages");
              socket.emit('load old messages', docs);
            });
            // Return list of all user connected to the room to the current user
            socket.emit('updateUsersList', users, true);

            
            

            // Return the current user to other connecting sockets in the room 
            // ONLY if the user wasn't connected already to the current room
            if(cuntUserInRoom === 1){
              console.log(users); 
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
    Room.removeUser(socket, function(err, room, cuntUserInRoom){
      if(err) throw err;

      // Leave the room channel
      socket.leave(room.id);

      // Return the user id ONLY if the user was connected to the current room using one socket
      // The user id will be then used to remove the user from users list on chatroom page
      if(cuntUserInRoom === 1){
        socket.broadcast.to(room.id).emit('removeUser', userId);
      }
    });
  });

  // When a new message arrives
  socket.on('newMessage', function(roomId, message) {
    console.log(message);
    var newMsg = new Chat({
      message_body: message.content, 
      user: message.username,
      room: roomId,
      created_at: message.date
    });
	 newMsg.save(function(err){
			if(err)throw err;
		  });
    // No need to emit 'addMessage' to the current socket
    // As the new message will be added manually in 'main.js' file
    // socket.emit('addMessage', message);
    
    socket.broadcast.to(roomId).emit('addMessage', message);
  });

});
server.listen(port);

module.exports = server;