import type { Equipment, Item, Spell } from '@prisma/client';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { NextApiResponse } from 'next';
import type { Server as SocketIOServer } from 'socket.io';
import type { DiceResult, ResolvedDice } from './dice';

export type PlayerAttributeStatusChangeEvent = (
	playerId: number,
	attStatusId: number,
	value: boolean
) => void;

export type PlayerInfoChangeEvent = (
	playerId: number,
	infoId: number,
	value: string
) => void;

export type PlayerAttributeChangeEvent = (
	playerId: number,
	attributeId: number,
	value: number | null,
	maxValue: number | null,
	show: boolean | null
) => void;

export type PlayerSpecChangeEvent = (
	playerId: number,
	specId: number,
	value: string
) => void;

export type PlayerCurrencyChangeEvent = (
	playerId: number,
	currencyId: number,
	value: string
) => void;

export type PlayerEquipmentAddEvent = (
	playerId: number,
	equipment: Equipment
) => void;

export type PlayerEquipmentRemoveEvent = (playerId: number, id: number) => void;

export type PlayerItemAddEvent = (
	playerId: number,
	item: Item,
	currentDescription: string,
	quantity: number
) => void;

export type PlayerItemRemoveEvent = (playerId: number, id: number) => void;

export type PlayerItemChangeEvent = (
	playerId: number,
	itemID: number,
	currentDescription: string | null,
	quantity: number | null
) => void;

export type PlayerMaxLoadChangeEvent = (playerId: number, newLoad: number) => void;

export type ConfigChangeEvent = (name: string, newValue: string) => void;

export type PlayerDeleteEvent = () => void;

export type SkillAddEvent = (
	id: number,
	name: string,
	specializationName: string | null
) => void;

export type SkillRemoveEvent = (id: number) => void;

export type SkillChangeEvent = (
	id: number,
	name: string,
	specializationName: string | null
) => void;

export type EquipmentAddEvent = (id: number, name: string) => void;

export type EquipmentRemoveEvent = (id: number, hardRemove: boolean) => void;

export type EquipmentChangeEvent = (equipment: Equipment) => void;

export type ItemAddEvent = (id: number, name: string) => void;

export type ItemRemoveEvent = (id: number, hardRemove: boolean) => void;

export type ItemChangeEvent = (id: number, name: string) => void;

export type SpellAddEvent = (id: number, name: string) => void;

export type SpellRemoveEvent = (id: number, hardRemove: boolean) => void;

export type SpellChangeEvent = (id: number, spell: Spell) => void;

export type DiceRollEvent = () => void;

export type DiceResultEvent = (
	playerId: number,
	results: DiceResult[],
	dices: ResolvedDice[]
) => void;

export interface ServerToClientEvents {
	//---------- Player-triggered Events ----------
	playerAttributeStatusChange: PlayerAttributeStatusChangeEvent;
	playerInfoChange: PlayerInfoChangeEvent;
	playerAttributeChange: PlayerAttributeChangeEvent;
	playerSpecChange: PlayerSpecChangeEvent;
	playerCurrencyChange: PlayerCurrencyChangeEvent;
	playerEquipmentAdd: PlayerEquipmentAddEvent;
	playerEquipmentRemove: PlayerEquipmentRemoveEvent;
	playerItemAdd: PlayerItemAddEvent;
	playerItemRemove: PlayerItemRemoveEvent;
	playerItemChange: PlayerItemChangeEvent;
	playerMaxLoadChange: PlayerMaxLoadChangeEvent;

	//---------- Admin-triggered Events ----------
	configChange: ConfigChangeEvent;
	playerDelete: PlayerDeleteEvent;
	skillAdd: SkillAddEvent;
	skillRemove: SkillRemoveEvent;
	skillChange: SkillChangeEvent;
	equipmentAdd: EquipmentAddEvent;
	equipmentRemove: EquipmentRemoveEvent;
	equipmentChange: EquipmentChangeEvent;
	itemAdd: ItemAddEvent;
	itemRemove: ItemRemoveEvent;
	itemChange: ItemChangeEvent;
	spellAdd: SpellAddEvent;
	spellRemove: SpellRemoveEvent;
	spellChange: SpellChangeEvent;

	//---------- Dice-triggered Events ----------
	diceRoll: DiceRollEvent;
	diceResult: DiceResultEvent;
}

export interface ClientToServerEvents {
	roomJoin: (room: string) => void;
}

export type NextApiResponseServerIO<T = any> = NextApiResponse<T> & {
	socket: NetSocket & {
		server: HTTPServer & {
			io?: SocketIOServer<ServerToClientEvents>;
		};
	};
};
