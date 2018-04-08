const route = require('koa-route');
const { bot, sendMessage } = require('../tools/bot');

const { getList, getTotal, removeOne, addOne } = require('./watchlist');

const handleConversation = require('./conversations');

const startBot = (db) => {
    try {
        bot.on('message', (message) => handleConversation(message, db))
        .on('error', (err) => {
            console.error(err);
        }).start();
    } catch (err) {
        console.err({ BOT_ERROR: err });
    }
}

module.exports = (app, db) => {

    let botStatus = false;

    app.use(route.get('/api/bot-status', async (ctx) => {

        ctx.set('Content-type', 'application/json');
        ctx.body = { 
            status: botStatus,
        };
    }));

    app.use(route.get('/api/bot-start', async (ctx) => {

        ctx.set('Content-type', 'application/json');

        if (!botStatus) {
            startBot(db);
            botStatus = true;
        }

        ctx.body = { status: botStatus };
    }));

    app.use(route.get('/api/bot-stop', async (ctx) => {

        ctx.set('Content-type', 'application/json');

        bot.stop();
        botStatus = false;

        ctx.body = { status: botStatus };
    }));

    const exitHandler = () => {
        console.log('Stoping conversation bot');
        bot.stop();
        process.exit();
    }

    process.on('exit', exitHandler);
    process.on('SIGINT', exitHandler);
};