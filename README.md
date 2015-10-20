# wunderground-pws ![Build Status](https://travis-ci.org/fauria/wunderground-pws.svg?branch=master) [![codecov.io](https://codecov.io/github/fauria/wunderground-pws/coverage.svg?branch=master)](https://codecov.io/github/fauria/wunderground-pws?branch=master)

[![NPM](https://nodei.co/npm/wunderground-pws.png)](https://nodei.co/npm/wunderground-pws/)

`wunderground-pws` is a Node.js library that implements [Weather Underground Personal Weather Station Protocol](http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol), providing a native Javascript interface to upload weather conditions using a `GET` request.

# Usage
First, install the library:

`npm install --save wunderground-pws`

Then, require it:

```javascript
var PWS = require('wunderground-pws');
var pws = new PWS('MY_STATION_ID', 'MY_PASSWORD');
```

The constructor object accepts two parameters, that corresponds to the [registered PWS ID](http://www.wunderground.com/personal-weather-station/signup) and the password of the user that did so.

This are refered to as `ID` and `PASSWORD` respectively in the list of fields used as GET parameters. 

Those two, along with `action` and `dateutc` are required fields. The former are automatically initialized as `updateraw` and `now` respectively.

# Example
Once initialized, data can be easily published:

```javascript
pws.setObservations({
	winddir: 180,
	windspeedmph: 10
});

pws.sendObservations(function(err, success){
	// executed after callback
});
```

# API Reference
The library includes the following methods:

`pws.getFields()`

Returns an array with every possible parameter used for observations. For a complete reference, check the [official API documentation](http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol).

---

`pws.setObservations(observation, value)`

Sets a single observation value, or returns an `Error` object if not supported.

---

`pws.setObservations({observation1: value1, observation2: value2, ...})`

Sets as many observations as present in the object passed as an argument, as long as they are valid.

---

`pws.getObservations()`

Returns an object with the current observations.

---

`pws.setRequestTimeout(milliseconds)`

Sets the timeout before a request is considered invalid. Accepts the number of  `milliseconds` as an argument. If not specified, the default value will be `5000`.

It will try cast whatever is passed as an argument to `Number()`, returning an `Error` object when `NaN`.

---

`pws.getRequestTimeout()`

Returns the number of milliseconds set by `setRequestTimeout`, or `5000` by default.

---

`pws.sendObservations(callback)`

Sends the current observations to Weather Underground and executes the `callback` function in an asynchronous way.

It accepts two standard parameters, the first one being an `Error` object if the operation failed and the second `null`. 

If successful, returns `null` as the first parameter and the string `'success'` as the second.

After a successful request, the observations are set as default:

```javascript
{
	ID: 'MY_STATION_ID',
	PASSWORD: 'MY_PASSWORD',
	action: 'updateraw',
	dateutc: 'now'
}
```