import { NextApiRequest } from 'next';
import prisma from '../../utils/database';
import { NextApiResponseServerIO } from '../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	const name = req.body.name;
	let value = req.body.value;

	if (name === undefined || value === undefined) {
		res.status(400).end();
		return;
	}

	if (typeof value !== 'string') value = JSON.stringify(value);

	const config = await prisma.config.findUnique({ where: { name } });

	if (!config) await prisma.config.create({ data: { name, value } });
	else await prisma.config.update({ where: { name }, data: { value } });

	res.end();

	res.socket.server.io?.emit('configChange', name, value);
}
