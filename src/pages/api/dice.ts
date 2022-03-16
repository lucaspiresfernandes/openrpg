import { NextApiRequest } from 'next';
import RandomOrg from 'random-org';
import { sessionAPI } from '../../utils/session';
const random = new RandomOrg({ apiKey: process.env.RANDOM_ORG_KEY || 'unkown' });
import config from '../../../openrpg.config.json';
import { DiceResult, NextApiResponseServerIO, ResolvedDice } from '../../utils';

type ResolverKey = '20' | '20b' | '100' | '100b';

async function nextInt(min: number, max: number, n: number) {
    try { return (await random.generateIntegers({ min, max, n })).random; }
    catch (err) { console.error('Random.org inactive or apiKey is not defined.'); }

    let data = [];

    min = Math.ceil(min);
    max = Math.floor(max);

    for (let i = 0; i < n; i++)
        data.push(Math.floor(Math.random() * (max - min + 1) + min));

    return { data };
}

async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'POST') {
        res.status(404).end();
        return;
    }

    const player = req.session.player;

    if (!player) {
        res.status(401).end();
        return;
    }

    const dices: ResolvedDice[] = req.body.dices;
    const resolverKey: ResolverKey | undefined = req.body.resolverKey || undefined;

    if (!dices) {
        res.status(400).end();
        return;
    }

    const io = res.socket.server.io;

    io?.to(`portrait${player.id}`).emit('diceRoll');

    const results = new Array<DiceResult>(dices.length);

    try {
        await Promise.all(dices.map((dice, index) => {
            const numDices = dice.num;
            const diceRoll = dice.roll;
            const reference = dice.ref;

            if (isNaN(numDices) || isNaN(diceRoll))
                throw new Error();

            if (numDices === 0 || diceRoll < 1) {
                results[index] = { roll: diceRoll };
                return;
            }

            if (diceRoll === 1) {
                results[index] = { roll: numDices };
                return;
            }

            return nextInt(numDices, numDices * diceRoll, 1).then(result => {
                const roll = result.data.reduce((a, b) => a + b, 0);
                results[index] = { roll };

                if (!config.success_types.use_success_types || !resolverKey || reference === undefined) return;

                results[index].description = resolveSuccessType(resolverKey, reference, roll);
            });
        }));
        res.send({ results });

        if (!player.admin) io?.to('admin').emit('diceResult', player.id, dices, results);

        if (results.length === 1) io?.to(`portrait${player.id}`).emit('diceResult', player.id, [], results);
        else if (results.length > 1) {
            const _results = results.reduce((prev, cur) => { return { roll: prev.roll + cur.roll }; }, { roll: 0 });
            io?.to(`portrait${player.id}`).emit('diceResult', player.id, [], [{ roll: _results.roll }]);
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).end();
    }
}

const successTypes = config.success_types;
function resolveSuccessType(key: ResolverKey, reference: number, roll: number) {
    switch (key) {
        case '20':
            if (roll > 20 - reference) return successTypes.success;
            return successTypes.failure;
        case '20b':
            if (roll == 1) return successTypes.failure;
            if (roll > 20 - Math.floor(reference * 0.2)) return successTypes.extreme;
            if (roll > 20 - Math.floor(reference * 0.5)) return successTypes.hard;
            if (roll > 20 - reference) return successTypes.success;
            return successTypes.failure;
        case '100':
            if (roll <= reference) return successTypes.success;
            return successTypes.failure;
        case '100b':
            if (roll === 100) return successTypes.failure;
            if (roll === 1) return successTypes.success;
            if (roll <= Math.floor(reference * 0.2)) return successTypes.extreme;
            if (roll <= Math.floor(reference * 0.5)) return successTypes.hard;
            if (roll <= reference) return successTypes.success;
            return successTypes.failure;
        default:
            return 'Unkown';
    }
}

export default sessionAPI(handler);