import { NextApiRequest, NextApiResponse } from 'next';
import database from '../../utils/database';
import { sessionAPI } from '../../utils/session';
import { hash } from '../../utils/encryption';
import config from '../../../openrpg.config.json';
import { Player } from '@prisma/client';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return handlePost(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const username = req.body.username as string;
  const plainPassword = req.body.password as string;
  const adminKey = req.body.adminKey as string;

  if (!username || !plainPassword) {
    res.status(401).send({ message: 'Username or password is blank.' });
    return;
  }

  const user = await database.player.findFirst({ where: { username } });

  if (user) {
    res.status(401).send({ message: 'Username already exists.' });
    return;
  }

  let isAdmin = false;
  if (adminKey) {
    if (adminKey === config.admin_key) {
      isAdmin = true;
    }
    else {
      res.status(401).send({ message: 'Admin key is incorrect.' });
      return;
    }
  }

  const hashword = hash(plainPassword);

  const player = await database.player.create({
    data: {
      username,
      password: hashword,
      role: isAdmin ? 'ADMIN' : 'PLAYER'
    }
  });

  if (isAdmin) await registerAdminData(player);
  else await registerPlayerData(player);

  req.session.player = {
    id: player.id,
    admin: isAdmin
  };
  await req.session.save();

  res.json({ id: player.id });
}

async function registerPlayerData(player: Player) {
  const results = await Promise.all([
    database.info.findMany(),
  ]);

  const infos = results[0];

  await Promise.all([
    //Player Info
    database.playerInfo.createMany({
      data: infos.map(info => {
        return {
          info_id: info.id,
          player_id: player.id,
          value: ''
        };
      })
    }),
  ]);
}

async function registerAdminData(admin: Player) {

}

export default sessionAPI(handler);