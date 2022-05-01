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

	const currencyID = req.body.id;
	const name = req.body.name;

	if (!currencyID || !name) {
		res.status(401).send({ message: 'Currency ID or name is undefined.' });
		return;
	}

	await database.currency.update({ data: { name }, where: { id: currencyID } });

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name = req.body.name;

	if (!name) {
		res.status(401).send({ message: 'Name is undefined.' });
		return;
	}

	const [currency, players] = await database.$transaction([
		database.currency.create({ data: { name }, select: { id: true } }),
		database.player.findMany({ where: { role: 'PLAYER' }, select: { id: true } }),
	]);

	if (players.length > 0)
		await database.playerCurrency.createMany({
			data: players.map((player) => {
				return {
					currency_id: currency.id,
					player_id: player.id,
					value: '',
				};
			}),
		});

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
		res.status(401).send({ message: 'Currency ID  is undefined.' });
		return;
	}

	await database.currency.delete({ where: { id } });

	res.end();
}

export default sessionAPI(handler);
