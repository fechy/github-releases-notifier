const processor = require('./processor');
const messenger = require('./messenger');
const getter = require('./getter');

const normalizer = require('../tools/normalizer');

/**
 * Worker for scrapping the release info
 * 
 * @param {MongoClient} client 
 * @param {MongoDatabase} db 
 * @param {boolean} closeOnFinish 
 */
module.exports = async (client, db, closeOnFinish) => {
    try {
        const collections = await db.collection('repositories').find().toArray();
        const messages = await Promise.all(collections.map( async repo =>
        {
            const processedXml = await getter(repo.url);
            const result = await processor(db, processedXml);
            
            return result;
        }));

        await messenger(messages);
    } catch (err) {
        console.error(err);
    } finally {
        if (closeOnFinish) {
            await client.close();
        }
    }
};