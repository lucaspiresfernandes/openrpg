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

	const attributeID: number | undefined = parseInt(req.body.id);

	if (!attributeID) {
		res.status(401).send({ message: 'ID do atributo está em branco.' });
		return;
	}

	const value: number | undefined = req.body.value;
	const maxValue: number | undefined = req.body.maxValue;
	const show: boolean | undefined = req.body.show;

	const playerId = npcId ? npcId : player.id;

	const attr = await prisma.playerAttribute.update({
		where: {
			player_id_attribute_id: {
				player_id: playerId,
				attribute_id: attributeID,
			},
		},
		data: { value, maxValue, show },
	});

	res.end();

	res.socket.server.io?.to(`portrait${playerId}`).to('admin').emit(
		'playerAttributeChange',
		playerId,
		attributeID,
		attr.value,
		attr.maxValue,
		attr.show
	);
}

export default sessionAPI(handler);
