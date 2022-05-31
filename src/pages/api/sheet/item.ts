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

	const id: number | undefined = req.body.id;
	const name: string | undefined = req.body.name;
	const description: string | undefined = req.body.description;
	const weight: number | undefined = req.body.weight;
	const visible: boolean | undefined = req.body.visible;

	if (!id || !name || !description || weight === undefined || visible === undefined) {
		res
			.status(401)
			.send({ message: 'ID, nome, descrição, peso ou visível do item estão em branco.' });
		return;
	}

	const item = await database.item.update({
		data: { name, description, weight, visible },
		where: { id },
	});

	res.socket.server.io?.emit('itemChange', item);

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;
	const description: string | undefined = req.body.description;
	const weight: number | undefined = req.body.weight;

	if (!name || !description || weight === undefined) {
		res.status(401).send({ message: 'Nome, descrição ou peso do item estão em branco.' });
		return;
	}

	const item = await database.item.create({
		data: { name, description, weight, visible: true },
	});

	res.send({ id: item.id });

	res.socket.server.io?.emit('itemAdd', item.id, item.name);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID do item está em branco.' });
		return;
	}

	await database.item.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('itemRemove', id);
}

export default sessionAPI(handler);
