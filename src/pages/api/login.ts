import type { NextApiRequest, NextApiResponse } from 'next';
import database from '../../utils/database';
import { compare } from '../../utils/encryption';
import { sessionAPI } from '../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const username: string | undefined = req.body.username;
	const plainPassword: string | undefined = req.body.password;

	if (!username || !plainPassword) {
		res.status(400).send({ message: 'Usuário ou senha está em branco.' });
		return;
	}

	const user = await database.player.findFirst({
		where: { username },
		select: {
			id: true,
			password: true,
			role: true,
		},
	});

	if (!user || !user.password) {
		res.status(401).send({ message: 'Usuário ou senha estão incorretos.' });
		return;
	}

	const isValidPassword = compare(plainPassword, user.password);

	if (!isValidPassword) {
		res.status(401).send({ message: 'Usuário ou senha estão incorretos.' });
		return;
	}

	const isAdmin = user.role === 'ADMIN';

	req.session.player = {
		id: user.id,
		admin: isAdmin,
	};
	await req.session.save();

	res.send({ admin: isAdmin });
}

export default sessionAPI(handler);
