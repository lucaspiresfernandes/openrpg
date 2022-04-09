import { NextApiRequest } from 'next';
import { ContainerConfig } from '../../../utils/config';
import prisma from '../../../utils/database';
import { NextApiResponseServerIO } from '../../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    const containerConfig: ContainerConfig = req.body.containerConfig;

    if (containerConfig === undefined) {
        res.status(400).end();
        return;
    }

     await prisma.config.update({
        where: { name: 'container' },
        data: { value: JSON.stringify(containerConfig) }
    });

    res.end();
}