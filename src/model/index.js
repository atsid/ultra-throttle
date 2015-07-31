const schema = require('./schema');

function initialize(config) {
    const mongoose = config.mongoose;
    if (!mongoose.models.RateBucket) {
        mongoose.model('RateBucket', schema(config));
    }
    return mongoose.models.RateBucket;
}

module.exports = { initialize };
