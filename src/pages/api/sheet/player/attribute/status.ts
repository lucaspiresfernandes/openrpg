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
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const statusID: number | undefined = parseInt(req.body.attrStatusID);
	const value: boolean | undefined = req.body.value;
	
	if (!statusID || value === undefined) {
		res.status(401).send({ message: 'ID ou valor do status está em branco.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	await prisma.playerAttributeStatus.update({
		where: {
			player_id_attribute_status_id: {
				player_id: playerId,
				attribute_status_id: statusID,
			},
		},
		data: { value },
	});

	res.end();

	res.socket.server.io?.emit('playerAttributeStatusChange', playerId, statusID, value);
}

export default sessionAPI(handler);
