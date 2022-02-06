const app = require('./app')
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

app.listen(port, () => { console.log('Server has been started on port', port) })