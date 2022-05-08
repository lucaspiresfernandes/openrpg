import type { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ApplicationHead from '../../components/ApplicationHead';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import PlayerAttributeContainer from '../../components/Player/PlayerAttributeContainer';
import PlayerCharacteristicContainer from '../../components/Player/PlayerCharacteristicContainer';
import PlayerEquipmentContainer from '../../components/Player/PlayerEquipmentContainer';
import PlayerInfoField from '../../components/Player/PlayerInfoField';
import PlayerItemContainer from '../../components/Player/PlayerItemContainer';
import PlayerSkillContainer from '../../components/Player/PlayerSkillContainer';
import PlayerSpecField from '../../components/Player/PlayerSpecField';
import PlayerSpellContainer from '../../components/Player/PlayerSpellContainer';
import { ErrorLogger, Socket } from '../../contexts';
import useSocket from '../../hooks/useSocket';
import useToast from '../../hooks/useToast';
import type { InferSSRProps } from '../../utils';
import api from '../../utils/api';
import type { ContainerConfig, DiceConfig } from '../../utils/config';
import prisma from '../../utils/database';
import { sessionSSR } from '../../utils/session';

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

	return (
		<>
			<ErrorLogger.Provider value={addToast}>
				<Socket.Provider value={socket}>
					<Container>
						<Row className='display-5 text-center'>
							<Col>Ficha do Personagem</Col>
						</Row>
						<Row className='mb-3'>
							<DataContainer
								outline
								title={
									props.containerConfig.find(
										(c) => c.originalName === 'Detalhes Pessoais'
									)?.name || 'Detalhes Pessoais'
								}>
								<>
									{props.player.PlayerInfo.map((info) => (
										<Row className='mb-4' key={info.Info.id}>
											<Col className='mx-2'>
												<Row>
													<label className='h5' htmlFor={`info${info.Info.id}`}>
														{info.Info.name}
													</label>
													<PlayerInfoField infoId={info.Info.id} value={info.value} />
												</Row>
											</Col>
										</Row>
									))}
									<hr />
									<Row className='justify-content-center'>
										{props.player.PlayerSpec.map((spec) => (
											<Col
												key={spec.Spec.id}
												xs={12}
												sm={6}
												lg={4}
												className='text-center mb-2'>
												<PlayerSpecField
													value={spec.value}
													specId={spec.Spec.id}
													name={spec.Spec.name}
												/>
												<label htmlFor={`spec${spec.Spec.id}`}>{spec.Spec.name}</label>
											</Col>
										))}
									</Row>
								</>
							</DataContainer>
							<Col>
								<PlayerAttributeContainer
									playerAttributes={props.player.PlayerAttributes}
									attributeDiceConfig={props.diceConfig.attribute}
									playerAttributeStatus={props.player.PlayerAttributeStatus}
									playerAvatars={props.player.PlayerAvatar}
								/>
							</Col>
						</Row>
						<Row>
							<DataContainer
								outline
								title={
									props.containerConfig.find((c) => c.originalName === 'Características')
										?.name || 'Características'
								}>
								<PlayerCharacteristicContainer
									playerCharacteristics={props.player.PlayerCharacteristic}
									characteristicDiceConfig={
										props.diceConfig.characteristic || props.diceConfig.base
									}
								/>
							</DataContainer>
						</Row>
						<Row>
							<PlayerEquipmentContainer
								availableEquipments={props.availableEquipments}
								playerEquipments={props.player.PlayerEquipment}
								title={
									props.containerConfig.find((c) => c.originalName === 'Combate')?.name ||
									'Combate'
								}
							/>
						</Row>
						<Row>
							<PlayerSkillContainer
								playerSkills={props.player.PlayerSkill}
								availableSkills={props.availableSkills}
								skillDiceConfig={props.diceConfig.skill || props.diceConfig.base}
								title={
									props.containerConfig.find((c) => c.originalName === 'Perícias')
										?.name || 'Perícias'
								}
								automaticMarking={props.automaticMarking}
							/>
						</Row>
						<Row>
							<PlayerItemContainer
								playerItems={props.player.PlayerItem}
								availableItems={props.availableItems}
								playerMaxLoad={props.player.maxLoad}
								playerCurrency={props.player.PlayerCurrency}
								title={
									props.containerConfig.find((c) => c.originalName === 'Itens')?.name ||
									'Itens'
								}
							/>
						</Row>
						<Row>
							<PlayerSpellContainer
								playerSpells={props.player.PlayerSpell.map((sp) => sp.Spell)}
								availableSpells={props.availableSpells}
								playerMaxSlots={props.player.spellSlots}
								title={
									props.containerConfig.find((c) => c.originalName === 'Magias')?.name ||
									'Magias'
								}
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

	if (!player) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const results = await prisma.$transaction([
		prisma.player.findUnique({
			where: { id: player.id },
			select: {
				id: true,
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
					},
				},
				PlayerCurrency: { select: { value: true, Currency: true } },
				PlayerItem: { select: { Item: true, currentDescription: true, quantity: true } },
				PlayerSpell: { select: { Spell: true } },
			},
		}),
		prisma.equipment.findMany({
			where: { visible: true, PlayerEquipment: { none: { player_id: player.id } } },
		}),
		prisma.skill.findMany({
			where: { PlayerSkill: { none: { player_id: player.id } } },
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
			where: { visible: true, PlayerItem: { none: { player_id: player.id } } },
		}),
		prisma.spell.findMany({
			where: { visible: true, PlayerSpell: { none: { player_id: player.id } } },
		}),
		prisma.config.findUnique({ where: { name: 'dice' } }),
		prisma.config.findUnique({ where: { name: 'container' } }),
		prisma.config.findUnique({ where: { name: 'enable_automatic_markers' } }),
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
			containerConfig: JSON.parse(results[6]?.value || '[]') as ContainerConfig,
			automaticMarking: results[7]?.value === 'true' ? true : false,
		},
	};
}
export const getServerSideProps = sessionSSR(getSSP);
