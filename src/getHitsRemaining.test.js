const {expect} = require('chai');
const getHitsRemaining = require('./getHitsRemaining');

describe('the getHitsRemaining function', () => {
    it('is a function', () => expect(getHitsRemaining).to.be.a.function);

    it('will emit the full number of hits remaining in the bucket', () => {
        const bucket = { hits: 0 };
        const remaining = getHitsRemaining(bucket, 100);
        expect(remaining).to.equal(100);
    });

    it('will emit a partial number of hits remaining in the bucket', () => {
        const bucket = { hits: 25 };
        const remaining = getHitsRemaining(bucket, 100);
        expect(remaining).to.equal(75);
    });

    it('will emit 0 when the bucket has been consumed', () => {
        const bucket = { hits: 100 };
        const remaining = getHitsRemaining(bucket, 100);
        expect(remaining).to.equal(0);
    });

    it('will emit a zero when the bucket has overrun', () => {
        const bucket = { hits: 1000 };
        const remaining = getHitsRemaining(bucket, 100);
        expect(remaining).to.equal(0);
    });
});
