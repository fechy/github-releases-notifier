const fakeData = {
    feed: { }
};

module.exports = async (url) =>
{
    if (!url.endsWith('.atom')) {
        url = `${url}.atom`;
    }

    console.log('Mock Getter!!');

    return new Promise((resolve, reject) => {
        return resolve(fakeData);
    });
};