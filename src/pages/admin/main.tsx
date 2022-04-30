import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AdminDiceRollContainer from '../../components/Admin/AdminDiceRollContainer';
import AdminEnvironmentConfigurations from '../../components/Admin/AdminEnvironmentConfigurations';
import CombatContainer from '../../components/Admin/CombatContainer';
import DiceList from '../../components/Admin/DiceList';
import NPCContainer from '../../components/Admin/NPCContainer';
import PlayerManager from '../../components/Admin/PlayerManager';
import ApplicationHead from '../../components/ApplicationHead';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../components/Player/PlayerAnnotationField';
import { ErrorLogger, Socket } from '../../contexts';
import useSocket, { SocketIO } from '../../hooks/useSocket';
import useToast from '../../hooks/useToast';
import { InferSSRProps } from '../../utils';
import { Environment } from '../../utils/config';
import prisma from '../../utils/database';
import { sessionSSR } from '../../utils/session';

type PageProps = InferSSRProps<typeof getSSP>;

export default function Page(props: PageProps) {
	return (
		<>
			<ApplicationHead title='Painel do Mestre' />
			<AdminPanel {...props} />
		</>
	);
}

function AdminPanel(props: PageProps) {
	const [toasts, addToast] = useToast();
	const [socket, setSocket] = useState<SocketIO | null>(null);

	useSocket((socket) => {
		socket.emit('roomJoin', 'admin');
		setSocket(socket);
	});

	const playerNames = props.players.map((player) => {
		return {
			id: player.id,
			name:
				player.PlayerInfo.find((info) => info.Info.name === 'Nome')?.value ||
				'Desconhecido',
		};
	});

	if (!socket)
		return (
			<Row className='text-center align-items-center w-100' style={{ height: '100vh' }}>
				<Col>
					<h1>Carregando Painel...</h1>
				</Col>
			</Row>
		);

	return (
		<>
			<ErrorLogger.Provider value={addToast}>
				<Socket.Provider value={socket}>
					<Container>
						<Row className='display-5 text-center'>
							<Col>Painel do Mestre</Col>
						</Row>
						<Row className='my-4'>
							<AdminEnvironmentConfigurations environment={props.environment} />
						</Row>
						<Row className='justify-content-center'>
							<PlayerManager players={props.players} />
						</Row>
						<Row className='my-3 text-center'>
							<AdminDiceRollContainer />
							<CombatContainer players={playerNames} />
						</Row>
						<Row className='my-3'>
							<DiceList players={playerNames} />
							<NPCContainer />
						</Row>
						<Row className='my-3'>
							<DataContainer outline title='Anotações' htmlFor='playerAnnotations'>
								<PlayerAnnotationsField value={props.notes?.value} />
							</DataContainer>
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

	const results = await prisma.$transaction([
		prisma.config.findUnique({ where: { name: 'environment' } }),
		prisma.player.findMany({
			where: { role: 'PLAYER' },
			select: {
				id: true,
				maxLoad: true,
				PlayerAttributeStatus: { select: { AttributeStatus: true, value: true } },
				PlayerInfo: {
					where: { Info: { name: { in: ['Nome'] } } },
					select: { Info: true, value: true },
				},
				PlayerAttributes: { select: { Attribute: true, value: true, maxValue: true } },
				PlayerSpec: { select: { Spec: true, value: true } },
				PlayerEquipment: { select: { Equipment: true, currentAmmo: true } },
				PlayerItem: { select: { Item: true, currentDescription: true, quantity: true } },
				PlayerCurrency: { select: { Currency: true, value: true } },
			},
		}),
		prisma.playerNote.findUnique({
			where: { player_id: player.id },
			select: { value: true },
		}),
	]);

	return {
		props: {
			environment: (results[0]?.value || 'idle') as Environment,
			players: results[1],
			notes: results[2] || { value: '' },
		},
	};
}

export const getServerSideProps = sessionSSR(getSSP);
