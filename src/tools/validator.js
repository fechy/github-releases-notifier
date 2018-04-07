const pattern = /^https?:\/\/github.com\/([^/]+\/[^/]+)\/releases/i;

const isValidUrl = (url) => pattern.test(url);

const getRepositoryURL = (url) => {
    if (!isValidUrl(url)) {
        return null;
    }

    return url.match(pattern)[1];
};

module.exports = {
    isValidUrl,
    getRepositoryURL
};