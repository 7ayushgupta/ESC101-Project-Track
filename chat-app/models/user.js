/*
This collection handles the various users that have registered.
This stores their email, password, and a profile picture.

Wished to add feature to choose own profile picture, if time allowed.
*/


var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');

const DEFAULT_USER_PICTURE = "/images/user.jpg";

var userSchema = mongoose.Schema({  
  local: {
    email: String,
    password: String,
    picture: {type: String, default:DEFAULT_USER_PICTURE}
  },
});


userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};
var User = mongoose.model('User', userSchema);

var findById = function (id, callback){
	User.findById(id, callback);
};


module.exports = {
  User,
  userSchema,
  findById
}
