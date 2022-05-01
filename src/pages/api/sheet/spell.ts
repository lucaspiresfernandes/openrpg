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
	const description = req.body.description;
	const cost = req.body.cost;
	const type = req.body.type;
	const target = req.body.target;
	const castingTime = req.body.castingTime;
	const range = req.body.range;
	const duration = req.body.duration;
	const slots = req.body.slots;
	const visible = req.body.visible;

	if (!id) {
		res.status(400).send({ message: 'Spell ID is undefined.' });
		return;
	}

	const spell = await database.spell.update({
		where: { id },
		data: {
			name,
			description,
			cost,
			type,
			target,
			castingTime,
			range,
			duration,
			slots,
			visible,
		},
	});

	res.end();

	if (visible !== undefined) {
		if (visible) res.socket.server.io?.emit('playerSpellAdd', id, spell.name);
		else res.socket.server.io?.emit('playerSpellRemove', id, false);
	} else res.socket.server.io?.emit('playerSpellChange', id, spell);
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name = req.body.name;
	const description = req.body.description;
	const cost = req.body.cost;
	const type = req.body.type;
	const target = req.body.target;
	const damage = req.body.damage;
	const castingTime = req.body.castingTime;
	const range = req.body.range;
	const duration = req.body.duration;
	const slots = req.body.slots;

	if (
		name === undefined ||
		description === undefined ||
		cost === undefined ||
		type === undefined ||
		damage === undefined ||
		castingTime === undefined ||
		range === undefined ||
		duration === undefined ||
		slots === undefined ||
		target === undefined
	) {
		res.status(400).send({
			message:
				'All fields are required: name, description, cost, ' +
				'type, damage, casting time, range and duration.',
		});
		return;
	}

	const spell = await database.spell.create({
		data: {
			name,
			description,
			cost,
			type,
			damage,
			slots,
			target,
			castingTime,
			range,
			duration,
			visible: true,
		},
	});

	res.send({ id: spell.id });

	res.socket.server.io?.emit('playerSpellAdd', spell.id, spell.name);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID is undefined.' });
		return;
	}

	await database.spell.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('playerSpellRemove', id, true);
}

export default sessionAPI(handler);
