import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import api from '../utils/api';


export default function useSocket(onSocketLoaded: (socket: Socket) => void, room: string = '') {
    useEffect(() => {
        let socket: Socket;
        api.get('/socket').then(() => {
            socket = io();
            if (room) socket.emit('room:join', room);
            onSocketLoaded(socket);
        });

        return () => {
            socket.removeAllListeners();
        };
    });
}