const route = require('koa-route');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const host = process.env.MONGO_HOST || 'localhost';

// Connection URL
const url = `mongodb://${host}:27017`;

// Database Name
const dbName = 'github-notifier';

module.exports = (app, ) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, async (err, client) => {
        assert.equal(null, err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);

        db.createCollection('repositories', (err, collection) => {
            assert.equal(null, err);

            // Create a simple single field index
            collection.ensureIndex({ repository:1 }, { unique:true });
        });

        // Build API endpoints
        app.use(route.get('/api/db-status', async ctx => {
            ctx.set('Content-type', 'application/json');
            ctx.body = JSON.stringify({
                status: true
            });
        }));

        app.use(route.get('/api/watch-list', async ctx => {
            ctx.set('Content-type', 'application/json');

            const collections = [];

            return new Promise((resolve, reject) => {
                db.collection('repositories').find({}, (err, collection) => {
                    if (err) {
                        reject(err);
                    } else {
                        const stream = collection.stream();
                        
                        stream.on('data', function(doc) {
                            collections.push(doc);
                        });
                        stream.on('error', function(err) {
                            reject(err);
                        });
                        stream.on('end', function() {
                            resolve(collections);
                        });
                    }
                });
            }).then( collections => {
                ctx.body = JSON.stringify({ collections });
            }).catch(err => {
                ctx.body = JSON.stringify({ collections, error: err });
            });
        }));

        app.use(route.post('/api/exists', async ctx => {
            const request = ctx.request.body;

            ctx.set('Content-type', 'application/json');

            return new Promise((resolve, reject) => {
                db.collection('repositories').find({ repository: request.repository }, (err, collection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(collection.count())
                    }
                });
            }).then( totalEntries => {
                ctx.body = JSON.stringify({ exists: totalEntries > 0 });
            }).catch(err => {
                ctx.body = JSON.stringify({ exists: false, error: err });
            });
        }));

        app.use(route.post('/api/remove', async ctx => {
            const request = ctx.request.body;

            ctx.set('Content-type', 'application/json');

            return new Promise((resolve, reject) => {
                db.collection('repositories').deleteOne({ repository: request.repository }, (err, collection) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true)
                    }
                });
            }).then( result => {
                ctx.body = JSON.stringify({ result: result });
            }).catch(err => {
                ctx.body = JSON.stringify({ result: false, error: err });
            });
        }));

        app.use(route.post('/api/store-url', async ctx => {
            const request = ctx.request.body;

            const entry = {
                repository: request.repository,
                url: request.url,
                last_updated: request.last_updated,
                last_check_at: null
            }

            ctx.set('Content-type', 'application/json');

            const result = {
                status: false
            };

            await new Promise((resolve, reject) => {
                db.collection('repositories').insert(entry, { repository:1, keepGoing: true }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }).then(res => {
                result.status = true;
                ctx.body = JSON.stringify(result);
            }).catch(err => {
                result.error = err;
                ctx.body = JSON.stringify(result);
            });
        }))

        process.on('exit', function () {
            client.close();
        });
    });
}