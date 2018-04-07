const path = require('path');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const mongodb = require('./backend/mongodb');

const { databaseName } = require('./config');

const api = require('./src/api');
const worker = require('./backend');
const database = require('./src/api/database');

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

const setupEndpoints = async () => {
    // Set up database
    const client = await mongodb();
    const db = client.db(databaseName);

    api(client, db, server, app);
    database(client, db, app);
    worker(client, db, app, false);
}

setupEndpoints();