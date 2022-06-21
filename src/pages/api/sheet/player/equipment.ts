import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'GET') return handleGet(req, res);
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).send({ message: 'Supported methods: POST | PUT | DELETE' });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const playerId = parseInt(req.query.playerId as string);
	
	if (!playerId) {
		res.status(400).end();
		return;
	}

	const pe = await prisma.playerEquipment.findMany({
		where: { player_id: playerId },
		select: { Equipment: true },
	});

	const equipments = pe.map((eq) => eq.Equipment);

	res.send({ equipments });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = req.body.id;

	if (!id) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	const currentAmmo: number | undefined = req.body.currentAmmo;

	const playerId = npcId ? npcId : player.id;

	await prisma.playerEquipment.update({
		where: { player_id_equipment_id: { player_id: playerId, equipment_id: id } },
		data: { currentAmmo },
	});

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const equipID = req.body.id;

	if (!equipID) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	const equipment = await prisma.playerEquipment.create({
		data: {
			currentAmmo: 0,
			player_id: playerId,
			equipment_id: equipID,
		},
		select: { currentAmmo: true, Equipment: true },
	});

	res.send({ equipment });

	res.socket.server.io
		?.to('admin')
		.emit('playerEquipmentAdd', playerId, equipment.Equipment);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const equipID: number | undefined = req.body.id;

	if (!equipID) {
		res.status(400).send({ message: 'Equipment ID is undefined.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	await prisma.playerEquipment.delete({
		where: { player_id_equipment_id: { player_id: playerId, equipment_id: equipID } },
	});

	res.end();

	res.socket.server.io?.to('admin').emit('playerEquipmentRemove', playerId, equipID);
}

export default sessionAPI(handler);
