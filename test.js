var PWS = require('./lib/wunderground-pws.js');
var chai = require('chai');
chai.should();

describe('Tests for Node.js Weather Underground PWS API library', function(){
  it('should construct an object with valid properties', function(done) {
    var pws = new PWS();
    pws.should.be.an('object');
    pws.should.have.property('setObservations').that.is.a('function');
    pws.should.have.property('getObservations').that.is.a('function');
    pws.should.have.property('getFields').that.is.a('function');
    pws.should.have.property('sendObservations').that.is.a('function');
    done();
  });
  it('should return an array with every possible observation', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    fields.should.be.an('array');
    done();
  });
  it('should return an object with default mandatory data', function(done) {
    var pws = new PWS('TESTING_STATION', 'TESTING_PASSWORD');
    var observations = pws.getObservations();
    observations.should.be.an('object');
    observations.should.have.property('action').that.is.a('string').and.equals('updateraw');
    observations.should.have.property('ID').that.is.a('string').and.equals('TESTING_STATION');
    observations.should.have.property('PASSWORD').that.is.a('string').and.equals('TESTING_PASSWORD');
    observations.should.have.property('dateutc').that.is.a('string').and.equals('now');
    done();
  });
  it('should let the addition of a valid observation', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    fields.forEach(function(field){
      pws.setObservations(field, 'TESTING_VALUE').should.equal(true);
    });
    done();
  });
  it('should not let the addition of an invalid observation', function(done) {
    var pws = new PWS();
    pws.setObservations('INVALID_FIELD', 'TESTING_VALUE').should.exist.and.be.instanceof(Error).and.have.property('message', 'Observation INVALID_FIELD not supported by WU.');
    done();
  });

  // Pending tests
  it('should let the addition of valid observations from an object');
  it('should not let the addition of invalid observations from an object');
  it('should not let send observations without credentials', function(done){
    var pws = new PWS();
    pws.sendObservations(function(error, result){
      error.should.exist.and.be.instanceof(Error);
      done();
    });
  });

});
