import messageProcessor from './worker.processor';
import messenger from './messenger';
import mongodb from './mongodb';

/**
 * Worker for scrapping the release info
 *
 * @param {MongoClient} client
 * @param {MongoDatabase} db
 * @param {boolean} closeOnFinish
 */
module.exports = async (closeOnFinish, sendMessageForNotFound) => {
    try {
        const messages = await messageProcessor(mongodb.db, sendMessageForNotFound);
        if (messages.length > 0) {
            await messenger(messages);
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (closeOnFinish) {
            await mongodb.client.close();
        }
    }
};