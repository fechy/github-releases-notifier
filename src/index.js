const mongodb = require('./backend/mongodb');

const { databaseName } = require('./config');

const scheduler = require('./backend/scheduler');
const socket    = require('./backend/socket');
const database  = require('./backend/database');

const setupEndpoints = async (server, app) => {
    // Set up database
    const client = await mongodb();
    const db = client.db(databaseName);

    socket(client, db, server, app);
    database(client, db, app);
    scheduler(client, db, app);
}

module.exports = setupEndpoints;