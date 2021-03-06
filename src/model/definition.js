const IP_ADDR_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const debug = require('debug')('ultra-throttle');

module.exports = function schema(config) {
    debug(`throttles will expire with ttl ${config.ttl}`);
    return {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        ip: {
            type: String,
            required: true,
            trim: true,
            match: IP_ADDR_REGEX,
        },
        createdAt: {
            type: Date,
            required: true,
            'default': Date.now,
            expires: config.ttl,
        },
        hits: {
            type: Number,
            'default': 1,
            required: true,
            min: 0,
        },
    };
};
