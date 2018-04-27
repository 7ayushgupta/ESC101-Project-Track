var expect = require('chai').expect;  
var io     = require('socket.io-client');

var app = require('../app');

var socketUrl = 'http://localhost:4000';

var options = {  
  transports: ['websocket'],
  'force new connection': true
};

var room = 'lobby';

describe('Sockets', function () {  
  var client1, client2, client3;

  // testing goodness goes here
});
