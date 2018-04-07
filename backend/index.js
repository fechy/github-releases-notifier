const route = require('koa-route');

const schedule = require('node-schedule');

const worker = require('./worker');

let scheduleTime = process.env.CRON_TIME || '0 0/6 * * *';

const job = schedule.scheduleJob(scheduleTime, () => {
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