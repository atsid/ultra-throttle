const schema = require('./schema');
const {expect} = require('chai');

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

describe('The Schema Initializer', () => {
    beforeEach(() => mockgoose.reset());

    it('can create a schema with an index', () => {
        expect(schema({mongoose, index: true})).to.be.ok;
    });

    it('can create a schema without an index', () => {
        expect(schema({mongoose, index: false})).to.be.ok;
    });
});
