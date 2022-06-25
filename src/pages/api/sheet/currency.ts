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
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (!id || !name || visibleToAdmin === undefined) {
		res
			.status(401)
			.send({ message: 'ID, nome ou visível(mestre) da moeda está em branco.' });
		return;
	}

	await database.currency.update({ data: { name, visibleToAdmin }, where: { id } });

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (!name || visibleToAdmin === undefined) {
		res.status(401).send({ message: 'Nome ou visível(mestre) da moeda está em branco.' });
		return;
	}

	const [currency, players] = await database.$transaction([
		database.currency.create({ data: { name, visibleToAdmin }, select: { id: true } }),
		database.player.findMany({
			where: { role: { in: ['PLAYER', 'NPC'] } },
			select: { id: true },
		}),
	]);

	if (players.length > 0) {
		await database.playerCurrency.createMany({
			data: players.map((player) => {
				return {
					currency_id: currency.id,
					player_id: player.id,
					value: '',
				};
			}),
		});
	}

	res.send({ id: currency.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID da moeda está em branco.' });
		return;
	}

	await database.currency.delete({ where: { id } });

	res.end();
}

export default sessionAPI(handler);
