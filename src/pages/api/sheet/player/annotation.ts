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
    const value = req.body.value;

    if (!playerID || !value) {
        res.status(401).send({ message: 'Player ID or Value is undefined.' });
        return;
    }


    await database.playerNote.update({
        data: { value },
        where: { player_id: playerID }
    });

    res.end();
}

export default sessionAPI(handler);