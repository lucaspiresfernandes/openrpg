import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

export type AvatarData = {
	id: number | null;
	link: string | null;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return;

	const player = req.session.player;
	const avatarData: AvatarData[] = req.body.avatarData;
	const npcId: number | undefined = req.body.npcId;

	if (!player || !avatarData || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const playerId = npcId ? npcId : player.id;

	const avatars = await prisma.playerAvatar.findMany({
		where: { player_id: playerId },
		select: { id: true, attribute_status_id: true, link: true },
	});

	if (avatars.length !== avatarData.length) {
		res.status(401).end();
		return;
	}

	await Promise.all(
		avatars.map((avatar) => {
			const statusID = avatar.attribute_status_id;
			const newAvatar = avatarData.find((av) => av.id === statusID);

			if (!newAvatar || newAvatar.link === avatar.link) return;

			return prisma.playerAvatar.update({
				where: { id: avatar.id },
				data: { link: newAvatar.link },
			});
		})
	);

	res.end();
}

export default sessionAPI(handler);
