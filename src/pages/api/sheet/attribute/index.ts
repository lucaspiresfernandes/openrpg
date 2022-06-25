import { Prisma } from '@prisma/client';
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
	const color: string | undefined = req.body.color;
	const rollable: boolean | undefined = req.body.rollable;
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (!id || !name || !color || rollable === undefined || visibleToAdmin === undefined) {
		res.status(400).send({
			message: 'ID, nome, cor, rolável ou visível(mestre) do atributo estão em branco.',
		});
		return;
	}

	await database.attribute.update({
		where: { id },
		data: { name, color, rollable, visibleToAdmin },
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
	const color: string | undefined = req.body.color;
	const rollable: boolean | undefined = req.body.rollable;
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (!name || !color || rollable === undefined || visibleToAdmin === undefined) {
		res.status(400).send({
			message: 'Nome, cor, rolável ou visível(mestre) do atributo estão em branco.',
		});
		return;
	}

	const [attr, players] = await database.$transaction([
		database.attribute.create({ data: { name, color, rollable, visibleToAdmin } }),
		database.player.findMany({
			where: { role: { in: ['PLAYER', 'NPC'] } },
			select: { id: true },
		}),
	]);

	if (players.length > 0) {
		await database.playerAttribute.createMany({
			data: players.map((player) => {
				return {
					attribute_id: attr.id,
					player_id: player.id,
					value: 0,
					maxValue: 0,
				};
			}),
		});
	}

	res.send({ id: attr.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID do atributo está em branco.' });
		return;
	}

	try {
		await database.attribute.delete({ where: { id } });
		res.end();
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2003') {
				res.status(400).send({
					message:
						'Não foi possível remover esse atributo pois ainda há algum status de atributo usando-a.',
				});
				return;
			}
		}
		res.status(500).end();
	}
}

export default sessionAPI(handler);
