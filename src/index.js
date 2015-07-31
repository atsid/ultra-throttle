/**
 * Adapted from https://apicatus-laboratory.rhcloud.com/2014/04/13/rate-limit-your-nodejs-api-with-mongodb/
 */
const model = require('./model');
const Configuration = require('./Configuration');
const BucketManager = require('./BucketManager');
const getIpAddress = require('./getIpAddress');
const getTimeUntilReset = require('./getTimeUntilReset');
const getHitsRemaining = require('./getHitsRemaining');

/**
 * Initializes the rate throttling middleware
 * @param config - The configuration object.
 *     {
 *         ttl: <Number - the number of milliseconds a limiting window lasts.
 *         mongoose: The mongoose instance used by the application
 *     }
 */
function initialize(conf) {
    const config = new Configuration(conf);
    const RateBucket = model.initialize(config);
    const bucketManager = new BucketManager(RateBucket);

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
            bucketManager.increment(ip, name)
            .then((bucket) => {
                const timeUntilReset = getTimeUntilReset(bucket, config.ttl);
                const remaining = getHitsRemaining(bucket, hitsPerTtlWindow);
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
