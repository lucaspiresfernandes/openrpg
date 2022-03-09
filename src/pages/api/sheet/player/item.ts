import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') return handlePost(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    if (req.method === 'DELETE') return handleDelete(req, res);
    res.status(404).send({ message: 'Supported methods: POST | PUT | DELETE' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;
    const itemID = req.body.id;

    if (!player) {
        res.status(401).end();
        return;
    }

    if (!itemID) {
        res.status(400).send({ message: 'Item ID is undefined.' });
        return;
    }

    const quantity = req.body.quantity as number;
    const currentDescription = req.body.currentDescription as string;

    await prisma.playerItem.update({
        where: { player_id_item_id: { player_id: player.id, item_id: itemID } },
        data: { quantity, currentDescription }
    });

    res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const itemID = req.body.id;

    if (!itemID) {
        res.status(400).send({ message: 'Item ID is undefined.' });
        return;
    }

    const item = await prisma.playerItem.create({
        data: {
            currentDescription: '',
            quantity: 1,
            player_id: player.id,
            item_id: itemID
        },
        select: {
            quantity: true, currentDescription: true, Item: {
                select: { id: true, name: true, description: true }
            }
        }
    });

    await prisma.playerItem.update({
        where: { player_id_item_id: { player_id: player.id, item_id: itemID } },
        data: {
            currentDescription: item.Item.description
        }
    });

    item.currentDescription = item.Item.description;

    res.send({ item });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const itemID = req.body.id;

    if (!itemID) {
        res.status(400).send({ message: 'Item ID is undefined.' });
        return;
    }

    await prisma.playerItem.delete({
        where: { player_id_item_id: { player_id: player.id, item_id: itemID } }
    });

    res.end();
}

export default sessionAPI(handler);