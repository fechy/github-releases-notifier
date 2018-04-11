import app from './app';
import web from './src';

const port = process.env.PORT || 3000;

const server = app.listen(port, (err) => {
    if (err) {
        console.error({ err });
    }

    console.log(`Go to: http://0.0.0.0:${port}`);
});

web(server, app);
