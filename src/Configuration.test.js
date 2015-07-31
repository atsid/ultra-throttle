const {expect} = require('chai');
const Configuration = require('./Configuration');

describe('The Configuration class', () => {
    it('exists', () => {
        expect(Configuration).to.be.ok;
    });

    it('throws when constructed with no arguments', () => {
        expect(() => new Configuration()).to.throw(/conf must be defined/);
    });

    it('throws when constructed without mongoose', () => {
        expect(() => new Configuration({})).to.throw(/conf.mongoose must be defined/);
    });

    it('can be constructed with proper arguments', () => {
        const mongoose = { a: 1 };
        const conf = new Configuration({mongoose});
        expect(conf).to.be.ok;
        expect(conf.mongoose).to.equal(mongoose);
        expect(conf.ttl).to.equal(5 * 60); // 5 minutes in seconds
    });

    it('can be constructed with a TTL window parameter', () => {
        const mongoose = { a: 1 };
        const ttl = 100;
        const conf = new Configuration({mongoose, ttl});
        expect(conf).to.be.ok;
        expect(conf.mongoose).to.equal(mongoose);
        expect(conf.ttl).to.equal(ttl);
    });
});
