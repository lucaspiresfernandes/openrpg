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
    const infoID = req.body.infoID;

    if (!playerID || !infoID) {
        res.status(401).send({ message: 'Player ID or Info ID is undefined.' });
        return;
    }

    const value = req.body.value;

    await database.playerInfo.update({
        data: { value },
        where: { player_id_info_id: { player_id: playerID, info_id: infoID } }
    });

    res.end();

    const io = res.socket?.server?.io;
    if (io) {
        io.to('admin').emit('info changed', { playerID, infoID, value });
        io.to(`portrait${playerID}`).emit('info changed', { infoID, value });
    }
}

export default sessionAPI(handler);