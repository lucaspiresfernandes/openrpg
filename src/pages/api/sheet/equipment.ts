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
	const type: string | undefined = req.body.type;
	const damage: string | undefined = req.body.damage;
	const range: string | undefined = req.body.range;
	const attacks: string | undefined = req.body.attacks;
	const ammo: number | null | undefined = req.body.ammo;
	const visible: boolean | undefined = req.body.visible;

	if (!id) {
	}

	if (
		!id ||
		!name ||
		!type ||
		!damage ||
		!range ||
		!attacks ||
		ammo === undefined ||
		visible === undefined
	) {
		res.status(400).send({
			message:
				'ID, nome, tipo, dano, alcance, ataques, munição ou visível do equipamento estão em branco.',
		});
		return;
	}

	const eq = await database.equipment.update({
		where: { id },
		data: { name, type, damage, range, attacks, ammo, visible },
	});

	res.end();

	res.socket.server.io?.emit('equipmentChange', eq);
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const name: string | undefined = req.body.name;
	const type: string | undefined = req.body.type;
	const damage: string | undefined = req.body.damage;
	const range: string | undefined = req.body.range;
	const attacks: string | undefined = req.body.attacks;
	const ammo: number | null | undefined = req.body.ammo;

	if (!name || !type || !damage || !range || !attacks || ammo === undefined) {
		res.status(400).send({
			message:
				'Nome, tipo, dano, alcance, ataques, munição ou visível do equipamento estão em branco.',
		});
		return;
	}

	const eq = await database.equipment.create({
		data: { name, ammo, attacks, damage, range, type, visible: true },
	});

	res.send({ id: eq.id });

	res.socket.server.io?.emit('equipmentAdd', eq.id, eq.name);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player || !player.admin) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(401).send({ message: 'ID do equipamento está em branco.' });
		return;
	}

	await database.equipment.delete({ where: { id } });

	res.end();

	res.socket.server.io?.emit('equipmentRemove', id);
}

export default sessionAPI(handler);
