const path = require('path');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');

const port = process.env.PORT || 3000;

const app = new Koa();

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

require('./src')(server, app);