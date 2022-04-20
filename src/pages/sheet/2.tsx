import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import DataContainer from '../../components/DataContainer';
import SheetNavbar from '../../components/SheetNavbar';
import useToast from '../../hooks/useToast';
import { sessionSSR } from '../../utils/session';
import prisma from '../../utils/database';
import PlayerExtraInfoField from '../../components/Player/PlayerExtraInfoField';
import PlayerAnnotationsField from '../../components/Player/PlayerAnnotationField';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import { ErrorLogger } from '../../contexts';
import { useEffect, useState } from 'react';
import useSocket, { SocketIO } from '../../hooks/useSocket';
import api from '../../utils/api';
import Router from 'next/router';
import ApplicationHead from '../../components/ApplicationHead';
import { ContainerConfig } from '../../utils/config';

export default function Sheet2(
	props: InferGetServerSidePropsType<typeof getServerSidePropsPage2>
) {
	const [toasts, addToast] = useToast();
	const [socket, setSocket] = useState<SocketIO | null>(null);

	useSocket((socket) => {
		socket.emit('roomJoin', `player${props.playerID}`);
		setSocket(socket);
	});

	useEffect(() => {
		if (!socket) return;
		socket.on('playerDelete', () =>
			api.delete('/player').then(() => Router.replace('/'))
		);
		return () => {
			socket.off('playerDelete');
		};
	}, [socket]);

	if (!socket)
		return (
			<Row className='text-center align-items-center w-100' style={{ height: '100vh' }}>
				<Col>
					<h1>Carregando Ficha...</h1>
				</Col>
			</Row>
		);

	return (
		<>
			<ApplicationHead title='Ficha do Personagem' />
			<SheetNavbar />
			<ErrorLogger.Provider value={addToast}>
				<Container>
					<Row className='display-5 text-center'>
						<Col>Ficha do Personagem</Col>
					</Row>
					<Row>
						<DataContainer title='Anotações' htmlFor='playerAnnotations' outline>
							<PlayerAnnotationsField value={props.playerNotes} />
						</DataContainer>
					</Row>
					<Row>
						<DataContainer
							title={
								props.containerConfig.find((c) => c.originalName === 'Detalhes Pessoais')
									?.name || 'Detalhes Pessoais'
							}
							outline>
							{props.playerExtraInfo.map((info) => (
								<PlayerExtraInfoField
									key={info.ExtraInfo.id}
									value={info.value}
									extraInfo={info.ExtraInfo}
								/>
							))}
						</DataContainer>
					</Row>
				</Container>
			</ErrorLogger.Provider>
			<ErrorToastContainer toasts={toasts} />
		</>
	);
}

async function getServerSidePropsPage2(ctx: GetServerSidePropsContext) {
	const player = ctx.req.session.player;

	if (!player) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
			props: {
				playerID: 0,
				playerExtraInfo: [],
				playerNotes: undefined,
				containerConfig: [] as ContainerConfig,
			},
		};
	}

	const results = await prisma.$transaction([
		prisma.playerExtraInfo.findMany({
			where: { player_id: player.id },
			select: { value: true, ExtraInfo: true },
		}),
		prisma.playerNote.findUnique({
			where: { player_id: player.id },
			select: { value: true },
		}),
		prisma.config.findUnique({ where: { name: 'container' } }),
	]);

	return {
		props: {
			playerID: player.id,
			playerExtraInfo: results[0],
			playerNotes: results[1]?.value || '',
			containerConfig: JSON.parse(results[2]?.value || '[]') as ContainerConfig,
		},
	};
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage2);
