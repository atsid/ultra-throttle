/**
 * Adapted from https://apicatus-laboratory.rhcloud.com/2014/04/13/rate-limit-your-nodejs-api-with-mongodb/
 */

const JPromise = Promise || require('bluebird');
const debug = require('debug')('middleware-throttle');
const model = require('./model');

/**
 * Initializes the rate throttling middleware
 * @param config - The configuration object.
 *     {
 *         ttl: <Number - the number of milliseconds a limiting window lasts.
 *         mongoose: The mongoose instance used by the application
 *     }
 */
function initialize(config) {
    const RateBuckets = model.initialize(config);
    const TTL_WINDOW = config.ttl;

    /**
     * Creates a new named Rate Bucket for the given IP Address.
     */
    function createRateBucket(ip, name) {
        return new JPromise((resolve, reject) => {
            const rateBucket = new RateBuckets({name, ip});
            rateBucket.save(function onRateBucketSave(error, saved) {
                if (error) {
                    reject(error);
                } else if (!rateBucket) {
                    reject(new Error('Cant\' create rate limit bucket'));
                } else {
                    resolve(saved);
                }
            });
        });
    }

    /**
     * Attempts to increment an existing rate bucket.
     */
    function incrementRateBucket(ip, name) {
        return new JPromise((resolve, reject) => {
            RateBuckets
            .findOneAndUpdate({ip, name}, { $inc: { hits: 1 } }, { upsert: false })
            .exec((err, bucket) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(bucket);
                }
            });
        });
    }

    /**
     * Gets a named rate bucket for a given IP Address
     */
    function getRateBucket(ip, name) {
        return incrementRateBucket(ip, name)
        .then((bucket) => bucket || createRateBucket(ip, name));
    }

    /**
     * Extracts an IP Address from the given request
     */
    function getIpAddress(request) {
        return request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress;
    }

    /**
     * The primary client function, invoking this function creates a middleware function that will perform rate limiting.
     * Rates are limited using named buckets per IP address. This will allow us have different API limits within an application.
     *
     * usage:
     *   app.get('/stuff', [limit('get_stuff', 50), ...]);
     */
    function limit(name, hitsPerTtlWindow) {
        return function limitMiddleware(request, response, next) {
            const ip = getIpAddress(request);
            getRateBucket(config, ip, name)
            .then((bucket) => {
                const timeUntilReset = TTL_WINDOW - (new Date().getTime() - bucket.createdAt.getTime());
                const remaining = Math.max(0, (hitsPerTtlWindow - bucket.hits));
                debug(JSON.stringify(bucket, null, 4));

                response.set('X-Rate-Limit-Limit', hitsPerTtlWindow);
                response.set('X-Rate-Limit-Remaining', remaining);
                response.set('X-Rate-Limit-Reset', timeUntilReset);
                request.rateBucket = bucket;

                if (bucket.hits < hitsPerTtlWindow) {
                    next();
                } else {
                    response.statusCode = 429;
                    response.json({error: 'RateLimit', message: 'Too Many Requests'});
                }
            }).catch((err) => {
                response.statusCode = 500;
                next(err);
            });
        };
    }

    return limit;
}

module.exports = {initialize};
