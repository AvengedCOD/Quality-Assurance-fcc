const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Convert valid input, GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert?input=10L')
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.approximately(res.body.initNum, 10, 0.0001);
            assert.equal(res.body.initUnit.toLowerCase(), 'l');
            assert.approximately(res.body.returnNum, 2.64172, 0.0001);
            assert.equal(res.body.returnUnit.toLowerCase(), 'gal');
            assert.match(res.body.string, /10 liters converts to 2\.6417\d* gallons/i);
            done();
        });
    });  
    
    test('Convert invalid unit input, GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert?input=foo')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'invalid unit'); 
          done();
        });
    });
  
    test('Convert invalid number, GET request to /api/convert', function(done) {
      chai.request(server)
        .get('/api/convert?input=3/2/3kg')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'invalid number'); 
          done();
        });
    });
  
    test('Convert invalid number and unit, GET request to /api/convert/', function(done) {
      chai.request(server)
        .get('/api/convert?input=3/2/3foo')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'invalid number and unit'); 
          done();
        });
    });
  
    test('Convert with no number, GET request to /api/convert/', function(done) {
      chai.request(server)
        .get('/api/convert?input=kg')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'initNum'); 
          assert.property(res.body, 'initUnit'); 
          assert.property(res.body, 'returnNum'); 
          assert.property(res.body, 'returnUnit'); 
          done();
        });
    });

});
