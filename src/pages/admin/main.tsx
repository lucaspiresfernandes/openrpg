import type { GetServerSidePropsContext } from 'next';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import AdminEnvironmentConfigurations from '../../components/Admin/AdminEnvironmentConfigurations';
import AdminUtilityContainer from '../../components/Admin/AdminUtilityContainer';
import PlayerManager from '../../components/Admin/PlayerManager';
import ApplicationHead from '../../components/ApplicationHead';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../components/Player/PlayerAnnotationField';
import { ErrorLogger, Socket } from '../../contexts';
import useSocket from '../../hooks/useSocket';
import useToast from '../../hooks/useToast';
import type { InferSSRProps } from '../../utils';
import type { Environment } from '../../utils/config';
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

function AdminPanel({ players, adminAnnotations, environment, npcs }: PageProps) {
	const [toasts, addToast] = useToast();
	const socket = useSocket('admin');

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

	const playerNames = players.map((player) => {
		return {
			id: player.id,
			name: player.name,
		};
	});

	return (
			<>
			<ErrorLogger.Provider value={addToast}>
				<Socket.Provider value={socket}>
					<Container className='px-3'>
						<Row className='display-5 text-center'>
							<Col>Painel do Mestre</Col>
						</Row>
						<Row className='my-4'>
							<AdminEnvironmentConfigurations environment={environment} />
						</Row>
						<Row className='justify-content-center gx-5'>
							<PlayerManager players={players} />
						</Row>
						<AdminUtilityContainer npcs={npcs} players={playerNames} />
						<Row className='mb-3'>
							<DataContainer outline title='Anotações' htmlFor='playerAnnotations'>
								<PlayerAnnotationsField value={adminAnnotations.value} />
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
				name: true,
				maxLoad: true,
				PlayerAttributeStatus: { select: { AttributeStatus: true, value: true } },
				PlayerAttributes: { select: { Attribute: true, value: true, maxValue: true } },
				PlayerSpec: { select: { Spec: true, value: true } },
				PlayerEquipment: { include: { Equipment: true } },
				PlayerItem: { select: { Item: true, currentDescription: true, quantity: true } },
				PlayerCurrency: { select: { Currency: true, value: true } },
			},
		}),
		prisma.playerNote.findUnique({
			where: { player_id: player.id },
			select: { value: true },
		}),
		prisma.player.findMany({
			where: { role: 'NPC' },
			select: { id: true, name: true },
		}),
	]);

	return {
		props: {
			environment: (results[0]?.value || 'idle') as Environment,
			players: results[1],
			adminAnnotations: results[2] || { value: '' },
			npcs: results[3],
		},
	};
}

export const getServerSideProps = sessionSSR(getSSP);
