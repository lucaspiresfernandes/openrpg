import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../utils/database';
import { sessionAPI } from '../../../utils/session';
import { registerPlayerData } from '../register';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;

	if (!name) {
		res.status(401).send({ message: 'Nome do NPC está em branco.' });
		return;
	}

	const npc = await database.player.create({
		data: { role: 'NPC', name },
		select: { id: true },
	});

	await registerPlayerData(npc.id);

	res.send({ id: npc.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID do NPC está em branco.' });
		return;
	}

	await database.player.delete({ where: { id } });

	res.end();
}

export default sessionAPI(handler);
