import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    }
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const charID = parseInt(req.body.id);

    if (!charID) {
        res.status(401).send({ message: 'Characteristic ID is undefined.' });
        return;
    }

    const value = req.body.value;

    await database.playerCharacteristic.update({
        data: { value },
        where: { player_id_characteristic_id: { player_id: player.id, characteristic_id: charID } }
    });

    res.end();
}

export default sessionAPI(handler);