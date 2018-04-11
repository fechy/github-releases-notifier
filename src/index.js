import mongodb from './backend/mongodb';
import socket from './backend/socket';

module.exports = async (server, app) => {
    try {
        await mongodb.connect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    process.on('exit', mongodb.closeHandler);
    process.on('SIGINT', mongodb.closeHandler);

    socket(server, app);
};