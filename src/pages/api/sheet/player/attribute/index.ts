import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '../../../../../utils';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') {
        res.status(401).end();
        return;
    }

    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const attributeID = parseInt(req.body.id);

    if (!attributeID) {
        res.status(400).end();
        return;
    }

    const value = req.body.value;
    const maxValue = req.body.maxValue;

    await prisma.playerAttribute.update({
        where: {
            player_id_attribute_id: {
                player_id: player.id,
                attribute_id: attributeID
            }
        },
        data: { value, maxValue }
    });

    res.end();

    res.socket.server.io?.to('admin').emit('attributeChange', player.id, attributeID, value, maxValue);
}

export default sessionAPI(handler);