import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

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
	const attribute_id: number | undefined = req.body.attribute_id;

	if (!id || !name || attribute_id === undefined) {
		res
			.status(401)
			.send({ message: 'ID, nome ou ID de atributo do status estão em branco.' });
		return;
	}

	await database.attributeStatus.update({
		data: { name, attribute_id },
		where: { id: id },
	});

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;
	const attribute_id: number | undefined = req.body.attribute_id;

	if (!name || attribute_id === undefined) {
		res
			.status(401)
			.send({ message: 'Nome ou ID de atributo do status estão em branco.' });
		return;
	}

	const [attributeStatus, players] = await database.$transaction([
		database.attributeStatus.create({ data: { name, attribute_id } }),
		database.player.findMany({
			where: { role: { in: ['PLAYER', 'NPC'] } },
			select: { id: true },
		}),
	]);

	if (players.length > 0) {
		await database.$transaction([
			database.playerAttributeStatus.createMany({
				data: players.map((player) => {
					return {
						attribute_status_id: attributeStatus.id,
						player_id: player.id,
						value: false,
					};
				}),
			}),
			database.playerAvatar.createMany({
				data: players.map((player) => {
					return {
						attribute_status_id: attributeStatus.id,
						player_id: player.id,
						link: null,
					};
				}),
			}),
		]);
	}

	res.send({ id: attributeStatus.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID do status está em branco.' });
		return;
	}

	await database.attributeStatus.delete({ where: { id } });

	res.end();
}

export default sessionAPI(handler);
