const request = require('superagent');
const xml2js = require('xml2js');
const { promisify } = require('util');

const parser = new xml2js.Parser();

module.exports = async (url) => {
    
    if (!url.endsWith('.atom')) {
        url = `${url}.atom`;
    }

    const result = await request.get(url).responseType('text');
    return promisify(parser.parseString)(result.body.toString());
};