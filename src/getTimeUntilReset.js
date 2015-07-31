function getTimeUntilReset(bucket, ttl) {
    return Math.max(0, ttl - (new Date().getTime() - bucket.createdAt.getTime()));
}

module.exports = getTimeUntilReset;
