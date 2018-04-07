const getter = require('./getter');
const normalizer = require('../tools/normalizer');

module.exports = (server, app) => {
    
    const io = require('socket.io')(server);

    require('./database')(app);

    // Set socket.io listeners.
    io.on('connection', (socket) => {
        
        console.log('user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('scrap', request => {
            
            io.emit('scrap:start', { url: request.url });
    
            getter(request.url)
                .then( result => {
                    io.emit('scrap:result', normalizer(result));
                })
                .catch( err => {
                    io.emit('scrap:error', { status: err.status, message: err.message });
                });
        });
    });
}