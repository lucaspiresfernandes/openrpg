require('dotenv').config();

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const port = parseInt(process.env.PORT) || 3000;

io.on('connect', socket => {
    socket.on('room:join', roomName => socket.join(roomName));
});

nextApp.prepare().then(() => {
    app.all('*', (req, res) => nextHandler(req, res));
    server.listen(port, () => console.log('[Server] Successfully started on port', port));
});