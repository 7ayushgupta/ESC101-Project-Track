var express = require('express');  
var path = require('path');  
var logger = require('morgan');  
var cookieParser = require('cookie-parser');  
var bodyParser = require('body-parser');

var routes = require('./routes/index');  
var users = require('./routes/users');

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
app.use('/users', users);

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
  console(req); 
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


var server = require('http').Server(app);
var io = require('socket.io')(server);

io.use(passportSocketiO.authorize({
    cookieParser: cookieParser,
    secret: 'foxtrot',
    key: 'lol',
    store: sessionStore
}));

io.on('connection', function(socket){
    console.log("New connection found. Socket_Id: " + socket.id);
    var emailId = socket.request.user.local.email;
    console.log("Email Id:" + emailId);
    var userId = emailId.match(/^([^@]*)@/)[1];
    console.log("UserID: " + userId);

    var requireAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("haan");
        return next();
    }

    // send the error as JSON to be nice to clients
    res.send(401, {
        error: "Unauthorized"
    });
    };

    app.get('/data', function(data){
        console.log(data);
    });

    socket.on('chat message', function(message){
        console.log(message);
        io.emit('chat message', {text: message, user_id:userId});
    });



});

server.listen(port);

module.exports = app;  

