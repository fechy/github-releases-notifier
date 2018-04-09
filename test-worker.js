/**
 * Use it for testing the worker directly without having to wait for the scheduler to run
 */
const mongodb = require('./src/backend/mongodb');
const worker = require('./src/backend/worker');

const setup = async () => {
    try {
        await mongodb.connect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    worker(true, true);
};

setup();