import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import api from '../utils/api';

let socketDeliverPromise: Promise<Socket> | null = null;

export default function useSocket(onSocketLoaded: (socket: Socket) => void, room?: string) {
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        if (socket.current) {
            return onSocketLoaded(socket.current);
        }
        else {
            if (socketDeliverPromise) {
                socketDeliverPromise.then(socket => {
                    onSocketLoaded(socket);
                    socketDeliverPromise = null;
                });
            }
            else {
                socketDeliverPromise = new Promise(res => {
                    api.get('/socket').then(() => {
                        const current = io();
                        socket.current = current;
                        current.on('connect', () => {
                            onSocketLoaded(current);
                            if (room) current.emit('room:join', room);
                            res(current);
                        });
                    });
                });
            }

        }

        return () => {
            socket.current?.removeAllListeners();
            socket.current = null;
        };
    });
}