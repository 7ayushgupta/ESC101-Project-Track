/*
This is the main page required for using different routes
The basic need of routing is that, when we click on hyperlinks,
we need to be assured that the links work in the way we want them too.

So, if someone unauthenticated tries to open a chat room, he/she needs
to be diverted to the Login Page.

I am using an EJS engine for rendering pages, where I can pass data to make 
the page more personal
*/

var express = require('express');  
var passport = require('passport');  
var router = express.Router();
var Room = require('../models/room').roomModel;

router.get('/', function(req, res, next) {  
  res.render('index');
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

//isLoggedin is the function which will tell us, whether he is logged in or not
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
  successRedirect: '/rooms',
  failureRedirect: '/signup',
  failureFlash: true,
}));

/*
This is the code for callbacks and redirecting needed for Facebook authentication
router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/rooms');
});
*/
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

