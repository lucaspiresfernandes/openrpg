import { IronSessionData } from 'iron-session';
import { useEffect } from 'react';
import api from '../utils/api';

export default function useAuthentication(onSessionReceived: (sessionData: IronSessionData['player']) => void) {
    useEffect(() => {
        api.get('/player').then(res => onSessionReceived(res.data.player));
    });
}