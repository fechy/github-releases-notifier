const request = require('superagent');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

const endsWith = function (str, suffix) {
    return str.substr(-suffix.length) === suffix;
};

module.exports = (url) => {
    return new Promise((resolve, reject) => {

        if (!endsWith(url, '.atom')) {
            url = `${url}.atom`;
        }

        console.log(`Scrapping: ${url}`);

        request.get(url)
        .responseType('text')
        .then( res => {
            parser.parseString(res.body.toString(), (err, res) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        })
        .catch(function (err) {
            reject(err);
        })
    });
};