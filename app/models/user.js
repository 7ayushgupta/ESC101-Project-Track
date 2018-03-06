'use strict';

var Mongoose = require('mongoose');  	//importing database
var bcrypt = require('bcrypt');

const SALT_RANDOM_FACTOR = 10;

/*
1. Every user will have a username, password, and roll number associated with it.
2. And username is a required field.
*/
var user_scheme = new Mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, default: null},
	rollno: {type:String, default:null}
});


/* 
Before storing the data in database, we need to hash the password, bcrypt is the library used for this
*/

//return what next to do
user_scheme,pre('save', function(next){

	//only modify hash of password if changed
	if(!user.isModified('password')
		return next();

	/*generating a salt
	this is one of the most interesting part of the project, we can 
	have two different plaintext passwords but it becomes impossible for
	someone to find the hash and just decrypt it
	*/
	bcrypt.genSalt(SALT_RANDOM_FACTOR, function(error, salt){
		if (err) 
			return next(err);

		bcrypt.hash(user.password, salt, null, function(error, hash){
			if (err) 
				return next(error);

			user.password = hash;
			next();	

		});
	});
});

//this method will be called by other files to validate the password,
//this is a method under the user schema we have created

user_scheme.methods.verifyPassword = function(password, callback){
	bcrypt.compare(password, this.password, function(error, isCorrect){
		if(error)
			return callback(error);
		callback(null, isCorrect);
	});
};


//finally create the model, combining everything
var userModel = Mongoose.model('user', user_scheme);
module.exports = userModel;
