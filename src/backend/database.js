const route = require('koa-route');
const assert = require('assert');

module.exports = async (client, db, app) => {

    // Make sure we have the collection
    try {
        const collection = await db.createCollection('repositories');
        await collection.ensureIndex({ repository:1 }, { unique:true });
    } catch (err) {
        console.error(err);
    }

    // Build API endpoints
    app.use(route.get('/api/db-status', async ctx => {
        ctx.set('Content-type', 'application/json');
        ctx.body = JSON.stringify({
            status: true
        });
    }));

    app.use(route.get('/api/watch-list', async ctx => {
        ctx.set('Content-type', 'application/json');

        try {
            const collections = await db.collection('repositories').find().toArray();
            ctx.body = JSON.stringify({ collections });
        } catch (err) {
            ctx.body = JSON.stringify({ collections: [], error: err });
        }
    }));

    app.use(route.post('/api/exists', async ctx => {
        const request = ctx.request.body;

        ctx.set('Content-type', 'application/json');

        try {
            const totalEntries = await db.collection('repositories').find({ repository: request.repository }).count();
            ctx.body = JSON.stringify({ exists: totalEntries > 0 });
        } catch (err) {
            ctx.body = JSON.stringify({ exists: false, error: err });
        }
    }));

    app.use(route.post('/api/remove', async ctx => {
        const request = ctx.request.body;

        ctx.set('Content-type', 'application/json');

        try {
            const result = await db.collection('repositories').deleteOne({ repository: request.repository });
            ctx.body = JSON.stringify({ result });
        } catch (err) {
            ctx.body = JSON.stringify({ result: false, error: err });
        }
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

        try {
            const result = await db.collection('repositories').insertOne(entry, { repository: 1, keepGoing: true });
            ctx.body = JSON.stringify({ status: result });
        } catch (error) {
            ctx.body = JSON.stringify({ status: false, error });
        }
    }));
}