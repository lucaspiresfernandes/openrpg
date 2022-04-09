import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const name = req.body.name;
    let value = req.body.value;
    
    if (name === undefined || value === undefined) {
        res.status(400).end();
        return;
    }

    if (typeof value !== 'string') value = JSON.stringify(value);

    await prisma.config.update({ where: { name }, data: { value } });

    res.end();
}