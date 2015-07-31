const JPromise = Promise || require('bluebird');

class BucketManager {
    constructor(RateBucket) {
        if (!RateBucket) {
            throw new Error('RateBucket must be defined');
        }
        this.RateBucket = RateBucket;
    }

    /**
     * Creates a new named Rate Bucket for the given IP Address.
     */
    _createRateBucket(ip, name) {
        return new JPromise((resolve, reject) => {
            const rateBucket = new this.RateBucket({name, ip});
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
    _incrementRateBucket(ip, name, ttl) {
        const earliestCreateDate = new Date(new Date().getTime() - (ttl * 1000));
        const criteria = {
            ip,
            name,
            createdAt: { $gt: earliestCreateDate },
        };
        return new JPromise((resolve, reject) => {
            this.RateBucket
            .findOneAndUpdate(criteria, { $inc: { hits: 1 } }, { upsert: false })
            .exec((err, bucket) => (err && reject(err)) || resolve(bucket));
        });
    }

    /**
     * Gets a named rate bucket for a given IP Address
     */
    increment(ip, name, ttl) {
        return this._incrementRateBucket(ip, name, ttl)
        .then((bucket) => bucket || this._createRateBucket(ip, name));
    }
}

module.exports = BucketManager;
