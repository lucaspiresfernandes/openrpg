import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

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
    const rollable = req.body.rollable;

    if (!id) {
        res.status(400).send({ message: 'ID is undefined.' });
        return;
    }

    await database.attribute.update({ where: { id }, data: { name, rollable } });

    res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player || !player.admin) {
        res.status(401).end();
        return;
    }

    const name = req.body.name;
    const rollable = req.body.rollable;

    if (name === undefined || rollable === undefined) {
        res.status(400).send({ message: 'Name or rollable is undefined.' });
        return;
    }

    const attr = await database.attribute.create({ data: { name, rollable } });

    res.send({ id: attr.id });
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

    await database.attribute.delete({ where: { id } });

    res.end();
}

export default sessionAPI(handler);