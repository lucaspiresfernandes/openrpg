import type { NextApiRequest } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'DELETE') return handleDelete(req, res);
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const maxLoad = req.body.maxLoad;
	const maxSlots = req.body.maxSlots;

	await database.player.update({
		where: { id: player.id },
		data: { maxLoad, spellSlots: maxSlots },
	});

	res.end();

	res.socket.server.io?.emit('maxLoadChange', player.id, maxLoad);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const playerID = req.body.id;

	if (!playerID) {
		res.status(400).send({ message: 'Player ID is undefined.' });
		return;
	}

	await database.player.delete({ where: { id: playerID } });

	res.end();

	res.socket.server.io?.to(`player${playerID}`).emit('playerDelete');
}

export default sessionAPI(handler);
