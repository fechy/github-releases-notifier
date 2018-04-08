const path = require('path');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');

const scheduler       = require('./src/backend/scheduler');
const repositoryApi   = require('./src/backend/repository.api');
const conversationBot = require('./src/backend/conversation.bot');

const app = new Koa();

if (process.env.ENV != 'test') {
    // Logger
    app.use(logger());
}

// Body parser
app.use(bodyParser());

// Web app
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

// Error logging
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

repositoryApi(app);
scheduler(app);
conversationBot(app);

module.exports = app;