const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * A configuration object for the middleware throttle
 */
class Configuration {
    constructor(conf) {
        if (!conf) {
            throw new Error('conf must be defined');
        }
        if (!conf.mongoose) {
            throw new Error('conf.mongoose must be defined');
        }
        this.mongoose = conf.mongoose;
        this.ttl = conf.ttl || DEFAULT_TTL;
    }
}

module.exports = Configuration;
