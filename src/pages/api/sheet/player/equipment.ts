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
    const playerID = req.session.player.id;
    const equipID = req.body.equipmentID;

    if (!playerID || !equipID) {
        res.status(401).send({ message: 'Player ID or Equipment ID is undefined.' });
        return;
    }

    const currentAmmo = req.body.currentAmmo;
    const using: boolean = req.body.using;

    await prisma.playerEquipment.update({
        where: { player_id_equipment_id: { player_id: playerID, equipment_id: equipID } },
        data: { currentAmmo, using }
    });

    res.end();
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {

}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const playerID = req.session.player.id;
    const equipID = req.body.equipmentID;

    if (!playerID || !equipID) {
        res.status(401).send({ message: 'Player ID or Equipment ID is undefined.' });
        return;
    }

    await prisma.playerEquipment.delete({
        where: { player_id_equipment_id: { player_id: playerID, equipment_id: equipID } }
    });
    
    res.end();
}

export default sessionAPI(handler);