var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');
var should = require('should');
var request = require('supertest');
var app = server.app;
chai.use(chaiHttp);

describe('GET /homepage', function() {
  it('respond with page', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});