import { Prisma } from '@prisma/client';
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
		res.status(401).send({ message: 'ID ou nome da especialização estão em branco.' });
		return;
	}

	await database.specialization.update({ data: { name }, where: { id: id } });

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
		res.status(401).send({ message: 'Nome da especialização está em branco.' });
		return;
	}

	const specialization = await database.specialization.create({ data: { name } });

	res.send({ id: specialization.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID da especialização está em branco.' });
		return;
	}

	try {
		await database.specialization.delete({ where: { id } });
		res.end();
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === 'P2003') {
				res.status(400).send({
					message:
						'Não foi possível remover essa especialização pois ainda há alguma perícia usando-a.',
				});
				return;
			}
			res.status(500).end();
		}
	}
}

export default sessionAPI(handler);
