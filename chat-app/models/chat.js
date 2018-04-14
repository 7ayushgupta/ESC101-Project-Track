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