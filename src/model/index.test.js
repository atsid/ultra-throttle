const {expect} = require('chai');
const model = require('./index');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const Configuration = require('../Configuration');
mockgoose(mongoose);

describe('The RateBucket Model Provider', () => {
    beforeEach(() => mockgoose.reset());

    it('can create the RateBucket model', () => {
        expect(model.initialize(new Configuration({mongoose}))).to.be.ok;
    });

    it('can create the RateBucket model without an index', () => {
        expect(model.initialize(new Configuration({mongoose, index: false}))).to.be.ok;
    });
});
