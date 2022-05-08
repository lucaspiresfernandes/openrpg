import type { NextApiRequest } from 'next';
import database from '../../../../utils/database';
import { sessionAPI } from '../../../../utils/session';
import type { NextApiResponseServerIO } from '../../../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') {
		return handlePost(req, res);
	}
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const currencyID = req.body.id;
	const value = req.body.value;

	if (!currencyID || value === undefined) {
		res.status(401).send({ message: 'Currency ID or value is undefined.' });
		return;
	}

	await database.playerCurrency.update({
		data: { value },
		where: { player_id_currency_id: { player_id: player.id, currency_id: currencyID } },
	});

	res.end();

	res.socket.server.io?.emit('playerCurrencyChange', player.id, currencyID, value);
}

export default sessionAPI(handler);
