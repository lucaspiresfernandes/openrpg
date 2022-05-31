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
	const damage: string | undefined = req.body.damage;
	const description: string | undefined = req.body.description;
	const cost: string | undefined = req.body.cost;
	const type: string | undefined = req.body.type;
	const target: string | undefined = req.body.target;
	const castingTime: string | undefined = req.body.castingTime;
	const range: string | undefined = req.body.range;
	const duration: string | undefined = req.body.duration;
	const slots: number | undefined = req.body.slots;
	const visible: boolean | undefined = req.body.visible;

	if (
		!id ||
		!name ||
		!damage ||
		!description ||
		!cost ||
		!type ||
		!target ||
		!castingTime ||
		!range ||
		!duration ||
		slots === undefined ||
		visible === undefined
	) {
		res.status(400).send({ message: 'Algum campo da magia está em branco.' });
		return;
	}

	const spell = await database.spell.update({
		where: { id },
		data: {
			name,
			damage,
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

	res.socket.server.io?.emit('spellChange', spell);
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;
	const description: string | undefined = req.body.description;
	const cost: string | undefined = req.body.cost;
	const type: string | undefined = req.body.type;
	const damage: string | undefined = req.body.damage;
	const castingTime: string | undefined = req.body.castingTime;
	const range: string | undefined = req.body.range;
	const duration: string | undefined = req.body.duration;
	const target: string | undefined = req.body.target;
	const slots: number | undefined = req.body.slots;

	if (
		!name ||
		!description ||
		!cost ||
		!type ||
		!damage ||
		!castingTime ||
		!range ||
		!duration ||
		!target ||
		slots === undefined
	) {
		res.status(400).send({
			message: 'Algum campo da magia está em branco.',
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

	res.socket.server.io?.emit('spellAdd', spell.id, spell.name);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID da magia está em branco.' });
		return;
	}

	await database.spell.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('spellRemove', id);
}

export default sessionAPI(handler);
