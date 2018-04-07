
const isValidUrl = (url) => {
    return /^http(?:.):\/\/github.com\/(.*)\/(.*)\/releases/gi.test(url);
};

const getRepositoryURL = (url) => {
    if (isValidUrl(url)) {
        const parts = url.match(/^http(?:.):\/\/github.com\/(.*)\/(.*)\/releases/);
        if (parts.length == 3) {
            return parts[1] + "/" + parts[2];
        }
    }

    return null;
};

module.exports = {
    isValidUrl,
    getRepositoryURL
};