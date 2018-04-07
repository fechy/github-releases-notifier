const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const host = process.env.MONGO_HOST || 'localhost';

// Connection URL
const url = `mongodb://${host}:27017`;

module.exports = async () => MongoClient.connect(url, { poolSize: 10 });