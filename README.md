[![Build Status](https://travis-ci.org/atsid/middleware-throttle.svg)](https://travis-ci.org/atsid/middleware-throttle)
[![Code Climate](https://codeclimate.com/github/atsid/middleware-throttle/badges/gpa.svg)](https://codeclimate.com/github/atsid/middleware-throttle)
[![Test Coverage](https://codeclimate.com/github/atsid/middleware-throttle/badges/coverage.svg)](https://codeclimate.com/github/atsid/middleware-throttle/coverage)
[![Dependency Status](https://david-dm.org/atsid/middleware-throttle.svg)](https://david-dm.org/atsid/middleware-throttle)
[![devDependency Status](https://david-dm.org/atsid/middleware-throttle/dev-status.svg)](https://david-dm.org/atsid/middleware-throttle#info=devDependencies)

# ultra-throttle

NodeJS/MongoDB Rate-Limiting Middleware

## Usage
```js
const throttle = require('ultra-throttle')({mongoose});
const HITS_PER_WINDOW = 100;
app.get('/my-stuff', [throttle('getMyStuff', HITS_PER_WINDOW)], (req, res, next) => {...});
```

## Configuration Options
* **mongoose** - (*required*) - the Mongoose instance to attach the RateBucket models to
* **ttl** - (*optional, default: 5 minutes*) - The time-window for throttling across the application. Expressed in seconds.

Based on https://apicatus-laboratory.rhcloud.com/2014/04/13/rate-limit-your-nodejs-api-with-mongodb/
