const {expect} = require('chai');
const sinon = require('sinon');
const getTimeUntilReset = require('./getTimeUntilReset');

describe('the getTimeUntilReset function', () => {
    let clock = null;
    beforeEach(() => clock = sinon.useFakeTimers());
    afterEach(() => clock.restore());

    it('is a function', () => expect(getTimeUntilReset).to.be.a.function);

    it('will emit the full number of seconds until the bucket resets when the bucket has just been created', () => {
        clock.tick(0);
        const bucket = { createdAt: new Date(0) };
        const ttl = getTimeUntilReset(bucket, 10);
        expect(ttl).to.equal(10); // 10 secs left
    });

    it('will emit the number of seconds remaining until the bucket resets when the clock has run down', () => {
        const bucket = { createdAt: new Date(0) };
        clock.tick(1000);
        const ttl = getTimeUntilReset(bucket, 2);
        expect(ttl).to.equal(1); // 1 sec left
    });

    it('will 0 when the clock has expired', () => {
        const bucket = { createdAt: new Date(0) };
        clock.tick(1000);
        const ttl = getTimeUntilReset(bucket, 1);
        expect(ttl).to.equal(0);
    });

    it('will emit 0 when the clock has run over', () => {
        const bucket = { createdAt: new Date(0) };
        clock.tick(2000);
        const ttl = getTimeUntilReset(bucket, 1);
        expect(ttl).to.equal(0);
    });
});
