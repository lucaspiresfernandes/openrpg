import type { NextApiRequest } from 'next';
import prisma from '../../utils/database';
import type { NextApiResponseServerIO } from '../../utils/socket';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	const name: string = req.body.name;
	let value: string | undefined = undefined;

	if (req.body.value !== undefined) {
		if (typeof req.body.value === 'object') value = JSON.stringify(req.body.value);
		else value = String(req.body.value);
	}

	if (!name || value === undefined) {
		res.status(400).end();
		return;
	}

	await prisma.config.upsert({
		where: { name },
		update: { value },
		create: { name, value },
	});

	res.end();

	const behaviour = customBehaviours.get(name);
	if (behaviour) behaviour(res, value);
}

const customBehaviours = new Map<
	string,
	(res: NextApiResponseServerIO, value: any) => void
>([
	['environment', (res, value) => res.socket.server.io?.emit('environmentChange', value)],
]);