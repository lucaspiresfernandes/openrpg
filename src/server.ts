import dotenv from 'dotenv'
import express from 'express'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Server } from 'socket.io'
import next from 'next'

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const port: number = parseInt(process.env.PORT) || 3000;

io.on('connect', socket => {
    socket.on('room:join', roomName => socket.join(roomName));
});

nextApp.prepare().then(() => {
    app.all('*', (req: IncomingMessage, res: ServerResponse) => {
        return nextHandler(req, res);
    });
    server.listen(port, () => console.log('[Server] Successfully started on port', port));
})