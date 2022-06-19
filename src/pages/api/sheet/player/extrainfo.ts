import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;
	
	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}
	
	const id: number | undefined = req.body.id;
	const value: string | undefined = req.body.value;

	if (!id || value === undefined) {
		res.status(400).send({ message: 'ID ou valor estão em branco.' });
		return;
	}

	await database.playerExtraInfo.update({
		data: { value },
		where: {
			player_id_extra_info_id: { player_id: npcId ? npcId : player.id, extra_info_id: id },
		},
	});

	res.end();
}

export default sessionAPI(handler);
