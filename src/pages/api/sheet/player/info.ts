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

	const infoID: number | undefined = req.body.id;
	const value: string | undefined = req.body.value;

	if (!infoID || value === undefined) {
		res.status(401).send({ message: 'Info ID or value is undefined.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	await database.playerInfo.update({
		data: { value },
		where: { player_id_info_id: { player_id: playerId, info_id: infoID } },
	});

	res.end();

	if (!npcId) res.socket.server.io?.emit('playerInfoChange', playerId, infoID, value);
}

export default sessionAPI(handler);
