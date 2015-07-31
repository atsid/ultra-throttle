const proxy = require('./index');
const {expect} = require('chai');

describe('The throttling Proxy', () => {
    it('exists', () => {
        expect(proxy).to.be.ok;
    });
});
