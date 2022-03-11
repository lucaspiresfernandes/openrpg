import { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ClientToServerEvents, NextApiResponseServerIO, ServerToClientEvents } from '../../utils';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        const io = new Server<ClientToServerEvents, ServerToClientEvents>(res.socket.server as unknown as HTTPServer);

        io.on('connection', socket => {
            socket.on('roomJoin', roomName => socket.join(roomName));
        });

        res.socket.server.io = io;
    }
    res.end();
}