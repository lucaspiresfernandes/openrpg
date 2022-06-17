import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import type { PortraitAttributeStatus } from '../../components/Portrait/PortraitAvatarContainer';
import PortraitAvatarContainer from '../../components/Portrait/PortraitAvatarContainer';
import PortraitDiceContainer from '../../components/Portrait/PortraitDiceContainer';
import PortraitEnvironmentalContainer from '../../components/Portrait/PortraitEnvironmentalContainer';
import PortraitSideAttributeContainer from '../../components/Portrait/PortraitSideAttributeContainer';
import type { SocketIO } from '../../hooks/useSocket';
import useSocket from '../../hooks/useSocket';
import type { Environment, PortraitFontConfig } from '../../utils/config';
import prisma from '../../utils/database';

export default function CharacterPortrait(
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const socket = useSocket(`portrait${props.playerId}`);

	useEffect(() => {
		document.body.style.backgroundColor = 'transparent';

		if (props.customFont) {
			const font = new FontFace('OpenRPG Custom Font', `url(${props.customFont.data})`);
			font.load().then(() => {
				document.fonts.add(font);
				document.body.classList.add('custom-font');
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (props.notFound) return <h1>Personagem não existe.</h1>;

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
			<PortraitDiceRollContainer
				playerId={props.playerId}
				attributeStatus={props.attributeStatus}
				sideAttribute={props.sideAttribute}
				diceColor={props.diceColor}
				showDiceRoll={props.showDiceRoll}
				socket={socket}
			/>
			<PortraitEnvironmentalContainer
				attributes={props.attributes}
				environment={props.environment}
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
	sideAttribute: {
		Attribute: {
			name: string;
			id: number;
			color: string;
		};
		value: number;
		show: boolean;
	} | null;
	diceColor: string;
	showDiceRoll: boolean;
	socket: SocketIO;
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
					socket={props.socket}
				/>
			</div>
			<PortraitDiceContainer
				playerId={props.playerId}
				color={props.diceColor}
				showDiceRoll={props.showDiceRoll}
				socket={props.socket}
				showDice={showDice}
				onShowDice={() => setShowDice(true)}
				onHideDice={() => setShowDice(false)}
			/>
		</>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const playerId = parseInt(ctx.query.characterID as string);
	const diceColor = (ctx.query.dicecolor as string) || 'ddaf0f';
	const showDiceRoll = (ctx.query.showdiceroll as string) === 'true';

	const results = await prisma.$transaction([
		prisma.config.findUnique({ where: { name: 'environment' } }),
		prisma.player.findUnique({
			where: { id: playerId },
			select: {
				name: true,
				showName: true,
				PlayerAttributes: {
					where: { Attribute: { portrait: { in: ['PRIMARY', 'SECONDARY'] } } },
					select: {
						value: true,
						maxValue: true,
						show: true,
						Attribute: { select: { id: true, name: true, color: true, portrait: true } },
					},
				},
				PlayerAttributeStatus: {
					select: { value: true, attribute_status_id: true },
				},
			},
		}),
		prisma.config.findUnique({ where: { name: 'portrait_font' } }),
	]);

	if (!results[1])
		return {
			props: {
				playerId: playerId,
				environment: 'idle' as Environment,
				attributes: [],
				attributeStatus: [],
				sideAttribute: null,
				playerName: { name: 'Desconhecido', show: false },
				notFound: true,
				diceColor,
				showDiceRoll
			},
		};

	const attributes = results[1].PlayerAttributes.filter(
		(attr) => attr.Attribute.portrait === 'PRIMARY'
	);

	const sideAttribute =
		results[1].PlayerAttributes.find((attr) => attr.Attribute.portrait === 'SECONDARY') ||
		null;

	return {
		props: {
			playerId: playerId,
			environment: (results[0]?.value || 'idle') as Environment,
			attributes,
			sideAttribute,
			attributeStatus: results[1].PlayerAttributeStatus,
			playerName: { name: results[1].name, show: results[1].showName },
			diceColor,
			showDiceRoll,
			customFont: JSON.parse(results[2]?.value || 'null') as PortraitFontConfig,
		},
	};
}
