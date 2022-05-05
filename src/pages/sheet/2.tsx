import type { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ApplicationHead from '../../components/ApplicationHead';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../components/Player/PlayerAnnotationField';
import PlayerExtraInfoField from '../../components/Player/PlayerExtraInfoField';
import type { SocketIO } from '../../hooks/useSocket';
import useSocket from '../../hooks/useSocket';
import useToast from '../../hooks/useToast';
import type { InferSSRProps } from '../../utils';
import api from '../../utils/api';
import type { ContainerConfig } from '../../utils/config';
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
	const [socket, setSocket] = useState<SocketIO | null>(null);

	useSocket((socket) => {
		socket.emit('roomJoin', `player${props.player.id}`);
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
			<Container>
				<Row className='display-5 text-center'>
					<Col>Ficha do Personagem</Col>
				</Row>
				<Row>
					<DataContainer title='Anotações' htmlFor='playerAnnotations' outline>
						<PlayerAnnotationsField value={props.player.PlayerNote[0].value} />
					</DataContainer>
				</Row>
				<Row>
					<DataContainer
						title={
							props.containerConfig.find((c) => c.originalName === 'Detalhes Pessoais')
								?.name || 'Detalhes Pessoais'
						}
						outline>
						{props.player.PlayerExtraInfo.map((extraInfo) => (
							<Row className='mb-4' key={extraInfo.ExtraInfo.id}>
								<Col>
									<FormGroup controlId={`extraInfo${extraInfo.ExtraInfo.id}`}>
										<Row>
											<Col className='h4' style={{ margin: 0 }}>
												<FormLabel>{extraInfo.ExtraInfo.name}</FormLabel>
											</Col>
										</Row>
										<Row>
											<Col>
												<PlayerExtraInfoField
													value={extraInfo.value}
													extraInfoId={extraInfo.ExtraInfo.id}
													logError={addToast}
												/>
											</Col>
										</Row>
									</FormGroup>
								</Col>
							</Row>
						))}
					</DataContainer>
				</Row>
			</Container>
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
				PlayerNote: { select: { value: true } },
				PlayerExtraInfo: { select: { ExtraInfo: true, value: true } },
			},
		}),
		prisma.config.findUnique({ where: { name: 'container' } }),
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
			containerConfig: JSON.parse(results[1]?.value || '[]') as ContainerConfig,
		},
	};
}
export const getServerSideProps = sessionSSR(getSSP);
