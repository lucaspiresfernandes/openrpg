import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../../../utils/api';
import prisma from '../../../../../utils/database';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(404).end();
        return;
    }

    const playerID = req.session.player?.id || parseInt(req.query.playerID as string);
    const statusID: number | null = parseInt(req.query.attrStatusID as string) || null;
    if (!playerID) {
        res.status(401).end();
        return;
    }

    const avatar = await prisma.playerAvatar.findFirst({
        where: {
            player_id: playerID,
            attribute_status_id: statusID
        },
        select: { link: true }
    });

    if (avatar === null || avatar.link === null) {
        res.status(404).end();
        return;
    }

    try {
        const response = await api.get(avatar.link, { responseType: 'arraybuffer', timeout: 1000 });
        res.setHeader('content-type', response.headers['content-type']);
        res.end(response.data, 'binary');
    }
    catch (err) {
        res.status(404).end();
    }
}

export default sessionAPI(handler);