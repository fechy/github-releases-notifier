const MongoClient = require('mongodb').MongoClient;

const { databaseName } = require('../config');

const host = process.env.MONGO_HOST || 'localhost';

// Connection URL
const url = `mongodb://${host}:27017`;

const dbService = {
    db: undefined,
    client: undefined,
    connect: async (dbName) => {
        if (dbService.client == undefined || dbService.db == undefined) {
            dbService.client = await MongoClient.connect(url, { poolSize: 10 });

            let database = dbName ? dbName : databaseName;
            if (process.env.ENV == 'test' && !database.endsWith('-test')) {
                database += '-test';
            }

            dbService.db = dbService.client.db(database);
        }

        // Ensure we have the needed collection
        try {
            const collection = await dbService.db.createCollection('repositories');
            await collection.ensureIndex({ repository:1 }, { unique:true });
        } catch (err) {
            console.error(err);
        }
    },
    closeHandler: async () => {
        await dbService.client.close(true);
    }
}

module.exports = dbService;