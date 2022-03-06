import { NextApiRequest } from 'next';
import { Server } from 'socket.io';

export default function handler(req: NextApiRequest, res: any) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', socket => {
            socket.on('room:join', roomName => socket.join(roomName));
        });
    }
    res.end();
}