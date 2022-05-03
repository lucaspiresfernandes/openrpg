import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).send({ message: 'Supported methods: POST' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	await prisma.playerSkill.updateMany({
		where: { player_id: player.id },
		data: { checked: false },
	});

	res.end();
}

export default sessionAPI(handler);