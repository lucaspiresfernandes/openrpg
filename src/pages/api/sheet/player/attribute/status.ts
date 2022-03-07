import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(401).end();
        return;
    }

    const playerID = req.session.player.id;
    const statusID = parseInt(req.body.attrStatusID);
    const value = req.body.value;

    if (!playerID || !statusID) {
        res.status(401).end();
        return;
    }

    await prisma.playerAttributeStatus.update({
        where: {
            player_id_attribute_status_id: {
                player_id: playerID,
                attribute_status_id: statusID
            }
        },
        data: { value }
    });

    res.end();
}

export default sessionAPI(handler);