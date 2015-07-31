const schema = require('./schema');

function defineRateBucketModel(config) {
    const {mongoose} = config;
    const {Schema} = mongoose;
    const RateBucket = new Schema(schema(config));
    return mongoose.model('RateBucket', RateBucket);
}

function initialize(config) {
    const mongoose = config.mongoose;
    if (!mongoose.models.RateBucket) {
        defineRateBucketModel(config);
    }
    return mongoose.models.RateBucket;
}

module.exports = { initialize };
