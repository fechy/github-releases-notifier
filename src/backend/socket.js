const getter = require('./getter');
const normalizer = require('../tools/normalizer');

module.exports = async (client, db, server, app) => {
    
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
                io.emit('scrap:result', normalizer(result));
            } catch (err) {
                io.emit('scrap:error', { status: err.status, message: err.message });
            }
        });
    });
}