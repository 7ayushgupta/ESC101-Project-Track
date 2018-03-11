'use strict'

var express 	= require('express');
var router 		= express.Router();
var passport 	= require('passport');

var user 		= require('../models/user'); //exporting the user schemes
var room 		= require('../models/room');


//serve index.js in the beginning, and then look for authentication
router.get('/', function(request, response, next)){
	if(request.isAuthenticated(){
		response.redirect('/rooms');
	}
	else{
		res.render('login',{
			success: request.flash('ok');
		});
	}
});

router.post('/login', passport.authenticate('local',{
	successRedirect: '/rooms',
	failureRedirect: '/',
	failureFlash: true
}));

s
router.get('/logout', function(request, response, next){
	request.logout();
	request.session = null;
	response.redirect('/');
});

module.exports = router;