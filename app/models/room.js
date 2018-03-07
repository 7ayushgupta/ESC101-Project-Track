'use strict';

var Mongoose = require('mongoose');

var room_scheme = new Mongoose.Schema({
	title :{type:String, required: true},
 	connections: { type: 
 						[{ userId: String,
 						   socketId: String }]}
 });

var room_model = Mongoose.model('room', RoomSchema);

module.exports = room_model;