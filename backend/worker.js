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

    const stream = await db.collection('repositories').find().stream();

    const collections = [];
    stream.on('data', function(repo) {
        collections.push(getter(repo.url));
    });

    stream.on('error', function(err) {
        console.error(err);
    });

    stream.on('end', async () => {
        try {
            const processes = await processor(db, collections);
            const messages = await Promise.all(processes)
            await messenger(messages);
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    });
};