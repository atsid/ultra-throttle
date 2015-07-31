const {expect} = require('chai');
const model = require('./index');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

describe('The RateBucket Model Provider', () => {
    beforeEach(() => mockgoose.reset());

    it('can create the RateBucket model', () => {
        expect(model.initialize({mongoose})).to.be.ok;
    });

    it('can create the RateBucket model without an index', () => {
        expect(model.initialize({mongoose, index: false})).to.be.ok;
    });
});
