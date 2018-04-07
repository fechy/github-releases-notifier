/**
 * Normalizes a XML scrapped from the atom feed to an object the application can use
 */

const { getRepositoryURL } = require('./validator');

module.exports = (rawFeed) => {
    const { title, updated, entry, link } = rawFeed.feed;

    const url        = link[0]['$']['href'];
    const repository = getRepositoryURL(url);

    const last_entry = {};
    if (entry && entry.length > 0) {
        last_entry.id      = entry[0].id[0];
        last_entry.title   = entry[0].title[0];
        last_entry.content = entry[0].content[0]["_"];
        last_entry.link    = entry[0].link[0]['$'].href;
    }

    return {
        url,
        repository,
        title: title[0],
        updated_at: updated[0],
        entries: entry ? entry.length : 0,
        last_entry: last_entry
    }
};