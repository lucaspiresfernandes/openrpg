import type { NextApiRequest } from 'next';
import database from '../../../utils/database';
import { sessionAPI } from '../../../utils/session';
import type { NextApiResponseServerIO } from '../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id = req.body.id;
	const name = req.body.name;
	const description = req.body.description;
	const weight = req.body.weight;
	const visible = req.body.visible;

	if (!id) {
		res.status(401).send({ message: 'ID is undefined.' });
		return;
	}

	const item = await database.item.update({
		data: { name, description, weight, visible },
		where: { id },
	});

	if (visible !== undefined) {
		if (visible) res.socket.server.io?.emit('playerItemAdd', id, item.name);
		else res.socket.server.io?.emit('playerItemRemove', id, false);
	} else if (name !== undefined) res.socket.server.io?.emit('playerItemChange', id, name);

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name = req.body.name;
	const description = req.body.description;

	if (name === undefined || description === undefined) {
		res.status(401).send({ message: 'Name or description is undefined.' });
		return;
	}

	const item = await database.item.create({ data: { name, description, visible: true } });

	res.send({ id: item.id });

	res.socket.server.io?.emit('playerItemAdd', item.id, item.name);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID is undefined.' });
		return;
	}

	await database.item.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('playerItemRemove', id, true);
}

export default sessionAPI(handler);
