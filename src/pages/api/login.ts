import { NextApiRequest, NextApiResponse } from 'next';
import { sessionAPI } from '../../utils/session';
import database from '../../utils/database';
import { compare } from '../../utils/encryption';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return handlePost(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const username = req.body.username;
  const plainPassword = req.body.password;

  if (!username || !plainPassword) {
    res.status(401).send({ message: 'Username or password is blank.' });
    return;
  }

  const user = await database.player.findFirst({ where: { username } });

  if (!user) {
    res.status(401).send({ message: 'Username or password is incorrect.' });
    return;
  }

  const isValidPassword = compare(plainPassword, user.password);

  if (!isValidPassword) {
    res.status(401).send({ message: 'Username or password is incorrect.' });
    return;
  }

  req.session.player = {
    id: user.id,
    admin: user.role === 'ADMIN'
  };
  await req.session.save();

  res.end();
}

export default sessionAPI(handler);