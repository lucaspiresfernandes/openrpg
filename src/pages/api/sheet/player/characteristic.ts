import type { NextApiRequest } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') {
		return handlePost(req, res);
	}
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const id: number | undefined = parseInt(req.body.id);

	if (!id) {
		res.status(401).send({ message: 'Characteristic ID is undefined.' });
		return;
	}

	const value: number | undefined = req.body.value;
	const modifier: number | undefined = req.body.modifier;

	const playerId = npcId ? npcId : player.id;

	const char = await database.playerCharacteristic.update({
		data: { value, modifier },
		where: {
			player_id_characteristic_id: { player_id: playerId, characteristic_id: id },
		},
	});

	res.socket.server.io?.emit(
		'playerCharacteristicChange',
		playerId,
		id,
		char.value,
		char.modifier
	);

	res.end();
}

export default sessionAPI(handler);
