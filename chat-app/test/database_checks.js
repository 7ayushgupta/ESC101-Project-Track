var should = require("should");
var mongoose = require('mongoose');
var User = require("../models/user.js").User;
var Room = require("../models/roomModel.js").roomModel;
var configDB = require('../config/database.js');
var db;

describe('Opening up database and', function() {

before(function(done) {
    mongoose.connect(configDB.url);
    db = mongoose.connection;
    done();
 });

it('finding all the users', function(done) {
    User.find({}, function(err, users) {
      console.log("Total number of user accounts:" + users.length);
      for(var i  = 0; i<users.length; i++){
        console.log(users[i])
        console.log(users[i].local.email);}
      done();
    });
 });

it('finding all the rooms', function(done) {
    Room.find({}, function(err, rooms) {
      console.log("Total number of rooms:" + rooms.length);
      for(var i  = 0; i<rooms.length; i++){
        console.log(rooms[i].title);
      }
      done();
    });
});

after(function(done) {
  mongoose.connection.close();
  done();
});

});