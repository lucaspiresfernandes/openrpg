import { NextApiRequest } from 'next';
import database from '../../utils/database';
import { sessionAPI } from '../../utils/session';
import { hash } from '../../utils/encryption';
import config from '../../../openrpg.config.json';
import { Player } from '@prisma/client';
import { NextApiResponseServerIO } from '../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'POST') return handlePost(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
  const username = req.body.username as string;
  const plainPassword = req.body.password as string;
  const adminKey = req.body.adminKey as string;

  if (!username || !plainPassword) {
    res.status(400).send({ message: 'Username or password is blank.' });
    return;
  }

  const user = await database.player.findFirst({ where: { username } });

  if (user) {
    res.status(401).send({ message: 'Username already exists.' });
    return;
  }

  let isAdmin = false;
  if (adminKey) {
    if (adminKey === config.player.admin_key) {
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
    database.attribute.findMany(),
    database.attributeStatus.findMany(),
    database.spec.findMany(),
    database.characteristic.findMany(),
    database.skill.findMany(),
    database.extraInfo.findMany(),
    database.currency.findMany()
  ]);

  await Promise.all([
    database.playerInfo.createMany({
      data: results[0].map(info => {
        return {
          info_id: info.id,
          player_id: player.id,
          value: ''
        };
      })
    }),
    database.playerAttribute.createMany({
      data: results[1].map(attr => {
        return {
          player_id: player.id,
          attribute_id: attr.id,
          value: 0,
          maxValue: 0
        };
      })
    }),
    database.playerAttributeStatus.createMany({
      data: results[2].map(attrStatus => {
        return {
          player_id: player.id,
          attribute_status_id: attrStatus.id,
          value: false
        };
      })
    }),
    database.playerSpec.createMany({
      data: results[3].map(spec => {
        return {
          player_id: player.id,
          spec_id: spec.id,
          value: '0'
        };
      })
    }),
    database.playerCharacteristic.createMany({
      data: results[4].map(char => {
        return {
          player_id: player.id,
          characteristic_id: char.id,
          value: 0
        };
      })
    }),
    database.playerSkill.createMany({
      data: results[5].map(skill => {
        return {
          player_id: player.id,
          skill_id: skill.id,
          value: 0
        };
      })
    }),
    database.playerExtraInfo.createMany({
      data: results[6].map(extraInfo => {
        return {
          player_id: player.id,
          extra_info_id: extraInfo.id,
          value: ''
        };
      })
    }),
    database.playerCurrency.createMany({
      data: results[7].map(curr => {
        return {
          player_id: player.id,
          currency_id: curr.id,
          value: ''
        };
      })
    }),
    database.playerNote.create({
      data: {
        player_id: player.id,
        value: ''
      }
    })
  ]);
}

function registerAdminData(admin: Player): Promise<any> {
  return database.playerNote.create({
    data: {
      player_id: admin.id,
      value: ''
    }
  });
}

export default sessionAPI(handler);