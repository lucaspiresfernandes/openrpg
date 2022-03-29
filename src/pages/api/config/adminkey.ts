import { NextApiRequest } from 'next';
import prisma from '../../../utils/database';
import { NextApiResponseServerIO } from '../../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    const key = req.body.key;

    if (key === undefined) {
        res.status(400).end();
        return;
    }

    await prisma.config.update({
        where: { name: 'admin_key' },
        data: { value: key }
    });

    res.end();
}