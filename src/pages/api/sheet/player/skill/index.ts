import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	res.status(404).send({ message: 'Supported methods: POST | PUT' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const skillID: number | undefined = req.body.id;
	const value: number | undefined = req.body.value;
	const checked: boolean | undefined = req.body.checked;
	const modifier: number | undefined = req.body.modifier;

	if (!skillID) {
		res.status(400).send({ message: 'Skill ID or value is undefined.' });
		return;
	}

	const npcId: number | undefined = req.body.npcId;

	const playerId = npcId ? npcId : player.id;

	await prisma.playerSkill.update({
		where: { player_id_skill_id: { player_id: playerId, skill_id: skillID } },
		data: { value, checked, modifier },
	});

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const skillID = req.body.id;

	if (!skillID) {
		res.status(400).send({ message: 'Skill ID is undefined.' });
		return;
	}
	const npcId: number | undefined = req.body.npcId;

	const playerId = npcId ? npcId : player.id;

	const skill = await prisma.skill.findUnique({
		where: { id: skillID },
		select: { startValue: true },
	});

	const playerSkill = await prisma.playerSkill.create({
		data: {
			player_id: playerId,
			skill_id: skillID,
			value: skill?.startValue || 0,
			checked: false,
		},
		select: {
			Skill: {
				select: { id: true, name: true, Specialization: { select: { name: true } } },
			},
			value: true,
			checked: true,
			modifier: true,
		},
	});

	res.send({ skill: playerSkill });
}

export default sessionAPI(handler);
