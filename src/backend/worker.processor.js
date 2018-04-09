const processor = require('./repository.processor');
const getter = require('./getter');

const nothingNewMessage = repository => (
    `Nothing new for ${repository}`
);

const newReleaseMessage = repository => (
    `Found a new release for ${repository}!`
);

module.exports = async (db, sendMessageForNotFound) => {
    const collections = await db.collection('repositories').find().toArray();
    const messages = await Promise.all(collections.map(async (repo) => {
        const processedXml = await getter(repo.url);
        const result = await processor(db, processedXml);

        if (result) {
            return newReleaseMessage(repo.repository);
        }


        return sendMessageForNotFound ? nothingNewMessage(repo.repository) : null;
    }));

    return messages.filter(msg => msg != null);
};