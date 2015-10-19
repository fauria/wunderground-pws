var http = require('http');

(function () {
  'use strict';

  // See: http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol
  var server = {
    host: 'weatherstation.wunderground.com',
    port: 80,
    path: '/weatherstation/updateweatherstation.php',
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
    // Initialize required GET parameters:
    var payload = {
      action: 'updateraw',
      ID: ID || '',
      PASSWORD: PASSWORD || '',
      dateutc: 'now'
    };

    // Setter for GET parameters:
    this.setObservations = function() {
      if ( arguments[0] ) {
        switch( typeof arguments[0] ) {
          case 'object':
            var observations = arguments[0];
            Object.keys(observations).forEach( function (observation) {
                if ( fields.indexOf(observation) > -1 ) {
                  payload[observation] = String(observations[observation]).toString();
                }
            });
            return true;

          case 'string':
            var observation = arguments[0];
            var reading = arguments[1] || '';
            if ( fields.indexOf(observation) > -1 ) {
              payload[observation] = reading;
              return true;
            } else {
              return new Error('Observation '+observation+' not supported by WU.');
            }
            break;

          default:
            return new Error('Invalid argument for setData().');
        }
      } else {
        return new Error('No argument supplied to setData().');
      }
    };

    // Getter for GET parameters:
    this.getObservations = function() {
      return payload;
    };

    // Getter for possible observations:
    this.getFields = function() {
      return fields;
    };

    // Perform actual GET request:
    this.sendObservations = function(callback) {
      var queryString = [];

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
            callback(null, result);
          } else {
            callback(new Error(result));
          }
        });
      });

      request.on('socket', function (socket) {
          socket.setTimeout(timeout);
          socket.on('timeout', function() {
              request.abort();
          });
      }).on('error', function(error) {
          callback(error);
      });

      request.end();
    };

  }
  module.exports = PWS;
}());
