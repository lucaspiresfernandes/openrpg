import { createContext } from 'react';
import { SocketIO } from '../hooks/useSocket';
import { DiceResult, ResolvedDice } from '../utils/dice';

export const ErrorLogger = createContext<(err: any) => void>(() => {});
export const ShowDiceResult = createContext<
	(
		dices: ResolvedDice[],
		resolverKey?: string,
		onResult?: (result: DiceResult[]) => void
	) => void
>(() => {});
export const Socket = createContext<SocketIO | null>(null);
