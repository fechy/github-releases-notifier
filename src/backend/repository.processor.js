const normalizer = require('../tools/normalizer');

/**
 * Process a scrapped Github release feed
 */
module.exports = async (db, rawFeed) => {
    
    const normalized = normalizer(rawFeed);

    const { repository, updated_at } = normalized;

    const collection = await db.collection('repositories').findOne({ repository });
    if (!collection) {
        throw new Error(notFoundMessage(repository));
    }

    const lastUpdatedTime = new Date(collection.last_updated).getTime();
    const newUpdatedTime  = new Date(updated_at).getTime();

    const hasNewRelease = (lastUpdatedTime < newUpdatedTime);

    // Lets update the values
    collection.last_check_at = new Date().toISOString();
    collection.last_updated = updated_at;

    await db.collection('repositories').update({ _id: collection._id }, collection);

    return hasNewRelease;
}