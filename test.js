var PWS = require('./lib/wunderground-pws.js');
var chai = require('chai');
chai.should();

describe('Tests for Node.js Weather Underground PWS API library', function(){

  this.timeout(5000);

  it('should construct an object with valid properties', function(done) {
    var pws = new PWS();
    pws.should.be.an('object');
    pws.should.have.property('setObservations').that.is.a('function');
    pws.should.have.property('setRequestTimeout').that.is.a('function');
    pws.should.have.property('getRequestTimeout').that.is.a('function');
    pws.should.have.property('getObservations').that.is.a('function');
    pws.should.have.property('getFields').that.is.a('function');
    pws.should.have.property('sendObservations').that.is.a('function');
    pws.should.have.property('resetObservations').that.is.a('function');
    done();
  });

  it('should return an array with every possible observation', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    fields.should.be.an('array');
    done();
  });

  it('should return the default request timeout', function(done) {
    var pws = new PWS();
    pws.getRequestTimeout().should.be.a('number').and.equals(5000);
    done();
  });

  it('should let change the default request timeout', function(done) {
    var pws = new PWS();
    pws.setRequestTimeout(3000).should.be.a('number').and.equals(3000);
    pws.getRequestTimeout().should.be.a('number').and.equals(3000);
    done();
  });

  it('should not let invalid request timeouts', function(done) {
    var pws = new PWS();
    pws.setRequestTimeout().should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid timeout.');
    pws.setRequestTimeout({}).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid timeout.');
    pws.setRequestTimeout('TESTING_VALUE').should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid timeout.');
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

  it('should return an error when adding none observations', function(done) {
    var pws = new PWS();
    pws.setObservations().should.exist.and.be.instanceof(Error).and.have.property('message', 'No argument supplied to setObservations().');
    done();
  });

  it('should return an error when adding wrong type observations', function(done) {
    var pws = new PWS();
    pws.setObservations([]).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
    pws.setObservations(1).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
    pws.setObservations(true).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
    pws.setObservations(false).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
    pws.setObservations(0).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
    pws.setObservations((function(){return function(){}}())).should.exist.and.be.instanceof(Error).and.have.property('message', 'Invalid argument for setObservations().');
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

  it('should let the addition of valid observations from an object', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    var observations = {};
    fields.forEach(function(field){
      observations[field] = 'TESTING_VALUE';
    });
    pws.setObservations(observations).should.equal(true);
    observations.should.deep.equal(pws.getObservations());
    done();
  });

  it('should not let the addition of invalid observations from an object', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    var observations = {
      INVALID_FIELD: 'TESTING_VALUE'
    };
    pws.setObservations(observations).should.equal(true);
    pws.getObservations().should.be.an('object').and.not.have.property('INVALID_FIELD');
    done();
  });

  it('should let reset the observations', function(done) {
    var pws = new PWS();
    var fields = pws.getFields();
    fields.forEach(function(field){
      pws.setObservations(field, 'TESTING_VALUE');
    });
    Object.keys(pws.getObservations()).length.should.equal(fields.length);
    pws.resetObservations().should.equal(true);
    Object.keys(pws.getObservations()).length.should.equal(4);
    done();
  });

  it('should not let send observations without credentials', function(done){
    var pws = new PWS();
    pws.sendObservations(function(error, result){
      error.should.exist.and.be.instanceof(Error);
      done();
    });
  });
});
