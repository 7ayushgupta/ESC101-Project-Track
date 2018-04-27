var should   = require("should");
var request  = require("supertest");
var server = require('../app.js');
var authenticatedUser = request.agent(server);
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');;
chai.use(chaiHttp);
var expect = chai.expect;

const userCredentials = {
    email: 'test@test.com',
    password: 'testing'
}   

before(function(done){
    authenticatedUser
    .post('/login')
    .send('userCredentials')
    .end(function(err, res){
        expect(res.statusCode).to.equal(200);
        expect('Location', '/rooms');
        done();
    });
});

describe('GET /rooms', function() {
    it('respond with the rooms page', function(done) {
      request(server)
      .get('/rooms')
      .expect(200)
      .end(function(err, res){
        if(err) throw err;
        console.log("Responded with status Code: " + res.statusCode);
        done();
      });
    });
  });