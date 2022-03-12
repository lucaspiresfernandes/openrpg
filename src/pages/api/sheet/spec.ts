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

    const id = req.body.id;
    const name = req.body.name;

    if (!id || !name) {
        res.status(401).send({ message: 'Spec ID or name is undefined.' });
        return;
    }

    await database.spec.update({ data: { name }, where: { id } });

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
        res.status(401).send({ message: 'Name is undefined.' });
        return;
    }

    const spec = await database.spec.create({ data: { name: name } });

    res.send({ id: spec.id });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const id = req.body.id;

    if (!id) {
        res.status(401).send({ message: 'ID is undefined.' });
        return;
    }

    await database.spec.delete({ where: { id } });

    res.end();
}

export default sessionAPI(handler);