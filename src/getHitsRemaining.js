function getTimeRemaining(bucket, hitsPerTtlWindow) {
    return Math.max(0, (hitsPerTtlWindow - bucket.hits));
}
module.exports = getTimeRemaining;
