import { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../../utils/session';

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return;
    
}

export default sessionAPI(handler);