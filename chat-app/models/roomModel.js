'use strict';

/*
Each connection object represents a user connected through a unique socket.
So, this was done to ensure that each room identifies a login as a particular person, because
when he logs in at different times, he is assigned a new socketId.
 */

var Mongoose  = require('mongoose');

var RoomSchema = new Mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String }]}
});

var roomModel = Mongoose.model('room', RoomSchema);

module.exports = {
    roomModel,
    RoomSchema
}