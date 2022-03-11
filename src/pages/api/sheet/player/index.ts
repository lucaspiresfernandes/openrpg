import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '../../../../utils';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method === 'DELETE') return handleDelete(req, res);
    res.status(404).end();
}

async function handleDelete(req: NextApiRequest, res: NextApiResponseServerIO) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const playerID = req.body.id;

    if (!playerID) {
        res.status(400).send({ message: 'Player ID is undefined.' });
        return;
    }

    await database.player.delete({ where: { id: playerID } });

    res.end();

    res.socket.server.io?.to(`player${playerID}`).emit('playerDelete');
}

export default sessionAPI(handler);