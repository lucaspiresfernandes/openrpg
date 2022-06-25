import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../utils/database';
import { sessionAPI } from '../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;
	const name: string | undefined = req.body.name;

	if (!id || !name) {
		res.status(401).send({ message: 'ID ou nome da informação estão em branco.' });
		return;
	}

	await database.extraInfo.update({ data: { name }, where: { id } });

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;

	if (!name) {
		res.status(401).send({ message: 'Nome da informação está em branco.' });
		return;
	}

	const [extraInfo, players] = await database.$transaction([
		database.extraInfo.create({ data: { name }, select: { id: true } }),
		database.player.findMany({
			where: { role: { in: ['PLAYER', 'NPC'] } },
			select: { id: true },
		}),
	]);

	if (players.length > 0) {
		await database.playerExtraInfo.createMany({
			data: players.map((player) => {
				return {
					extra_info_id: extraInfo.id,
					player_id: player.id,
					value: '',
				};
			}),
		});
	}

	res.send({ id: extraInfo.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID da informação está em branco.' });
		return;
	}

	await database.extraInfo.delete({ where: { id } });

	res.end();
}

export default sessionAPI(handler);
