import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') return handlePost(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    res.status(404).send({ message: 'Supported methods: POST | PUT' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const playerID = req.session.player.id;
    const skillID = req.body.id;

    if (!playerID || !skillID) {
        res.status(401).send({ message: 'Player ID or Skill ID is undefined.' });
        return;
    }

    const value = req.body.value as number;

    await prisma.playerSkill.update({
        where: { player_id_skill_id: { player_id: playerID, skill_id: skillID } },
        data: { value }
    });

    res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const playerID = req.session.player.id;
    const skillID = req.body.id;

    if (!playerID || !skillID) {
        res.status(401).send({ message: 'Player ID or Skill ID is undefined.' });
        return;
    }

    const skill = await prisma.playerSkill.create({
        data: {
            player_id: playerID,
            skill_id: skillID,
            value: 0
        },
        select: {
            Skill: { select: { id: true, name: true, Specialization: { select: { name: true } } } },
            value: true
        }
    });

    res.send({ skill });
}

export default sessionAPI(handler);