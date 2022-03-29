import { NextApiRequest } from 'next';
import prisma from '../../../utils/database';
import { NextApiResponseServerIO } from '../../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    const enableSuccessType: boolean = req.body.enableSuccessType;
    const diceConfigurations = req.body.diceConfigurations;
    
    if (enableSuccessType === undefined && diceConfigurations === undefined) {
        res.status(400).end();
        return;
    }

    if (enableSuccessType !== undefined) await prisma.config.update({
        where: { name: 'enable_success_types' },
        data: { value: enableSuccessType }
    });

    if (diceConfigurations) await prisma.config.update({
        where: { name: 'dice' },
        data: { value: diceConfigurations }
    });

    res.end();
}