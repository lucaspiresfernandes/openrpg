import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(401).end();
        return;
    }

    const playerID = req.session.player.id;
    const attributeID = parseInt(req.body.attributeID);
    const value = req.body.value;
    const maxValue = req.body.maxValue;

    if (!playerID || !attributeID) {
        res.status(401).end();
        return;
    }

    await prisma.playerAttribute.update({
        where: {
            player_id_attribute_id: {
                player_id: playerID,
                attribute_id: attributeID
            }
        },
        data: { value, maxValue }
    });

    res.end();
}

export default sessionAPI(handler);