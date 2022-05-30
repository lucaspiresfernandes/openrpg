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

	if (!player) {
		res.status(401).end();
		return;
	}

	const charID = parseInt(req.body.id);

	if (!charID) {
		res.status(401).send({ message: 'Characteristic ID is undefined.' });
		return;
	}

	const value = req.body.value;
	const modifier: number = req.body.modifier;

	await database.playerCharacteristic.update({
		data: { value, modifier },
		where: {
			player_id_characteristic_id: { player_id: player.id, characteristic_id: charID },
		},
	});

	res.end();
}

export default sessionAPI(handler);
