import { Player } from '@prisma/client';
import { NextApiRequest } from 'next';
import prisma from '../../utils/database';
import database from '../../utils/database';
import { hash } from '../../utils/encryption';
import { sessionAPI } from '../../utils/session';
import { NextApiResponseServerIO } from '../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'POST') return handlePost(req, res);
  res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
  const serverAdminKey = (await prisma.config.findUnique({ where: { name: 'admin_key' } }))?.value as string;

  const username = req.body.username;
  const plainPassword = req.body.password;
  const adminKey = req.body.adminKey;

  if (!username || !plainPassword) {
    res.status(400).send({ message: 'Usuário ou senha está em branco.' });
    return;
  }

  const user = await database.player.findFirst({ where: { username } });

  if (user) {
    res.status(401).send({ message: 'Usuário já existe.' });
    return;
  }

  let isAdmin = false;
  if (adminKey) {
    if (adminKey === serverAdminKey) {
      isAdmin = true;
    }
    else {
      res.status(401).send({ message: 'Chave do administrador incorreta.' });
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
    database.skill.findMany({ where: { mandatory: true } }),
    database.extraInfo.findMany(),
    database.currency.findMany()
  ]);

  const playerAvatarData: {
    player_id: number,
    attribute_status_id: number | null,
    link: null,
  }[] = results[2].map(attrStatus => {
    return {
      player_id: player.id,
      attribute_status_id: attrStatus.id,
      link: null
    };
  });
  playerAvatarData.push({ player_id: player.id, attribute_status_id: null, link: null });

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
          value: 0,
          modifier: '+0'
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
    }),
    database.playerAvatar.createMany({
      data: playerAvatarData,
    }),
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