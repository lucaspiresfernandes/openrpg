import type { NextApiRequest } from 'next';
import prisma from '../../utils/database';
import { hash } from '../../utils/encryption';
import { sessionAPI } from '../../utils/session';
import type { NextApiResponseServerIO } from '../../utils/socket';

function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	if (req.method === 'POST') return handlePost(req, res);
	res.status(404).end();
}

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIO) {
	const username: string | undefined = req.body.username;
	const plainPassword: string | undefined = req.body.password;
	const adminKey: string | undefined = req.body.adminKey;

	if (!username || !plainPassword) {
		res.status(400).send({ message: 'Usuário ou senha está em branco.' });
		return;
	}

	const user = await prisma.player.findFirst({ where: { username } });

	if (user) {
		res.status(401).send({ message: 'Usuário já existe.' });
		return;
	}

	let isAdmin = false;
	if (adminKey) {
		isAdmin = await validateAdminKey(adminKey);
		if (!isAdmin) {
			res.status(401).send({ message: 'Chave do mestre incorreta.' });
			return;
		}
	}

	const hashword = hash(plainPassword);

	const player = await prisma.player.create({
		data: {
			username,
			password: hashword,
			role: isAdmin ? 'ADMIN' : 'PLAYER',
		},
	});

	if (isAdmin) await registerAdminData(player.id);
	else await registerPlayerData(player.id);

	req.session.player = {
		id: player.id,
		admin: isAdmin,
	};
	await req.session.save();

	res.json({ id: player.id });
}

async function validateAdminKey(key: string) {
	const admin = await prisma.player.findMany({ where: { role: 'ADMIN' } });

	if (admin.length === 0) return true;

	const serverAdminKey = (
		await prisma.config.findUnique({ where: { name: 'admin_key' } })
	)?.value as string;

	if (key === serverAdminKey) return true;
	return false;
}

export async function registerPlayerData(playerId: number) {
	const results = await prisma.$transaction([
		prisma.info.findMany({ select: { id: true } }),
		prisma.attribute.findMany({ select: { id: true } }),
		prisma.attributeStatus.findMany({ select: { id: true } }),
		prisma.spec.findMany({ select: { id: true } }),
		prisma.characteristic.findMany({ select: { id: true } }),
		prisma.skill.findMany({
			select: { id: true, startValue: true },
			where: { mandatory: true },
		}),
		prisma.extraInfo.findMany({ select: { id: true } }),
		prisma.currency.findMany({ select: { id: true } }),
	]);

	const playerAvatarData: {
		player_id: number;
		attribute_status_id: number | null;
		link: null;
	}[] = results[2].map((attrStatus) => {
		return {
			player_id: playerId,
			attribute_status_id: attrStatus.id,
			link: null,
		};
	});
	playerAvatarData.push({ player_id: playerId, attribute_status_id: null, link: null });

	await prisma.$transaction([
		prisma.playerInfo.createMany({
			data: results[0].map((info) => {
				return {
					info_id: info.id,
					player_id: playerId,
					value: '',
				};
			}),
		}),
		prisma.playerAttribute.createMany({
			data: results[1].map((attr) => {
				return {
					player_id: playerId,
					attribute_id: attr.id,
					value: 0,
					maxValue: 0,
				};
			}),
		}),
		prisma.playerAttributeStatus.createMany({
			data: results[2].map((attrStatus) => {
				return {
					player_id: playerId,
					attribute_status_id: attrStatus.id,
					value: false,
				};
			}),
		}),
		prisma.playerSpec.createMany({
			data: results[3].map((spec) => {
				return {
					player_id: playerId,
					spec_id: spec.id,
					value: '0',
				};
			}),
		}),
		prisma.playerCharacteristic.createMany({
			data: results[4].map((char) => {
				return {
					player_id: playerId,
					characteristic_id: char.id,
					value: 0,
					modifier: 0,
				};
			}),
		}),
		prisma.playerSkill.createMany({
			data: results[5].map((skill) => {
				return {
					player_id: playerId,
					skill_id: skill.id,
					value: skill.startValue,
					checked: false,
					modifier: 0,
				};
			}),
		}),
		prisma.playerExtraInfo.createMany({
			data: results[6].map((extraInfo) => {
				return {
					player_id: playerId,
					extra_info_id: extraInfo.id,
					value: '',
				};
			}),
		}),
		prisma.playerCurrency.createMany({
			data: results[7].map((curr) => {
				return {
					player_id: playerId,
					currency_id: curr.id,
					value: '',
				};
			}),
		}),
		prisma.playerNote.create({
			data: {
				player_id: playerId,
				value: '',
			},
		}),
		prisma.playerAvatar.createMany({
			data: playerAvatarData,
		}),
	]);
}

function registerAdminData(adminId: number) {
	return prisma.playerNote.create({
		data: {
			player_id: adminId,
			value: '',
		},
	});
}

export default sessionAPI(handler);
