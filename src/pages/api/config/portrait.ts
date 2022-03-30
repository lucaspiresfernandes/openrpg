import { NextApiRequest } from 'next';
import prisma from '../../../utils/database';
import { NextApiResponseServerIO } from '../../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    const portraitConfigurations = req.body.portraitConfigurations;

    if (portraitConfigurations === undefined) {
        res.status(400).end();
        return;
    }

    await prisma.config.update({
        where: { name: 'portrait' },
        data: { value: JSON.stringify(portraitConfigurations) }
    });

    res.end();
}