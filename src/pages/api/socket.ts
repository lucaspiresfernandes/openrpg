import { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiResponseServerIO } from '../../utils';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server as unknown as HTTPServer);

        io.on('connection', socket => {
            socket.on('room:join', roomName => socket.join(roomName));
        });

        res.socket.server.io = io;
    }
    res.end();
}