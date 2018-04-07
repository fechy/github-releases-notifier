const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const host = process.env.MONGO_HOST || 'localhost';

const { databaseName } = require('../config');

const processor = require('./processor');
const messenger = require('./messenger');
const getter = require('../src/api/getter');
const normalizer = require('../src/tools/normalizer');
const mongodb = require('./mongodb');

module.exports = async () => {

    const client = await mongodb();
    const db = client.db(databaseName);

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
        client.close();
    }
};