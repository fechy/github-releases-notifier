const request = require('superagent');
const xml2js = require('xml2js');
const { promisify } = require('util');

const parser = new xml2js.Parser();

const urlDecorator = (url) => {
    if (!url.endsWith('.atom')) {
        return `${url}.atom`;
    }

    return url;
};

module.exports = async (url) => {
    const result = await request.get(urlDecorator(url)).responseType('text');
    return promisify(parser.parseString)(result.body.toString());
};