import type { NextApiRequest } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'PUT') return handlePut(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).send({ message: 'Supported methods: POST | PUT | DELETE' });
}

async function handlePut(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const spellID: number | undefined = req.body.id;

	if (!spellID) {
		res.status(400).send({ message: 'spell ID is undefined.' });
		return;
	}

	const npcId: number | undefined = req.body.npcId;

	const playerId = npcId ? npcId : player.id;

	const spell = await prisma.playerSpell.create({
		data: {
			player_id: playerId,
			spell_id: spellID,
		},
		select: { Spell: true },
	});

	res.send({ spell: spell.Spell });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const spellID: number | undefined = req.body.id;

	if (!spellID) {
		res.status(400).send({ message: 'spell ID is undefined.' });
		return;
	}

	const npcId: number | undefined = req.body.npcId;

	const playerId = npcId ? npcId : player.id;

	await prisma.playerSpell.delete({
		where: { player_id_spell_id: { player_id: playerId, spell_id: spellID } },
	});

	res.end();
}

export default sessionAPI(handler);
