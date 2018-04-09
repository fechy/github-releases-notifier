const fakeData = {
    feed: {
        title: ["This is a fake repository"],
        updated: [new Date('2017-11-21T00:00:00').toISOString()],
        entry: [
            {
                id: ["entry-id"],
                title: ["entry-title"],
                content: [
                    {
                        _: "This is the content"
                    }
                ],
                link: [
                    {
                        $: {
                            rel: "alternate",
                            type: "text/html",
                            href: "/fechy/github-releases-notifier/releases/tag/v3.3.2"
                        }
                    }
                ],
            }
        ],
        link: [
            {
                $: {
                    href: 'https://github.com/fechy/github-releases-notifier/releases'
                }
            }
        ]
    }
};

module.exports = async () => Promise.resolve(fakeData);