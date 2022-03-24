import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/database';
import databaseInit from '../../../database_init.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(404).end();

    const init = await prisma.config.findUnique({ where: { key: 'init' } });

    if (init && init.value === 'true') return res.status(400).end();

    await Promise.all([
        prisma.config.createMany({ data: databaseInit.config }),
        prisma.info.createMany({ data: databaseInit.info }),
        prisma.extraInfo.createMany({
            data: databaseInit.extraInfo.map(name => {
                return {
                    name
                };
            })
        }),
        prisma.attribute.createMany({ data: databaseInit.attribute }),
        prisma.spec.createMany({
            data: databaseInit.spec.map(name => {
                return {
                    name
                };
            })
        }),
        prisma.characteristic.createMany({ data: databaseInit.characteristic }),
        prisma.currency.createMany({
            data: databaseInit.currency.map(name => {
                return {
                    name
                };
            })
        }),
        prisma.specialization.createMany({ data: databaseInit.specialization }),
        prisma.equipment.createMany({ data: databaseInit.equipment }),
        prisma.item.createMany({ data: databaseInit.item }),
        prisma.spell.createMany({ data: databaseInit.spell }),
    ]);

    await Promise.all([
        prisma.attributeStatus.createMany({ data: databaseInit.attribute_status }),
        prisma.skill.createMany({ data: databaseInit.skill }),
    ]);

    res.end();
}