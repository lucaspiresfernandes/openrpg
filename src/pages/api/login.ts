import { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../utils/session/options';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  //TODO: validate user from database.

  req.session.user = {
    id: 0,
    admin: true
  };
  await req.session.save();
  res.end();
}

function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.end();
}

export default sessionAPI(handler);