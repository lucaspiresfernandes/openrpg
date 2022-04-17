import { Equipment, Spell } from '@prisma/client';
import { Server as NetServer, Socket as NetSocket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { DiceResult, ResolvedDice } from '.';

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
    maxLoadChange: (playerID: number, newLoad: number) => void;
    attributeStatusChange: (playerID: number, attStatusID: number, value: boolean) => void;
    infoChange: (playerID: number, infoID: number, value: string) => void;
    attributeChange: (playerID: number, attributeID: number, value: number | null, maxValue: number | null) => void;
    specChange: (playerID: number, specID: number, value: string) => void;
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
    playerEquipmentRemove: (id: number, hardRemove: boolean) => void;
    playerEquipmentChange: (id: number, equipment: SocketEquipment) => void;
    playerItemAdd: (id: number, name: string) => void;
    playerItemRemove: (id: number, hardRemove: boolean) => void;
    playerItemChange: (id: number, name: string) => void;
    playerSpellAdd: (id: number, name: string) => void;
    playerSpellRemove: (id: number, hardRemove: boolean) => void;
    playerSpellChange: (id: number, spell: Spell) => void;

    //Dice Events
    diceResult: (playerID: number, results: DiceResult[], dices: ResolvedDice[]) => void;
    diceRoll: () => void;

    //Portrait Events
    configChange: (name: string, newValue: string) => void;
}

export interface ClientToServerEvents {
    roomJoin: (room: string) => void;
}

export type NextApiResponseServerIO<T = any> = NextApiResponse<T> & {
    socket: NetSocket & {
        server: NetServer & {
            io?: SocketIOServer<ServerToClientEvents>;
        };
    };
};