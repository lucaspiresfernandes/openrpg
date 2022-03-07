import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import SocketIOApiResponse from '../../../../utils/SocketResponse';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    }
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: SocketIOApiResponse) {
    const playerID = req.session.player.id;
    const charID = parseInt(req.body.charID);

    if (!playerID || !charID) {
        res.status(401).send({ message: 'Player ID or Characteristic ID is undefined.' });
        return;
    }

    const value = req.body.value;

    await database.playerCharacteristic.update({
        data: { value },
        where: { player_id_characteristic_id: { player_id: playerID, characteristic_id: charID } }
    });

    res.end();
}

export default sessionAPI(handler);