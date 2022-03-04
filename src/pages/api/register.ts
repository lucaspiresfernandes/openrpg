import { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../utils/session/options';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return handlePost(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  
}

export default sessionAPI(handler);