import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const value: string | undefined = req.body.value;
	const npcId: number | undefined = req.body.npcId;

	if (value === undefined) {
		res.status(400).send({ message: 'Valor da anotação está em branco.' });
		return;
	}

	await database.playerNote.update({
		data: { value },
		where: { player_id: npcId ? npcId : player.id },
	});

	res.end();
}

export default sessionAPI(handler);
