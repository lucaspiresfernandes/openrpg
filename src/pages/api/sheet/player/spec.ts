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

	const specID: number | undefined = req.body.id;
	const value: string | undefined = req.body.value;

	if (!specID || value === undefined) {
		res.status(400).send({ message: 'Spec ID or value is undefined.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	await database.playerSpec.update({
		data: { value },
		where: { player_id_spec_id: { player_id: playerId, spec_id: specID } },
	});

	res.end();

	res.socket.server.io?.emit('playerSpecChange', playerId, specID, value);
}

export default sessionAPI(handler);
