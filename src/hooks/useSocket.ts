import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import api from '../utils/api';
import type { ClientToServerEvents, ServerToClientEvents } from '../utils/socket';

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>;

export default function useSocket(roomJoin: string) {
	const [socket, setSocket] = useState<SocketIO | null>(null);

	useEffect(() => {
		api.get('/socket').then(() => {
			const socket: SocketIO = io();
			socket.on('connect', () => {
				socket.emit('roomJoin', roomJoin);
				setSocket(socket);
			});
			socket.on('connect_error', (err) => console.error('Socket.IO error:', err));
			socket.on('disconnect', (reason) =>
				console.warn('Socket.IO disconnect. Reason:', reason)
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return socket;
}
