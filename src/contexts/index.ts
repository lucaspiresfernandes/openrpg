import { createContext } from 'react';
import type { SocketIO } from '../hooks/useSocket';

export const ErrorLogger = createContext<(err: any) => void>(() => {});
export const Socket = createContext<SocketIO>(undefined as any);
