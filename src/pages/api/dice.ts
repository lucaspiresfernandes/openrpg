import type { NextApiRequest } from 'next';
import RandomOrg from 'random-org';
import { isSuccessTypeEnabled } from '../../utils/config';
import type {
	DiceResponse,
	DiceResolverKey,
	DiceResponseResultType,
	DiceRequest,
} from '../../utils/dice';
import { sessionAPI } from '../../utils/session';
import type { NextApiResponseServerIO } from '../../utils/socket';

const random = new RandomOrg({ apiKey: process.env.RANDOM_ORG_KEY || 'unkown' });

async function nextInt(min: number, max: number, n: number): Promise<{ data: number[] }> {
	try {
		return (await random.generateIntegers({ min, max, n })).random;
	} catch (err) {
		console.error('Random.org inactive or apiKey is not defined.');
	}

	let data = [];

	min = Math.ceil(min);
	max = Math.floor(max);

	for (let i = 0; i < n; i++)
		data.push(Math.floor(Math.random() * (max - min + 1) + min));

	return { data };
}

async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO<{ results: DiceResponse[] }>
) {
	if (req.method !== 'POST') {
		res.status(404).end();
		return;
	}

	const player = req.session.player;

	if (!player) {
		res.status(401).end();
		return;
	}

	const dices: DiceRequest | DiceRequest[] = req.body.dices;
	const resolverKey: DiceResolverKey | undefined = req.body.resolverKey || undefined;

	if (!dices) {
		res.status(400).end();
		return;
	}

	const io = res.socket.server.io;

	io?.to(`portrait${player.id}`).emit('diceRoll');

	const isArray = Array.isArray(dices);
	const results: Array<DiceResponse> = isArray
		? new Array(dices.length)
		: new Array(dices.num);

	if (isArray) {
		await Promise.all(
			dices.map((dice, index) => {
				const numDices = dice.num;
				const roll = dice.roll;

				if (numDices === 0 || roll < 1) {
					results[index] = { roll };
					return;
				}

				if (roll === 1) {
					results[index] = { roll: numDices };
					return;
				}

				return nextInt(numDices, numDices * roll, 1).then(
					({ data }) => (results[index] = { roll: data[0] })
				);
			})
		);
	} else {
		const numDices = dices.num;
		const roll = dices.roll;
		const reference = dices.ref;

		if (numDices === 0 || roll < 1) {
			res.send({ results: [{ roll }] });
			return;
		}

		if (roll === 1) {
			res.send({ results: [{ roll: numDices }] });
			return;
		}

		const { data } = await nextInt(1, roll, numDices);

		for (let index = 0; index < data.length; index++) {
			const result = data[index];
			
			results[index] = { roll: result };

			const successTypeEnabled = await isSuccessTypeEnabled();
			if (successTypeEnabled && resolverKey && reference)
				results[index].resultType = resolveSuccessType(resolverKey, reference, result);
		}
	}

	res.send({ results });

	if (!player.admin) io?.to('admin').emit('diceResult', player.id, results, dices);
	io?.to(`portrait${player.id}`).emit('diceResult', player.id, results, dices);
}

function resolveSuccessType(
	key: DiceResolverKey,
	reference: number,
	roll: number
): DiceResponseResultType {
	switch (key) {
		case '20':
			if (roll > 20 - reference)
				return {
					description: 'Sucesso',
					successWeight: 0,
				};
			return {
				description: 'Fracasso',
				successWeight: -1,
			};
		case '20b':
			if (roll > 20 - Math.floor(reference * 0.2))
				return {
					description: 'Extremo',
					successWeight: 2,
				};
			if (roll > 20 - Math.floor(reference * 0.5))
				return {
					description: 'Bom',
					successWeight: 1,
				};
			if (roll > 20 - reference)
				return {
					description: 'Sucesso',
					successWeight: 0,
				};
			return {
				description: 'Fracasso',
				successWeight: -1,
			};
		case '100':
			if (roll <= reference)
				return {
					description: 'Sucesso',
					successWeight: 0,
				};
			return {
				description: 'Fracasso',
				successWeight: -1,
			};
		case '100b':
			if (roll <= Math.floor(reference * 0.2))
				return {
					description: 'Extremo',
					successWeight: 2,
				};
			if (roll <= Math.floor(reference * 0.5))
				return {
					description: 'Bom',
					successWeight: 1,
				};
			if (roll <= reference)
				return {
					description: 'Sucesso',
					successWeight: 0,
				};
			return {
				description: 'Fracasso',
				successWeight: -1,
			};
		default:
			return {
				description: 'Unkown',
				successWeight: 0,
			};
	}
}

export default sessionAPI(handler);
