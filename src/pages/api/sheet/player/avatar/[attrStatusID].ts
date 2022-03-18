import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../../../utils/api';
import { getImageURL } from '../../../../../utils/image';
import { sessionAPI } from '../../../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(404).end();
        return;
    }

    const playerID = req.session.player?.id || parseInt(req.query.playerID as string);
    const statusID: number = parseInt(req.query.attrStatusID as string) || 0;
    if (!playerID) {
        res.status(401).end();
        return;
    }

    try {
        const url = getImageURL(playerID, statusID);
        const response = await api.get(url, { responseType: 'arraybuffer', timeout: 1000 });
        res.setHeader('content-type', response.headers['content-type']);
        res.end(response.data, 'binary');
    }
    catch (err) {
        res.status(404).end();
    }
}

export default sessionAPI(handler);