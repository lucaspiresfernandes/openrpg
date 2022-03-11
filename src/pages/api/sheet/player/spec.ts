import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '../../../../utils';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    }
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const specID = req.body.id;
    const value = req.body.value;

    if (!specID || !value) {
        res.status(400).send({ message: 'Spec ID or value is undefined.' });
        return;
    }

    await database.playerSpec.update({
        data: { value },
        where: { player_id_spec_id: { player_id: player.id, spec_id: specID } }
    });

    res.end();

    res.socket.server.io?.emit('specChange', player.id, specID, value);
}

export default sessionAPI(handler);