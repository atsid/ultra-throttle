const {expect} = require('chai');
const BucketManager = require('./BucketManager');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

const model = require('./model');
const RateBucket = model.initialize({mongoose});
const debug = require('debug')('ultra-throttle');

const IP_ADDR = '192.168.0.1';

describe('The Bucket Manager', () => {
    it('exists', () => expect(BucketManager).to.be.a.function);

    it('throws when constructed with no arguments', () => {
        expect(() => new BucketManager()).to.throw(/RateBucket must be defined/);
    });

    describe('instances', () => {
        let instance = null;
        beforeEach(() => instance = new BucketManager(RateBucket));
        beforeEach(() => {
            mongoose.connect('');
            mockgoose.reset();
        });


        it('can be constructed', () => expect(instance).to.be.ok);

        describe('the increment method', () => {
            it('can create a new rate bucket', () => {
                return instance.increment(IP_ADDR, 'get_stuff')
                .then((bucket) => {
                    expect(bucket).to.be.ok;
                    expect(bucket.name).to.equal('get_stuff');
                    expect(bucket.ip).to.equal(IP_ADDR);
                    expect(bucket.hits).to.equal(1);
                });
            });

            it('can increment an existing rate bucket', () => {
                let bucketId = null;
                return instance.increment(IP_ADDR, 'get_stuff')
                .then((bucket) => {
                    debug('bucket', bucket);
                    bucketId = bucket.__id;
                    expect(bucket.hits).to.equal(1);
                    return instance.increment(IP_ADDR, 'get_stuff');
                })
                .then((bucket) => {
                    expect(bucket.__id).to.equal(bucketId);
                    expect(bucket.hits).to.equal(2);
                    return instance.increment(IP_ADDR, 'get_stuff');
                });
            });
        });
    });
});
