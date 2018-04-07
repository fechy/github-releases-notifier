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

const process = (db, rawFeed) => {
    
    const normalized = normalizer(rawFeed);

    return new Promise(async (resolve, reject) => {
        const collection = await db.collection('repositories').findOne({ repository: normalized.repository });
        if (!collection) {
            return reject(notFoundMessage(normalized.repository));
        }

        const hasNewRelease = (collection.last_updated != normalized.updated_at);
        const resultMsg = hasNewRelease ? newReleaseMessage(normalized.repository) : nothingNewMessage(normalized.repository);;

        // Lets update the values
        collection.last_check_at = new Date().toISOString();
        collection.last_updated = normalized.updated_at;

        await db.collection('repositories').update({ _id: collection._id }, collection);

        return resolve(resultMsg);
    })
}

module.exports = async (db, collections) => {
    try {
        const results = await Promise.all(collections)
        const promises = results.map( rawFeed => {
            return process(db, rawFeed);
        });

        return Promise.all(promises);
    } catch (err) {
        console.log(err);
    }
};