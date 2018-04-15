var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');

var should = require('should');
var request = require('supertest');
chai.use(chaiHttp);

describe('GET /homepage', function() {
  it('respond with homepage', function(done) {
    request(server)
    .get('/')
    .expect(200)
    .end(function(err, res){
      if(err) throw err;
      console.log("Responded with status Code: " + res.statusCode);
      done();
    });
  });
});

describe('GET /signup', function() {
  it('respond with signup page', function(done) {
    request(server)
    .get('/signup')
    .expect(200)
    .end(function(err, res){
      if(err) throw err;
      console.log("Responded with status Code: " + res.statusCode);
      done();
    });
  });
});

describe('GET /login', function() {
  it('respond with index page', function(done) {
    request(server)
    .get('/login')
    .expect(200)
    .end(function(err, res){
      if(err) throw err;
      console.log("Responded with status Code: " + res.statusCode);
      done();
    });
  });
});

describe('GET /rooms', function() {
  it('respond with the rooms page', function(done) {
    request(server)
    .get('/rooms')
    .expect(302)
    .end(function(err, res){
      if(err) throw err;
      console.log("Responded with status Code: " + res.statusCode);
      console.log("It found the page, but could not log in, which is good.")
      done();
    });
  });
});