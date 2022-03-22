import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '../../../../utils/socket';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

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

    const equipID = req.body.id;

    if (!equipID) {
        res.status(400).send({ message: 'spell ID is undefined.' });
        return;
    }

    const spell = await prisma.playerSpell.create({
        data: {
            player_id: player.id,
            spell_id: equipID
        },
        select: { Spell: true }
    });

    res.send({ spell: spell.Spell });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const spellID = req.body.id;

    if (!spellID) {
        res.status(400).send({ message: 'spell ID is undefined.' });
        return;
    }

    await prisma.playerSpell.delete({
        where: { player_id_spell_id: { player_id: player.id, spell_id: spellID } }
    });

    res.end();
}

export default sessionAPI(handler);