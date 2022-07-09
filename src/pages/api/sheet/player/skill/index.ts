import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../../utils/socket';
import type { DiceConfig } from '../../../../../utils/config';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') return handlePost(req, res);
	if (req.method === 'PUT') return handlePut(req, res);
	res.status(404).send({ message: 'Supported methods: POST | PUT' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
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

	const playerId = npcId ? npcId : player.id;

	const skill = await prisma.playerSkill.update({
		where: { player_id_skill_id: { player_id: playerId, skill_id: skillID } },
		data: { value, checked, modifier },
	});

	res.socket.server.io?.emit(
		'playerSkillChange',
		playerId,
		skillID,
		skill.value,
		skill.modifier
	);

	res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
	const player = req.session.player;
	const npcId: number | undefined = req.body.npcId;

	if (!player || (player.admin && !npcId)) {
		res.status(401).end();
		return;
	}

	const skillID = req.body.id;

	if (!skillID) {
		res.status(400).send({ message: 'Skill ID is undefined.' });
		return;
	}

	const playerId = npcId ? npcId : player.id;

	const [skill, dices] = await prisma.$transaction([
		prisma.skill.findUnique({
			where: { id: skillID },
			select: { startValue: true },
		}),
		prisma.config.findUnique({
			where: { name: 'dice' },
			select: { value: true },
		}),
	]);

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

	const enableModifiers = ((dices?.value || {}) as DiceConfig)?.skill?.enable_modifiers;
	if (!enableModifiers) playerSkill.modifier = null as any;

	res.send({ skill: playerSkill });
}

export default sessionAPI(handler);
