import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Socket as NetSocket, Server as NetServer } from 'net';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Equipment, Player, Skill } from '@prisma/client';

export function clamp(num: number, min: number, max: number) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export type ResolvedDice = {
    num: number
    roll: number
    ref?: number
}

export type DiceResult = {
    roll: number
    description?: string
}

type ResolveDiceOptions = {
    bonusDamage?: string
}

export function resolveDices(dices: string, diceOptions?: ResolveDiceOptions): ResolvedDice[] | undefined {
    const bonusDamage = diceOptions?.bonusDamage || '0';
    const formattedDices = dices.trim().toLowerCase();
    const options = formattedDices.split('/');
    if (options.length > 1) {
        const selected = prompt('Escolha dentre as seguintes opções de rolagem:\n' +
            options.map((opt, i) => `${i + 1}: ${opt}`).join('\n'));

        if (!selected) return;

        const code = parseInt(selected);

        if (isNaN(code) || code < 1 || code > options.length) return;

        return resolveDices(options[code - 1]);
    }

    const diceArray = formattedDices.split('+');
    const resolvedDices: ResolvedDice[] = [];

    for (let i = 0; i < diceArray.length; i++)
        resolvedDices.push(resolveDice(diceArray[i], bonusDamage));

    return resolvedDices;
}

function resolveDice(dice: string, bonusDamage: string = '0'): ResolvedDice {
    if (dice.includes('db/')) {
        const divider = parseInt(dice.split('/')[1]) || 1;

        const split = bonusDamage.split('d');

        let _dice = `${split[0]}d${Math.round(parseInt(split[1]) / divider)}`;

        if (split.length === 1)
            _dice = Math.round(parseInt(split[0]) / divider).toString();

        return resolveDice(_dice);
    }
    if (dice.includes('db')) return resolveDice(bonusDamage);

    const split = dice.split('d');
    if (split.length === 1) return { num: 0, roll: parseInt(dice) };
    return { num: parseInt(split[0]), roll: parseInt(split[1]) };
}

export type NextApiResponseServerIO<T = any> = NextApiResponse<T> & {
    socket: NetSocket & {
        server: NetServer & {
            io?: SocketIOServer<ServerToClientEvents>;
        };
    };
};

type SocketEquipment = {
    Equipment: Equipment & {
        Skill: Skill;
    };
    currentAmmo: number | null;
    using: boolean;
}

type SocketItem = {
    Item: {
        id: number;
        name: string;
        description: string;
    };
    currentDescription: string;
    quantity: number;
}

export interface ServerToClientEvents {
    //Admin Events
    attributeStatusChange: (playerID: number, attStatusID: number, value: boolean) => void;
    infoChange: (playerID: number, infoID: number, value: string) => void;
    attributeChange: (playerID: number, attributeID: number, value: number | null, maxValue: number | null) => void;
    specChange: (playerID: number, specID: number, value: string) => void;
    characteristicChange: (playerID: number, characteristicID: number, value: number) => void;
    equipmentAdd: (playerID: number, equipment: SocketEquipment) => void;
    equipmentRemove: (playerID: number, id: number) => void;
    itemAdd: (playerID: number, item: SocketItem) => void;
    itemRemove: (playerID: number, id: number) => void;
    itemChange: (playerID: number, itemID: number, currentDescription: string | null, quantity: number | null) => void;

    //Player Events
    playerDelete: () => void;

    //Dice Events
    diceResult: (playerID: number, dices: ResolvedDice[], results: DiceResult[]) => void;
    diceRoll: () => void;
}

export interface ClientToServerEvents {
    roomJoin: (room: string) => void;
}