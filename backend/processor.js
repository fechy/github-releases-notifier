const normalizer = require('../src/tools/normalizer');

const nothingNewMessage = (repository) => (
    `Nothing new for ${repository}`
)

const newReleaseMessage = (repository) => (
    `Found a new release for ${repository}!`
);

const notFoundMessage = (repository) => (
    `${repository} not found`
);

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

    const hasNewRelease = (collection.last_updated != updated_at);
    const resultMsg = hasNewRelease ? newReleaseMessage(normalized.repository) : nothingNewMessage(repository);

    // Lets update the values
    collection.last_check_at = new Date().toISOString();
    collection.last_updated = updated_at;

    await db.collection('repositories').update({ _id: collection._id }, collection);

    return resultMsg;
}