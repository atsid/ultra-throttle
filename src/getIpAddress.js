/**
 * Extracts an IP Address from the given request
 */
function getIpAddress(request) {
    return request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
}
module.exports = getIpAddress;
