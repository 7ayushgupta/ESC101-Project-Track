/*
A basic MongoDB Schema created for handling the chat messages
This collection will handle the storage of the chats
*/
var mongoose = require('mongoose');
var room = require('./roomModel').RoomSchema;
var user = require('./user').userSchema;

var message = new mongoose.Schema({
    room: String,
    user: String,
    message_body: String,
    created_at: { type: Date, default: Date.now },
});

var message = mongoose.model('message', message);

module.exports = {
    message
};