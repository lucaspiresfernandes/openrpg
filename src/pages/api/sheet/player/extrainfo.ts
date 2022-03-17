import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') return handlePost(req, res);
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const extraInfoID = req.body.id;
    const value = req.body.value;

    if (!extraInfoID || value === undefined) {
        res.status(400).send({ message: 'Extra Info ID or value is undefined.' });
        return;
    }


    await database.playerExtraInfo.update({
        data: { value },
        where: { player_id_extra_info_id: { player_id: player.id, extra_info_id: extraInfoID } }
    });

    res.end();
}

export default sessionAPI(handler);