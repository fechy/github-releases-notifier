const processor = require('./repository.processor');
const getter = require('./getter');

module.exports = async (db) => {
    const collections = await db.collection('repositories').find().toArray();
    const messages = await Promise.all(collections.map( async repo =>
    {
        const processedXml = await getter(repo.url);
        const result = await processor(db, processedXml);
        
        return result;
    }));

    return messages;
}