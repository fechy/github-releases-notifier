/**
 * Normalizes a XML scrapped from the atom feed to an object the application can use
 */

const { getRepositoryURL } = require('./validator');

module.exports = (rawFeed) => {
    const {
        title, updated, entry, link
    } = rawFeed.feed;

    const url = link[0].$.href;
    const repository = getRepositoryURL(url);

    const lastEntry = {};

    if (entry && entry.length > 0) {
        // Deconstructing the entry
        const {
            0: {
                id: { 0: entryId },
                title: { 0: entryTitle },
                content: { 0: entryContent },
                link: { 0: entryLink }
            }
        } = entry;

        lastEntry.id = entryId;
        lastEntry.title = entryTitle;
        lastEntry.content = entryContent._;
        lastEntry.link = entryLink.$.href;
    }

    return {
        url,
        repository,
        title: title[0],
        updated_at: updated[0],
        entries: entry ? entry.length : 0,
        last_entry: lastEntry
    };
};