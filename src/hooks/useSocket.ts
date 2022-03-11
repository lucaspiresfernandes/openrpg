import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import api from '../utils/api';
import { ClientToServerEvents, ServerToClientEvents } from '../utils';
import { useEffect } from 'react';

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;

export default function useSocket(socketCallback: (socket: SocketIO) => void) {
    useEffect(() => {
        api.get('/socket').then(() => {
            const socket: SocketIO = io();
            socket.on('connect', () => socketCallback(socket));
            socket.on('connect_error', err => console.error('Socket.IO error:', err));
            socket.on('disconnect', reason => console.warn('Socket.IO disconnect. Reason:', reason));
        });
    }, []);
}