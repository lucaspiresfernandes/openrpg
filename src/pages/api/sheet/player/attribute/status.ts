import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(401).end();
        return;
    }

    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const statusID = parseInt(req.body.attrStatusID);

    if (!statusID) {
        res.status(400).end();
        return;
    }

    const value = req.body.value;

    await prisma.playerAttributeStatus.update({
        where: {
            player_id_attribute_status_id: {
                player_id: player.id,
                attribute_status_id: statusID
            }
        },
        data: { value }
    });

    res.end();
}

export default sessionAPI(handler);