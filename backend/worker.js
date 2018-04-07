const route = require('koa-route');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const schedule = require('node-schedule');

const getter = require('../src/api/getter');
const normalizer = require('../src/tools/normalizer');
const { sendMessage } = require('../src/tools/bot');

const host = process.env.MONGO_HOST || 'localhost';

// Connection URL
const url = `mongodb://${host}:27017`;

// Database Name
const dbName = 'github-notifier';

const worker = () => {
    // Use connect method to connect to the server
    MongoClient.connect(url, async (err, client) => {
        assert.equal(null, err);

        console.log("Connected successfully to server");

        const db = client.db(dbName);

        const collections = [];
        
        const stream = db.collection('repositories').find().stream();
        
        stream.on('data', function(repo) {
            collections.push(getter(repo.url));
        });

        stream.on('error', function(err) {
            console.error(err);
            client.close();
        });

        stream.on('end', function() {
            Promise.all(collections).then(values => {
                const checkPromises = [];

                values.map( raw_feed => {
                    const promise = new Promise((resolve, reject) => {

                        const normalized = normalizer(raw_feed);

                        db.collection('repositories').findOne({ repository: normalized.repository }, (err, collection) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!collection) {
                                    reject(`not found`);
                                } else {

                                    collection.last_check_at = new Date().toISOString();
                                    db.collection('repositories').update({ _id: collection._id }, collection);

                                    let resultMsg = '';
                                    if (collection.last_updated != normalized.updated_at) {
                                        resultMsg = `Found a new release for ${normalized.repository}!`;
                                    } else {
                                        resultMsg = `Nothing new for ${normalized.repository}`;
                                    }
                                    
                                    resolve(resultMsg);
                                }
                            }
                        });
                    });

                    checkPromises.push(promise);
                });

                Promise.all(checkPromises)
                    .then(messages => {
                            const message = "<strong>Github releases bot results:</strong>\r\n<pre>" + messages.join("\r\n") + "</pre>";
                            
                            sendMessage(message).then((message) => {
                                client.close()
                            }). catch( err => {
                                console.error(err);
                                client.close()
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        client.close();
                    })
            }).catch(err => {
                console.err(err);
                client.close();
            })
        });

        process.on('exit', function () {
            client.close();
        });
    });
};

let scheduleTime = process.env.CRON_TIME || '0 0/6 * * *';

const job = schedule.scheduleJob(scheduleTime, () => {
    console.log('The answer to life, the universe, and everything!');
    worker();
});

module.exports = (app) => {
    app.use(route.get('/api/cron-time', async ctx => {
        ctx.set('Content-type', 'application/json');

        ctx.body = JSON.stringify({
            status: true,
            code: scheduleTime,
            next: job.nextInvocation()
        });
    }));

    app.use(route.post('/api/cron-time', async ctx => {
        
        const request = ctx.request.body;

        ctx.set('Content-type', 'application/json');

        scheduleTime = request.time;

        const status = job.reschedule(scheduleTime);

        ctx.body = JSON.stringify({
            status: status,
            code: scheduleTime,
            next: job.nextInvocation()
        });
    }));
};