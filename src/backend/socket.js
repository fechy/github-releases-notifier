const getter = require('./getter');
const normalizer = require('../tools/normalizer');

const mongodb = require('./mongodb');

module.exports = async (server, app) => {
    
    const io = require('socket.io')(server);

    // Set socket.io listeners.
    io.on('connection', (socket) => {
        
        console.log('Socket: user connected');

        socket.on('disconnect', () => {
            console.log('Socket: user disconnected');
        });

        socket.on('scrap', async request => {
            
            io.emit('scrap:start', { url: request.url });
    
            try {
                const result = await getter(request.url);
                const normalized = normalizer(result);

                const collection = await mongodb.db.collection('repositories').findOne({ repository: normalized.repository });

                io.emit('scrap:result', {
                    feed: normalized,
                    internal: collection
                });
            } catch (err) {
                io.emit('scrap:error', { status: err.status, message: err.message });
            }
        });
    });
}