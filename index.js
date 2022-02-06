const app = require('./app')
const PORT = normalizePort(process.env.PORT || '3000');

app.set('port', PORT);

function normalizePort(val) {
    const PORT = parseInt(val, 10);

    if (isNaN(PORT)) {
        // named pipe
        return val;
    }

    if (PORT >= 0) {
        // port number
        return PORT;
    }

    return false;
}

app.listen(PORT, () => { console.log('Server has been started on port', PORT) })