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
	const startValue: number | undefined = req.body.startValue;
	const mandatory: boolean | undefined = req.body.mandatory;
	let specialization_id: number | null | undefined = req.body.specialization_id;
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (
		!id ||
		!name ||
		startValue === undefined ||
		mandatory === undefined ||
		specialization_id === undefined ||
		visibleToAdmin === undefined
	) {
		res.status(401).send({
			message:
				'ID, nome, valor inicial, obrigatório, ID de especialização ou visível(mestre) da perícia estão em branco.',
		});
		return;
	}

	if (specialization_id === 0) specialization_id = null;

	const skill = await database.skill.update({
		data: { name, startValue, mandatory, specialization_id, visibleToAdmin },
		where: { id },
		select: { name: true, Specialization: { select: { name: true } } },
	});

	res.end();

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

	const name: string | undefined = req.body.name;
	const startValue: number | undefined = req.body.startValue;
	const mandatory: boolean | undefined = req.body.mandatory;
	let specialization_id: number | null | undefined = req.body.specialization_id;
	const visibleToAdmin: boolean | undefined = req.body.visibleToAdmin;

	if (
		!name ||
		startValue === undefined ||
		mandatory === undefined ||
		specialization_id === undefined ||
		visibleToAdmin === undefined
	) {
		res.status(401).send({
			message:
				'Nome, valor inicial, obrigatório, ID de especialização ou visível(mestre) da perícia estão em branco.',
		});
		return;
	}

	if (specialization_id === 0) specialization_id = null;

	const skill = await database.skill.create({
		data: { name, startValue, mandatory, specialization_id, visibleToAdmin },
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

	res.socket.server.io?.emit(
		'skillAdd',
		skill.id,
		skill.name,
		skill.Specialization?.name || null
	);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(400).send({ message: 'ID da perícia está em branco.' });
		return;
	}

	await database.skill.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('skillRemove', id);
}

export default sessionAPI(handler);
