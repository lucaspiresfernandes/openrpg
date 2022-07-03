import type { NextApiRequest } from 'next';
import { sleep } from '../../utils';
import prisma from '../../utils/database';
import type {
	DiceRequest,
	DiceResolverKey,
	DiceResponse,
	DiceResponseResultType,
} from '../../utils/dice';
import { sessionAPI } from '../../utils/session';
import type { NextApiResponseServerIO } from '../../utils/socket';

function nextInt(min: number, max: number, n: number) {
	const data = [];

	min = Math.ceil(min);
	max = Math.floor(max);

	for (let i = 0; i < n; i++)
		data.push(Math.floor(Math.random() * (max - min + 1) + min));

	return data;
}

async function getRandom(min: number, max: number, n: number) {
	await sleep(nextInt(600, 1000, 1)[0]);
	return nextInt(min, max, n);
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
	const npcId: number | undefined = req.body.npcId;

	const playerId = npcId ? npcId : player.id;

	const successTypeEnabled = resolverKey
		? (
				await prisma.config.findUnique({
					where: { name: 'enable_success_types' },
				})
		  )?.value === 'true'
		: undefined;

	if (!dices) {
		res.status(400).end();
		return;
	}

	const io = res.socket.server.io;

	io?.to(`portrait${playerId}`).emit('diceRoll');

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

				return getRandom(numDices, numDices * roll, 1).then(
					(data) => (results[index] = { roll: data[0] })
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

		const data = await getRandom(1, roll, numDices);

		for (let index = 0; index < data.length; index++) {
			const result = data[index];
			results[index] = { roll: result };
			if (!reference || !successTypeEnabled) continue;
			results[index].resultType = resolveSuccessType(resolverKey, reference, result);
		}
	}

	res.send({ results });

	if (!player.admin) io?.to('admin').emit('diceResult', playerId, results, dices);
	io?.to(`portrait${playerId}`).emit('diceResult', playerId, results, dices);
}

function resolveSuccessType(
	key: DiceResolverKey | undefined,
	reference: number,
	roll: number
): DiceResponseResultType {
	if (!key)
		return {
			description: 'Unkown',
			successWeight: 0,
		};

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
