import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../utils/database';
import { sessionAPI } from '../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') return handlePost(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    if (req.method === 'DELETE') return handleDelete(req, res);
    res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const infoID = req.body.id;
    const name = req.body.name;

    if (!infoID || !name) {
        res.status(401).send({ message: 'Info ID or name is undefined.' });
        return;
    }

    await database.info.update({ data: { name }, where: { id: infoID } });

    res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const name = req.body.name;

    if (!name) {
        res.status(401).send({ message: 'Info ID or name is undefined.' });
        return;
    }

    const info = await database.info.create({ data: { name: name } });

    res.send({ id: info.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const id = req.body.id;

    if (!id) {
        res.status(401).send({ message: 'Info ID  is undefined.' });
        return;
    }

    await database.info.delete({ where: { id } });

    res.end();
}

export default sessionAPI(handler);