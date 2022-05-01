import type { IronSessionData } from 'iron-session';
import { useEffect } from 'react';
import api from '../utils/api';

export default function useAuthentication(
	onPlayerReceived: (sessionData: IronSessionData['player']) => void
) {
	useEffect(() => {
		api.get('/player').then((res) => onPlayerReceived(res.data.player));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
