const route = require('koa-route');
const assert = require('assert');

const { isValidRepository } = require('../tools/validator');
const { getList, getTotal, removeOne } = require('./watchlist');

const repositoryAdd = require('./repository.add');
const repositoryRemove = require('./repository.remove');

module.exports = async (client, db, app) => {

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
        } catch (error) {
            const errorMessage = error.message ? error.message : error;
            ctx.body = { 
                error: errorMessage,
                collections: []
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
        } catch (error) {
            const errorMessage = error.message ? error.message : error;
            ctx.body = { 
                error: errorMessage,
                exists: false
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
            const errorMessage = error.message ? error.message : error;
            ctx.body = { 
                error: errorMessage,
                result: false
            };
        }
    }));

    app.use(route.post('/api/add', async ctx => {
        
        const url = ctx.request.body.url;

        ctx.set('Content-type', 'application/json');

        try {
            const result = await repositoryAdd(db, url);
            ctx.body = { 
                status: result 
            };
        } catch (error) {
            const errorMessage = error.message ? error.message : error;
            ctx.body = { 
                error: errorMessage,
                status: false 
            };
        }
    }));
}