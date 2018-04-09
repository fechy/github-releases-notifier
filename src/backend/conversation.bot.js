const route = require('koa-route');

const mongodb = require('./mongodb');

const BotService = require('../tools/bot');
const { getList, getTotal, removeOne, addOne } = require('./watchlist');

const handleConversation = require('./conversations');

const startBot = async () => {
    if (!BotService.isInitiated()) {
        BotService.init();
        BotService.on('message', (message) => handleConversation(message, mongodb.db));
        BotService.on('error', (err) => {
            console.error({ err });
        });
    }

    const result = await BotService.start();

    return result != undefined;
}

module.exports = (app) => {

    app.use(route.get('/api/bot-status', async (ctx) => {
        ctx.set('Content-type', 'application/json');
        ctx.body = { 
            status: BotService.getStatus(),
        };
    }));

    app.use(route.get('/api/bot-start', async (ctx) => {

        ctx.set('Content-type', 'application/json');

        const status = startBot();
        if (status) {
            ctx.body = { status };    
        } else {
            ctx.code = 400;
            ctx.body = { error: 'Failed to start bot' };
        }
    }));

    app.use(route.get('/api/bot-stop', async (ctx) => {

        ctx.set('Content-type', 'application/json');

        await BotService.stop();

        ctx.body = {
            status: BotService.getStatus()
        };
    }));

    const exitHandler = async () => {
        try {
            await BotService.stop();
        } catch (err) {
            console.error(err);
        }
        process.exit();
    }

    process.on('exit', exitHandler);
    process.on('SIGINT', exitHandler);
};