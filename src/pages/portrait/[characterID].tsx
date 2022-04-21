import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PortraitAvatarContainer, { PortraitAttributeStatus } from '../../components/Portrait/PortraitAvatarContainer';
import PortraitDiceContainer from '../../components/Portrait/PortraitDiceContainer';
import PortraitEnvironmentalContainer from '../../components/Portrait/PortraitEnvironmentalContainer';
import PortraitSideAttributeContainer, { PortraitSideAttribute } from '../../components/Portrait/PortraitSideAttributeContainer';
import useSocket, { SocketIO } from '../../hooks/useSocket';
import { Environment, PortraitConfig, PortraitOrientation } from '../../utils/config';
import prisma from '../../utils/database';

export default function CharacterPortrait(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const [socket, setSocket] = useState<SocketIO | null>(null);

	useSocket((socket) => {
		setSocket(socket);
		socket.emit('roomJoin', `portrait${props.playerId}`);
	});

	useEffect(() => {
		document.body.style.backgroundColor = 'transparent';
		document.body.style.color = 'black';
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (props.notFound) return <h1>Personagem não existe.</h1>;

	if (!socket)
		return (
			<Row className='text-center align-items-center w-100' style={{ height: '100vh' }}>
				<Col>
					<h1>Carregando Retrato...</h1>
				</Col>
			</Row>
		);

	return (
		<>
			<PortraitDiceRollContainer
				playerId={props.playerId}
				attributeStatus={props.attributeStatus}
				sideAttribute={props.sideAttribute}
				orientation={props.orientation}
				diceColor={props.diceColor}
				socket={socket}
			/>
			<PortraitEnvironmentalContainer
				attributes={props.attributes}
				environment={props.environment}
				orientation={props.orientation}
				playerId={props.playerId}
				playerName={props.playerName}
				socket={socket}
			/>
		</>
	);
}

function PortraitDiceRollContainer(props: {
	playerId: number;
	attributeStatus: PortraitAttributeStatus;
	sideAttribute: PortraitSideAttribute;
	orientation: PortraitOrientation;
	diceColor: string;
	socket: SocketIO | null;
}) {
	const [showDice, setShowDice] = useState(false);

	return (
		<>
			<div className={`${showDice ? 'show ' : ''}shadow`}>
				<PortraitAvatarContainer
					playerId={props.playerId}
					attributeStatus={props.attributeStatus}
					socket={props.socket}
				/>
				<PortraitSideAttributeContainer
					sideAttribute={props.sideAttribute}
					orientation={props.orientation}
					socket={props.socket}
				/>
			</div>
			<PortraitDiceContainer
				playerId={props.playerId}
				color={props.diceColor}
				socket={props.socket}
				showDice={showDice}
				onShowDice={() => setShowDice(true)}
				onHideDice={() => setShowDice(false)}
			/>
		</>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const player_id = parseInt(ctx.query.characterID as string);
	const diceColor = (ctx.query.dicecolor as string) || 'ddaf0f';

	const portraitConfig = JSON.parse(
		(await prisma.config.findUnique({ where: { name: 'portrait' } }))?.value || 'null'
	) as PortraitConfig;

	const results = await prisma.$transaction([
		prisma.config.findUnique({ where: { name: 'environment' } }),
		prisma.player.findUnique({
			where: { id: player_id },
			select: {
				PlayerAttributes: {
					where: {
						Attribute: {
							id: { in: [...portraitConfig.attributes, portraitConfig.side_attribute] },
						},
					},
					select: {
						value: true,
						maxValue: true,
						Attribute: { select: { id: true, name: true, color: true } },
					},
				},
				PlayerAttributeStatus: {
					select: { value: true, attribute_status_id: true },
				},
				PlayerInfo: {
					where: { Info: { name: 'Nome' } },
					select: { value: true, info_id: true },
				},
			},
		}),
	]);

	if (!results[1])
		return {
			props: {
				playerId: player_id,
				orientation: portraitConfig.orientation || 'bottom',
				environment: 'idle' as Environment,
				attributes: [],
				attributeStatus: [],
				sideAttribute: null,
				playerName: { value: 'Desconhecido', info_id: 0 },
				notFound: true,
				diceColor,
			},
		};

	const sideAttributeIndex = results[1].PlayerAttributes.findIndex(
		(attr) => attr.Attribute.id === portraitConfig.side_attribute
	);

	let sideAttribute: {
		value: number;
		Attribute: { id: number; name: string; color: string };
	} | null = null;
	if (sideAttributeIndex > -1)
		sideAttribute = results[1].PlayerAttributes.splice(sideAttributeIndex, 1)[0];
	const attributes = results[1].PlayerAttributes;

	return {
		props: {
			playerId: player_id,
			orientation: portraitConfig.orientation || 'bottom',
			environment: (results[0]?.value || 'idle') as Environment,
			attributes,
			sideAttribute,
			attributeStatus: results[1].PlayerAttributeStatus,
			playerName: results[1].PlayerInfo[0],
			diceColor,
		},
	};
}
