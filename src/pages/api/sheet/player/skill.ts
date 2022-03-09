import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

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

    const skillID = req.body.id;
    const value: number = req.body.value;

    if (!skillID || !value) {
        res.status(400).send({ message: 'Skill ID or value is undefined.' });
        return;
    }


    await prisma.playerSkill.update({
        where: { player_id_skill_id: { player_id: player.id, skill_id: skillID } },
        data: { value }
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

    const skill = await prisma.playerSkill.create({
        data: {
            player_id: player.id,
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