var http = require('http');

(function () {
  'use strict';

  // See: http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol
  var wundergroundPath = '/weatherstation/updateweatherstation.php';
  var server = {
    host: 'weatherstation.wunderground.com',
    port: 80,
    path: wundergroundPath,
    method: 'GET'
  };

  var fields = [
    'action',
    'ID',
    'PASSWORD',
    'dateutc',
    'winddir',
    'windspeedmph',
    'windgustmph',
    'windgustdir',
    'windspdmph_avg2m',
    'winddir_avg2m',
    'windgustmph_10m',
    'windgustdir_10m',
    'humidity',
    'dewptf',
    'tempf',
    'rainin',
    'dailyrainin',
    'baromin',
    'weather',
    'clouds',
    'soiltempf',
    'soilmoisture',
    'leafwetness',
    'solarradiation',
    'visibility',
    'indoortempf',
    'indoorhumidity',
    'AqNO',
    'AqNO2T',
    'AqNO2',
    'AqNO2Y',
    'AqNOX',
    'AqNOY',
    'AqNO3',
    'AqSO4',
    'AqSO2',
    'AqSO2T',
    'AqCO',
    'AqCOT',
    'AqEC',
    'AqOC',
    'AqBC',
    'AqUV',
    'AqPM2.5',
    'AqPM10',
    'AqOZONE',
    'softwaretype'
  ];

  var timeout = 5000;

  function PWS(ID, PASSWORD){

    // Do not crash when instantiating without 'new':
    if ( !(this instanceof PWS) ) return new PWS(ID, PASSWORD);

    // Initialize required GET parameters:
    var payload = {
      action: 'updateraw',
      ID: ID || '',
      PASSWORD: PASSWORD || '',
      dateutc: 'now'
    };

    // Setter for GET parameters:
    this.setObservations = function() {
      if ( arguments.length > 0 ) {
        switch( typeof arguments[0] ) {
          case 'object':
            var observations = arguments[0];
            if ( Object.prototype.toString.call(observations) === '[object Object]' ) {
              Object.keys(observations).forEach( function (observation) {
                  if ( fields.indexOf(observation) > -1 ) {
                    payload[observation] = String(observations[observation]).toString();
                  }
              });
              return true;
            }else{
              return new Error('Invalid argument for setObservations().');
            }
            // Pass jshint's Expected a 'break' statement before 'case'.
            break;

          case 'string':
            var observation = arguments[0];
            var reading = arguments[1] || '';
            if ( fields.indexOf(observation) > -1 ) {
              payload[observation] = reading;
              return true;
            } else {
              return new Error('Observation '+observation+' not supported by WU.');
            }
            // Pass jshint's Expected a 'break' statement before 'case'.
            break;

          default:
            // Avoid use of arguments.callee while in strict mode:
            return new Error('Invalid argument for setObservations().');
        }
      } else {
        // Avoid use of arguments.callee while in strict mode:
        return new Error('No argument supplied to setObservations().');
      }
    };

    // Getter for GET parameters:
    this.getObservations = function() {
      return payload;
    };

    // Reset payload to default values:
    this.resetObservations = function() {
      payload = {
        action: 'updateraw',
        ID: payload.ID,
        PASSWORD: payload.PASSWORD,
        dateutc: 'now'
      };
      server.path = wundergroundPath;
      return true;
    };

    // Getter for possible observations:
    this.getFields = function() {
      return fields;
    };

    // Setter for request timeout:
    this.setRequestTimeout = function(miliseconds) {
      if( ! isNaN(Number(miliseconds)) ) {
        timeout = miliseconds;
        return timeout;
      }else{
        return new Error('Invalid timeout.');
      }
    };

    // Getter for request timeout:
    this.getRequestTimeout = function() {
      return timeout;
    };

    // Perform actual GET request:
    this.sendObservations = function(callback) {

      // Allways have a callback() function:
      if ( typeof callback !== 'function' ) callback = function(){};

      var queryString = [];
      var that = this;

      Object.keys(payload).forEach(function(observation){
        queryString.push(observation + '=' + encodeURIComponent(payload[observation]));
      });

      // Build the GET query string:
      server.path += '?' + queryString.join('&');

      var request = http.request(server, function(response) {
        var message = '';

        response.on('data', function (chunk) {
          message += chunk;
        });

        response.on('end', function () {
          var result = message.trim();
          if ( result  === 'success' ) {
            that.resetObservations();
            callback(null, result);
          } else {
            callback(new Error(result), null);
          }
        });
      });

      request.on('socket', function (socket) {
          socket.setTimeout(timeout);
          socket.on('timeout', function() {
              request.abort();
          });
      }).on('error', function(error) {
          callback(error, null);
      });

      request.end();
    };

  }
  module.exports = PWS;
}());
