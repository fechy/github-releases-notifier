const route = require('koa-route');

const schedule = require('node-schedule');

const worker = require('./worker');

/**
 * Set ups the backend enpoints
 * 
 * @param {MongoClient} client 
 * @param {MongoDatabase} db 
 * @param {Koa} app 
 */
module.exports = (client, db, app) => {

    // Create worker
    let scheduleTime = process.env.CRON_TIME || '0 0/6 * * *';
    const job = schedule.scheduleJob(scheduleTime, () => worker(client, db, false));

    // Set up endpoints for modifying the worker
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