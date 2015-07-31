const {expect} = require('chai');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

const limiter = require('./index');

mockgoose(mongoose);

describe('The throttling middleware entry point', () => {
    it('exists', () => {
        expect(limiter).to.be.ok;
        expect(limiter.initialize).to.be.a.function;
    });

    describe('the initialize function', () => {
        it('throws when invoked with no arguments', () => {
            expect(() => limiter.initialize()).to.throw(/conf must be defined/);
        });

        it('can construct a limiter instance', () => {
            const limit = limiter.initialize({mongoose});
            expect(limit).to.be.ok;
            expect(limit).to.be.a.function;
        });
    });

    describe('the limiter function returned by initialize', () => {
        let limit = null;
        beforeEach(() => limit = limiter.initialize({mongoose}));

        it('exists', () => expect(limit).to.be.a.function);

        it('can create a throttling middleware', () => {
            const middleware = limit('action', 5);
            expect(middleware).to.be.a.function;
        });

        it('will allow requests through when no bucket has been created', (done) => {
            const middleware = limit('action', 5);
            const req = {
                headers: {
                    'x-forwarded-for': '192.168.0.1',
                },
            };
            const res = {
                headers: {},
                statusCode: 200,
            };
            res.set = (key, value) => {
                res.headers[key] = value;
            };
            middleware(req, res, (err) => {
                expect(err).to.be.undefined;
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('will throttle over-used buckets', (done) => {
            const middleware = limit('action', 0);
            const req = {
                headers: {
                    'x-forwarded-for': '192.168.0.1',
                },
            };
            const res = {
                headers: {},
                statusCode: 200,
            };
            res.set = (key, value) => {
                res.headers[key] = value;
            };
            res.json = (value) => {
                res.body = value;
                expect(res.statusCode).to.equal(429);
                done();
            };

            middleware(req, res);
        });

        it('will emit 500 errors on uncaught errors', (done) => {
            const middleware = limit('action', 0);
            const req = {
                headers: {
                    'x-forwarded-for': '192.168.0.1',
                },
            };
            const res = {
                headers: {},
                statusCode: 200,
            };
            res.set = (key, value) => {
                res.headers[key] = value;
            };
            res.json = () => {
                throw new Error('Uncaught');
            };

            middleware(req, res, (err) => {
                expect(err.message).to.equal('Uncaught');
                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });
});
