import type { NextApiRequest } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../../utils/socket';

async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method !== 'POST') {
		res.status(401).end();
		return;
	}

	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const attributeID = parseInt(req.body.id);

	if (!attributeID) {
		res.status(400).end();
		return;
	}

	const value = req.body.value;
	const maxValue = req.body.maxValue;
	const show = req.body.show;

	await prisma.playerAttribute.update({
		where: {
			player_id_attribute_id: {
				player_id: player.id,
				attribute_id: attributeID,
			},
		},
		data: { value, maxValue, show },
	});

	res.end();

	res.socket.server.io?.emit('attributeChange', player.id, attributeID, value, maxValue, show);
}

export default sessionAPI(handler);
