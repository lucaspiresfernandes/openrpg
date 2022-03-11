import { createContext } from 'react';
import { SocketIO } from '../hooks/useSocket';
import { ResolvedDice } from '../utils';

export const ErrorLogger = createContext<(err: any) => void>(() => { });
export const ShowDiceResult = createContext<(dices: string | ResolvedDice[], resolverKey?: string) => void>(() => { });
export const RetrieveSocket = createContext<SocketIO | null>(null);