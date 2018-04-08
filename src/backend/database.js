const route = require('koa-route');
const assert = require('assert');

const { isValidRepository } = require('../tools/validator');
const { getList, getTotal, removeOne } = require('./watchlist');

const repositoryAdd = require('./repository.add');
const repositoryRemove = require('./repository.remove');

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
        ctx.body = {
            status: true
        };
    }));

    app.use(route.get('/api/watch-list', async ctx => {
        ctx.set('Content-type', 'application/json');

        try {
            const collections = await getList(db);
            ctx.body = { 
                collections 
            };
        } catch (err) {
            ctx.body = { 
                collections: [], 
                error: err 
            };
        }
    }));

    app.use(route.post('/api/exists', async ctx => {
        const request = ctx.request.body;

        ctx.set('Content-type', 'application/json');

        const { repository } = request;

        try {
            if (!isValidRepository(repository)) {
                throw new Error(`${repository} is not a valid repository`);
            }

            const totalEntries = await getTotal(db, repository);
            ctx.body = { 
                exists: totalEntries > 0 
            };
        } catch (err) {
            ctx.body = { 
                exists: false, error: err 
            };
        }
    }));

    app.use(route.post('/api/remove', async ctx => {
        const request = ctx.request.body;

        ctx.set('Content-type', 'application/json');

        const { repository } = request;

        try {
            const result = await repositoryRemove(db, request.repository);
            ctx.body = { 
                result 
            };
        } catch (error) {
            ctx.body = { 
                error,
                result: false
            };
        }
    }));

    app.use(route.post('/api/store-url', async ctx => {
        
        const url = ctx.request.body.url;

        ctx.set('Content-type', 'application/json');

        try {
            const result = await repositoryAdd(db, url);
            ctx.body = { 
                status: result 
            };
        } catch (error) {
            ctx.body = { 
                error,
                status: false 
            };
        }
    }));
}