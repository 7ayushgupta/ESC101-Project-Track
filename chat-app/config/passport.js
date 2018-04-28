var LocalStrategy = require('passport-local').Strategy;  
var User = require('../models/user').User;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {  
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
  
  
  /*
  This commented out code was for Facebook authentication. The main problem was 
  registering the domain, at Facebook. 

  passport.use(new FacebookStrategy({
    clientID: '353945155126095',
    clientSecret: '562e40a8e338433f083cdfe6686073ba',
    callbackURL: "https://chat-esc101.herokuapp.com/rooms"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({local: { email: profile.id }}, function (err, user) {
      return cb(err, user);
    });
  }
  ));
  */
  
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
};

