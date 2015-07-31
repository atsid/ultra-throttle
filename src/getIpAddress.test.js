const {expect} = require('chai');
const getIpAddress = require('./getIpAddress');

describe('The getIpAddress function', () => {
    it('exists', () => expect(getIpAddress).to.be.a.function);

    it('cat get an ip address from the x-forwarded-for header', () => {
        const request = {
            headers: {
                'x-forwarded-for': 'abc',
            },
        };
        const ip = getIpAddress(request);
        expect(ip).to.equal('abc');
    });

    it('cat get an ip address from the connection remote address', () => {
        const request = {
            headers: {},
            connection: {
                remoteAddress: 'abc',
            },
        };
        const ip = getIpAddress(request);
        expect(ip).to.equal('abc');
    });

    it('cat get an ip address from the socket remote address', () => {
        const request = {
            headers: {},
            connection: {},
            socket: {
                remoteAddress: 'abc',
            },
        };
        const ip = getIpAddress(request);
        expect(ip).to.equal('abc');
    });

    it('cat get an ip address from the connection socket remote address', () => {
        const request = {
            headers: {},
            connection: {
                socket: {
                    remoteAddress: 'abc',
                },
            },
            socket: {},
        };
        const ip = getIpAddress(request);
        expect(ip).to.equal('abc');
    });
});
