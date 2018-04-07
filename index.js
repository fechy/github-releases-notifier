const path = require('path');
const middlewares = require('koa-middlewares');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const send = require('koa-send')
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

const port = process.env.PORT || 3000;

// Logger
app.use(logger());

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

const server = app.listen(port, (err) => {
    if (err) {
        console.error({ err });
    }
    
    console.log(`Go to: http://0.0.0.0:${port}`);
});

require('./src/api')(server, app);
require('./backend')(app);