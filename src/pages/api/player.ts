import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') return handleGet(req, res);
	if (req.method === 'DELETE') return handleDelete(req, res);
	res.status(404).end();
}

function handleGet(req: NextApiRequest, res: NextApiResponse) {
	res.send({ player: req.session.player });
}

function handleDelete(req: NextApiRequest, res: NextApiResponse) {
	req.session.destroy();
	res.end();
}

export default sessionAPI(handler);
