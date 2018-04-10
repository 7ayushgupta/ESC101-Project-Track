var supertest = require("supertest");
var should = require("should")

//This agent is needed for referring to the PORT where the program is running
var server = supertest.agent("http://localhost:4000");

//Unit test begins, describe is used to actually describe
describe("Sample unit test", function(){
    
    it("should return homepage", function(done){
        server
        .get("/")
        .expect("Content-Type",'text/html; charset=utf-8')
        .end(function(err, res){
            if(err)
                return done(err)
            done();
        })
    })
});