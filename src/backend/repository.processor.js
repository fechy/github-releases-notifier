const normalizer = require('../tools/normalizer');

const notFoundMessage = repository => `${repository} not found`;

/**
 * Process a scrapped Github release feed
 */
module.exports = async (db, rawFeed) => {
    const normalized = normalizer(rawFeed);

    const { repository, updated_at, entries } = normalized;

    const collection = await db.collection('repositories').findOne({ repository });
    if (!collection) {
        throw new Error(notFoundMessage(repository));
    }

    // Ignore repositories with no releases yet
    const lastUpdatedTime = new Date(collection.last_updated).getTime();
    const newUpdatedTime = new Date(updated_at).getTime();

    const hasNewRelease = (entries > 0 && lastUpdatedTime < newUpdatedTime);

    // Update last release date
    collection.last_updated = updated_at;

    // Update the last check date
    collection.last_check_at = new Date().toISOString();

    await db.collection('repositories').update({ _id: collection._id }, collection);

    return hasNewRelease;
};