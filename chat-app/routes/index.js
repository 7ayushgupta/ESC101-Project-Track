var express = require('express');  
var passport = require('passport');  
var router = express.Router();
var Room = require('../models/room').roomModel;

router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {  
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {  
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) { 
  res.render('profile.ejs', { user: req.user });
});

router.get('/chat/:id', [isLoggedIn, function(req, res, next) {
  var roomId = req.params.id;
  Room.findById(roomId, function(err, room){
    if(err) throw err;
    if(!room){
      return next(); 
    }
    res.render('chatroom', { user: req.user.local, room: room });
  });
  
}]);


router.get('/rooms', isLoggedIn, function(req, res) { 
    Room.find(function(error, rooms){
      if(error) 
        throw error;
      res.render('rooms', {rooms});    
    });
  });

router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {  
  successRedirect: '/chatroom',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {  
  successRedirect: '/rooms',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
