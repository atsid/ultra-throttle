const definition = require('./definition');

module.exports = function createSchema(config) {
    const {mongoose} = config;
    const {Schema} = mongoose;
    const RateBucket = new Schema(definition(config));
    RateBucket.index({ip: 1, name: 1});
    return RateBucket;
};
