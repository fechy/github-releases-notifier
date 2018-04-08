const mongodb = require('./backend/mongodb');
const socket  = require('./backend/socket');

module.exports = async (server, app) => {
    
    try {
        await mongodb.connect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    socket(server, app);

    process.on('exit', mongodb.closeHandler);
    process.on('SIGINT', mongodb.closeHandler);
}