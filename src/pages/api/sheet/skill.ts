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
	const startValue = req.body.startValue;
	const mandatory = req.body.mandatory;
	let specialization_id = req.body.specialization_id;
	if (specialization_id === 0) specialization_id = null;

	if (!id) {
		res.status(401).send({ message: 'ID is undefined.' });
		return;
	}

	const skill = await database.skill.update({
		data: { name, startValue, mandatory, specialization_id },
		where: { id },
		select: { name: true, Specialization: { select: { name: true } } },
	});

	res.end();

	if (name !== undefined || specialization_id !== undefined)
		res.socket.server.io?.emit(
			'skillChange',
			id,
			skill.name,
			skill.Specialization?.name || null
		);
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name = req.body.name;
	const startValue = req.body.startValue;
	const mandatory = req.body.mandatory;
	let specialization_id = req.body.specialization_id;
	if (specialization_id === 0) specialization_id = null;

	if (name === undefined || mandatory === undefined || specialization_id === undefined) {
		res.status(401).send({ message: 'Name or description is undefined.' });
		return;
	}

	const skill = await database.skill.create({
		data: { name, startValue, mandatory, specialization_id },
		select: {
			id: true,
			name: true,
			Specialization: {
				select: {
					name: true,
				},
			},
		},
	});

	res.send({ id: skill.id });

	res.socket.server.io?.emit('skillAdd', skill.id, skill.name, skill.Specialization?.name || null);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id = req.body.id;

	if (!id) {
		res.status(400).send({ message: 'ID is undefined.' });
		return;
	}

	try {
		await database.skill.delete({ where: { id } });
		res.end();
		res.socket.server.io?.emit('skillRemove', id);
	} catch (err) {
		if ((<any>err).code === 'P2003') {
			res.status(400).send({
				message:
					'Não foi possível remover essa perícia pois ainda há alguma informação usando-a.',
			});
			return;
		}
		res.status(500).end();
		return;
	}
}

export default sessionAPI(handler);
