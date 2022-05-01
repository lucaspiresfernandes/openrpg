import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(404).end();
		return;
	}

	const playerID = parseInt(req.query.playerID as string) || req.session.player?.id;
	const statusID = parseInt(req.query.attrStatusID as string) || null;

	if (!playerID) {
		res.status(401).end();
		return;
	}

	let avatar = await prisma.playerAvatar.findFirst({
		where: {
			player_id: playerID,
			attribute_status_id: statusID,
		},
		select: { link: true },
	});

	if (avatar === null || avatar.link === null) {
		if (statusID === null) {
			res.status(404).end();
			return;
		}

		const defaultAvatar = await prisma.playerAvatar.findFirst({
			where: {
				player_id: playerID,
				attribute_status_id: null,
			},
			select: { link: true },
		});

		if (defaultAvatar === null || defaultAvatar.link === null) {
			res.status(404).end();
			return;
		}

		avatar = defaultAvatar;
	}

	res.send({ link: avatar.link });
}

export default sessionAPI(handler);
