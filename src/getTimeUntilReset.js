function msToSec(ms) {
    return ms / 1000;
}

function getTimeUntilReset(bucket, ttl) {
    const now = new Date().getTime();
    const creation = bucket.createdAt.getTime();
    const passed = msToSec(now - creation);
    const result = Math.max(0, Math.ceil(ttl - passed));
    return result;
}

module.exports = getTimeUntilReset;
