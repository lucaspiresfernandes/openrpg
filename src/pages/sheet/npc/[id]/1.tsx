import type { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ApplicationHead from '../../../../components/ApplicationHead';
import DataContainer from '../../../../components/DataContainer';
import ErrorToastContainer from '../../../../components/ErrorToastContainer';
import PlayerAttributeContainer from '../../../../components/Player/PlayerAttributeContainer';
import PlayerCharacteristicContainer from '../../../../components/Player/PlayerCharacteristicContainer';
import PlayerEquipmentContainer from '../../../../components/Player/PlayerEquipmentContainer';
import PlayerInfoContainer from '../../../../components/Player/PlayerInfoContainer';
import PlayerItemContainer from '../../../../components/Player/PlayerItemContainer';
import PlayerSkillContainer from '../../../../components/Player/PlayerSkillContainer';
import PlayerSpellContainer from '../../../../components/Player/PlayerSpellContainer';
import { ErrorLogger, Socket } from '../../../../contexts';
import useSocket from '../../../../hooks/useSocket';
import useToast from '../../../../hooks/useToast';
import type { InferSSRProps } from '../../../../utils';
import api from '../../../../utils/api';
import type { DiceConfig, PortraitConfig } from '../../../../utils/config';
import prisma from '../../../../utils/database';
import { sessionSSR } from '../../../../utils/session';

type PageProps = InferSSRProps<typeof getSSP>;

export default function Page(props: PageProps) {
	return (
		<>
			<ApplicationHead title='Ficha do Personagem' />
			<PlayerSheet {...props} />
		</>
	);
}

function PlayerSheet(props: PageProps) {
	const [toasts, addToast] = useToast();
	const socket = useSocket(`player${props.player.id}`);

	useEffect(() => {
		if (!socket) return;
		socket.on('playerDelete', () => api.delete('/player').then(() => Router.push('/')));
		return () => {
			socket.off('playerDelete');
		};
	}, [socket]);

	if (!socket)
		return (
			<Container className='text-center'>
				<Row className='align-items-center' style={{ height: '90vh' }}>
					<Col>
						<Spinner animation='border' variant='secondary' />
					</Col>
				</Row>
			</Container>
		);

	const chars = props.diceConfig.characteristic.enable_modifiers
		? props.player.PlayerCharacteristic
		: props.player.PlayerCharacteristic.map((char) => ({
				...char,
				modifier: null,
		  }));

	const skills = props.diceConfig.skill.enable_modifiers
		? props.player.PlayerSkill
		: props.player.PlayerSkill.map((skill) => ({
				...skill,
				modifier: null,
		  }));

	return (
		<>
			<ErrorLogger.Provider value={addToast}>
				<Socket.Provider value={socket}>
					<Container>
						<Row className='display-5 text-center'>
							<Col>Ficha do Personagem</Col>
						</Row>
						<Row className='mb-3'>
							<PlayerInfoContainer
								title='Detalhes Pessoais'
								playerName={props.player.name}
								playerNameShow={props.player.showName}
								playerInfo={props.player.PlayerInfo}
								playerSpec={props.player.PlayerSpec}
								npcId={props.player.id}
							/>
							<Col>
								<PlayerAttributeContainer
									playerAttributes={props.player.PlayerAttributes}
									attributeDiceConfig={props.diceConfig.attribute}
									playerAttributeStatus={props.player.PlayerAttributeStatus}
									playerAvatars={props.player.PlayerAvatar}
									portraitAttributes={props.portraitAttributes}
									npcId={props.player.id}
								/>
							</Col>
						</Row>
						<Row className='mb-3'>
							<DataContainer outline title='Características'>
								<PlayerCharacteristicContainer
									playerCharacteristics={chars}
									characteristicDiceConfig={
										props.diceConfig.characteristic || props.diceConfig.base
									}
									npcId={props.player.id}
								/>
							</DataContainer>
						</Row>
						<Row className='mb-3'>
							<PlayerEquipmentContainer
								title='Combate'
								availableEquipments={props.availableEquipments}
								playerEquipments={props.player.PlayerEquipment}
								npcId={props.player.id}
							/>
						</Row>
						<Row className='mb-3'>
							<PlayerSkillContainer
								title='Perícias'
								playerSkills={skills}
								availableSkills={props.availableSkills}
								skillDiceConfig={props.diceConfig.skill || props.diceConfig.base}
								automaticMarking={props.automaticMarking}
								npcId={props.player.id}
							/>
						</Row>
						<Row className='mb-3'>
							<PlayerItemContainer
								title='Itens'
								playerItems={props.player.PlayerItem}
								availableItems={props.availableItems}
								playerMaxLoad={props.player.maxLoad}
								playerCurrency={props.player.PlayerCurrency}
								npcId={props.player.id}
							/>
						</Row>
						<Row className='mb-3'>
							<PlayerSpellContainer
								title='Magias'
								playerSpells={props.player.PlayerSpell.map((sp) => sp.Spell)}
								availableSpells={props.availableSpells}
								playerMaxSlots={props.player.spellSlots}
								npcId={props.player.id}
							/>
						</Row>
					</Container>
				</Socket.Provider>
			</ErrorLogger.Provider>
			<ErrorToastContainer toasts={toasts} />
		</>
	);
}

async function getSSP(ctx: GetServerSidePropsContext) {
	const player = ctx.req.session.player;

	if (!player || !player.admin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const npcId = parseInt(ctx.query.id as string);

	const results = await prisma.$transaction([
		prisma.player.findUnique({
			where: { id: npcId },
			select: {
				id: true,
				name: true,
				showName: true,
				maxLoad: true,
				spellSlots: true,
				PlayerInfo: { select: { Info: true, value: true } },
				PlayerAvatar: { select: { AttributeStatus: true, link: true } },
				PlayerAttributes: {
					select: { Attribute: true, value: true, maxValue: true, show: true },
				},
				PlayerAttributeStatus: { select: { AttributeStatus: true, value: true } },
				PlayerSpec: { select: { Spec: true, value: true } },
				PlayerCharacteristic: {
					select: { Characteristic: true, value: true, modifier: true },
				},
				PlayerEquipment: { select: { Equipment: true, currentAmmo: true } },
				PlayerSkill: {
					select: {
						Skill: {
							select: {
								id: true,
								name: true,
								Specialization: { select: { name: true } },
							},
						},
						value: true,
						checked: true,
						modifier: true,
					},
				},
				PlayerCurrency: { select: { value: true, Currency: true } },
				PlayerItem: { select: { Item: true, currentDescription: true, quantity: true } },
				PlayerSpell: { select: { Spell: true } },
			},
		}),
		prisma.equipment.findMany({
			where: { visible: true, PlayerEquipment: { none: { player_id: npcId } } },
		}),
		prisma.skill.findMany({
			where: { PlayerSkill: { none: { player_id: npcId } } },
			select: {
				id: true,
				name: true,
				Specialization: {
					select: {
						name: true,
					},
				},
			},
		}),
		prisma.item.findMany({
			where: { visible: true, PlayerItem: { none: { player_id: npcId } } },
		}),
		prisma.spell.findMany({
			where: { visible: true, PlayerSpell: { none: { player_id: npcId } } },
		}),
		prisma.config.findUnique({ where: { name: 'dice' } }),
		prisma.config.findUnique({ where: { name: 'enable_automatic_markers' } }),
		prisma.config.findUnique({ where: { name: 'portrait' } }),
	]);

	if (!results[0]) {
		ctx.req.session.destroy();
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			player: results[0],
			availableEquipments: results[1],
			availableSkills: results[2],
			availableItems: results[3],
			availableSpells: results[4],
			diceConfig: JSON.parse(results[5]?.value || 'null') as DiceConfig,
			automaticMarking: results[6]?.value === 'true' ? true : false,
			portraitAttributes: JSON.parse(results[7]?.value || 'null') as PortraitConfig,
		},
	};
}
export const getServerSideProps = sessionSSR(getSSP);
