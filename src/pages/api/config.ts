import { NextApiRequest } from 'next';
import { setSuccessTypeConfigDirty } from '../../utils/config';
import prisma from '../../utils/database';
import { NextApiResponseServerIO } from '../../utils/socket';

const customBehaviours = new Map<string, () => void>([
	['enable_success_types', setSuccessTypeConfigDirty]
]);

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	const name = req.body.name;
	let value = req.body.value;

	if (name === undefined || value === undefined) {
		res.status(400).end();
		return;
	}

	if (typeof value !== 'string') value = JSON.stringify(value);

	let config = await prisma.config.findUnique({ where: { name } });

	if (!config) config = await prisma.config.create({ data: { name, value } });
	else await prisma.config.update({ where: { name }, data: { value } });

	const behaviour = customBehaviours.get(config.name);
	if (behaviour) behaviour();

	res.end();

	res.socket.server.io?.emit('configChange', name, value);
}
