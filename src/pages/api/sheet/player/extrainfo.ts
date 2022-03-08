import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import SocketIOApiResponse from '../../../../utils/SocketResponse';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') return handlePost(req, res);
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: SocketIOApiResponse) {
    const playerID = req.session.player.id;
    const extraInfoID = req.body.id;

    if (!playerID || !extraInfoID) {
        res.status(401).send({ message: 'Player ID or Extra Info ID is undefined.' });
        return;
    }

    const value = req.body.value;

    await database.playerExtraInfo.update({
        data: { value },
        where: { player_id_extra_info_id: { player_id: playerID, extra_info_id: extraInfoID } }
    });

    res.end();
}

export default sessionAPI(handler);