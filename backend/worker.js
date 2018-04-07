const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const host = process.env.MONGO_HOST || 'localhost';

const processor = require('./processor');
const messenger = require('./messenger');
const getter = require('../src/api/getter');
const normalizer = require('../src/tools/normalizer');

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
        const messages = await Promise.all(collections.map( async repo => {
            const process = await getter(repo.url);
            const result = await processor(db, process);
            return result;
        }));

        await messenger(messages);
    } catch (err) {
        console.error(err);
    } finally {
        if (closeOnFinish) {
            client.close();
        }
    }
};