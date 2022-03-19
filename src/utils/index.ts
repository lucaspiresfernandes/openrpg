import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Socket as NetSocket, Server as NetServer } from 'net';
import { Equipment, Player, Skill, Spell } from '@prisma/client';

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

type SocketPlayerEquipment = {
    Equipment: Equipment;
    currentAmmo: number | null;
}

type SocketPlayerItem = {
    Item: {
        id: number;
        name: string;
        description: string;
        weight: number;
    };
    currentDescription: string;
    quantity: number;
}

type SocketEquipment = {
    name: string;
    type: string;
    damage: string;
    range: string;
    attacks: string;
    ammo: number | null;
    id: number;
};

export interface ServerToClientEvents {
    //Admin Events
    attributeStatusChange: (playerID: number, attStatusID: number, value: boolean) => void;
    infoChange: (playerID: number, infoID: number, value: string) => void;
    attributeChange: (playerID: number, attributeID: number, value: number | null, maxValue: number | null) => void;
    specChange: (playerID: number, specID: number, value: string) => void;
    characteristicChange: (playerID: number, characteristicID: number, value: number) => void;
    equipmentAdd: (playerID: number, equipment: SocketPlayerEquipment) => void;
    equipmentRemove: (playerID: number, id: number) => void;
    itemAdd: (playerID: number, item: SocketPlayerItem) => void;
    itemRemove: (playerID: number, id: number) => void;
    itemChange: (playerID: number, itemID: number, currentDescription: string | null, quantity: number | null) => void;
    currencyChange: (playerID: number, currencyID: number, value: string) => void;

    //Player Events
    playerDelete: () => void;
    playerSkillChange: (id: number, name: string, specialization: { name: string } | null) => void;
    playerEquipmentAdd: (id: number, name: string) => void;
    playerEquipmentRemove: (id: number) => void;
    playerEquipmentChange: (id: number, equipment: SocketEquipment) => void;
    playerItemAdd: (id: number, name: string) => void;
    playerItemRemove: (id: number) => void;
    playerItemChange: (id: number, name: string) => void;
    playerSpellAdd: (id: number, name: string) => void;
    playerSpellRemove: (id: number) => void;
    playerSpellChange: (id: number, spell: Spell) => void;

    //Dice Events
    diceResult: (playerID: number, dices: ResolvedDice[], results: DiceResult[]) => void;
    diceRoll: () => void;

    //Portrait Events
    configChange: (key: string, newValue: string) => void;
}

export interface ClientToServerEvents {
    roomJoin: (room: string) => void;
}