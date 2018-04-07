/**
 * Use it for testing the worker directly without having to wait for the scheduler to run
 */
const mongodb = require('./src/backend/mongodb');
const { databaseName } = require('./src/config');

const setup = async () => {
    const client = await mongodb();
    const db = client.db(databaseName);

    const worker = require('./src/backend/worker');

    worker(client, db, true);
};

setup();