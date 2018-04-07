const mongodb = require('./backend/mongodb');
const { databaseName } = require('./config');

const setup = async () => {
    const client = await mongodb();
    const db = client.db(databaseName);

    const worker = require('./backend/worker');

    worker(client, db, true);
};

setup();