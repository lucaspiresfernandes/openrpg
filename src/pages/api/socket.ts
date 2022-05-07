import type { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import type {
	ClientToServerEvents,
	NextApiResponseServerIO,
	ServerToClientEvents
} from '../../utils/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (!res.socket.server.io) {
		const io = new Server<ClientToServerEvents, ServerToClientEvents>(
			res.socket.server
		);

		io.on('connection', (socket) => {
			socket.on('roomJoin', (roomName) => socket.join(roomName));
		});

		res.socket.server.io = io;
	}
	res.end();
}
