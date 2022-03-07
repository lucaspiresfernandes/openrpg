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
    const specID = req.body.specID;

    if (!playerID || !specID) {
        res.status(401).send({ message: 'Player ID or Spec ID is undefined.' });
        return;
    }

    const value = req.body.value;

    await database.playerSpec.update({
        data: { value },
        where: { player_id_spec_id: { player_id: playerID, spec_id: specID } }
    });

    res.end();

    // const io = res.socket?.server?.io;
    // if (io) {
    //     io.to('admin').emit('info changed', { playerID, infoID: specID, value });
    //     io.to(`portrait${playerID}`).emit('info changed', { infoID: specID, value });
    // }
}

export default sessionAPI(handler);