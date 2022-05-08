import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).send({ message: 'Supported methods: POST | PUT | DELETE' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const equipID = req.body.id;

	if (!equipID) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	const currentAmmo = req.body.currentAmmo;

	await prisma.playerEquipment.update({
		where: { player_id_equipment_id: { player_id: player.id, equipment_id: equipID } },
		data: { currentAmmo },
	});

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const equipID = req.body.id;

	if (!equipID) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	const equipment = await prisma.playerEquipment.create({
		data: {
			currentAmmo: 0,
			player_id: player.id,
			equipment_id: equipID,
		},
		select: { currentAmmo: true, Equipment: true },
	});

	res.send({ equipment });

	res.socket.server.io
		?.to('admin')
		.emit('playerEquipmentAdd', player.id, equipment.Equipment);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;
	const equipID = req.body.id;

	if (!player) {
		res.status(401).end();
		return;
	}

	if (!equipID) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	await prisma.playerEquipment.delete({
		where: { player_id_equipment_id: { player_id: player.id, equipment_id: equipID } },
	});

	res.end();

	res.socket.server.io?.to('admin').emit('playerEquipmentRemove', player.id, equipID);
}

export default sessionAPI(handler);
