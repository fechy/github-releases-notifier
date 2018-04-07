const fakeData = {
    feed: {
        title: "This is a fake repository",
        updated: new Date().toISOString(),
        entry: [],
        link: [
            {
                '$': {
                    href: 'https://github.com/fechy/github-releases-notifier/releases'
                }
            }
        ]
    }
};

module.exports = async (url) =>
{
    if (!url.endsWith('.atom')) {
        url = `${url}.atom`;
    }

    return Promise.resolve(fakeData);
};