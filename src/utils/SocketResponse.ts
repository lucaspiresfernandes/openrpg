import { NextApiResponse } from 'next';
import { Server } from 'socket.io';

import { Socket } from 'net';

interface SocketIO extends Socket {
    server?: {
        io?: Server
    };
}

export default interface SocketIOApiResponse<T = any> extends NextApiResponse<T> {
    socket: SocketIO | null
// eslint-disable-next-line semi
}