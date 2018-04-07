const messageProcessor = require('./worker.processor');
const messenger = require('./messenger');

/**
 * Worker for scrapping the release info
 * 
 * @param {MongoClient} client 
 * @param {MongoDatabase} db 
 * @param {boolean} closeOnFinish 
 */
module.exports = async (client, db, closeOnFinish) => {
    try {
        const messages = await messageProcessor(db);
        await messenger(messages);
    } catch (err) {
        console.error(err);
    } finally {
        if (closeOnFinish) {
            await client.close();
        }
    }
};