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

	const name: string | undefined = req.body.name;
	const showName: boolean | undefined = req.body.showName;
	const maxLoad: number | undefined = req.body.maxLoad;
	const maxSlots: number | undefined = req.body.maxSlots;

	await database.player.update({
		where: { id: player.id },
		data: { name, showName, maxLoad, spellSlots: maxSlots },
	});

	res.end();

	if (maxLoad !== undefined)
		res.socket.server.io?.emit('playerMaxLoadChange', player.id, maxLoad);
	if (name !== undefined) res.socket.server.io?.emit('playerNameChange', player.id, name);
	if (showName !== undefined)
		res.socket.server.io?.emit('playerNameShowChange', player.id, showName);
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
