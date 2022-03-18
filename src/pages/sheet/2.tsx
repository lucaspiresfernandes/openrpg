import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { Col, Container, Row } from 'react-bootstrap';
import DataContainer from '../../components/DataContainer';
import SheetNavbar from '../../components/SheetNavbar';
import useToast from '../../hooks/useToast';
import { sessionSSR } from '../../utils/session';
import config from '../../../openrpg.config.json';
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

export default function Sheet2(props: InferGetServerSidePropsType<typeof getServerSidePropsPage2>): JSX.Element {
    const [toasts, addToast] = useToast();
    const [socket, setSocket] = useState<SocketIO | null>(null);

    useSocket(socket => {
        socket.emit('roomJoin', `player${props.playerID}`);
        setSocket(socket);
    });

    useEffect(() => {
        if (!socket) return;
        socket.on('playerDelete', () => api.delete('/player').then(() => Router.replace('/')));
        return () => {
            socket.off('playerDelete');
        };
    }, [socket]);

    return (
        <>
            <ApplicationHead title='Ficha do Personagem' />
            <SheetNavbar />
            <ErrorLogger.Provider value={addToast}>
                <Container>
                    <Row className='display-5 text-center'>
                        <Col>
                            Perfil de {config.player.role}
                        </Col>
                    </Row>
                    <Row>
                        <DataContainer title='Anotações' htmlFor='playerAnnotations' outline>
                            <PlayerAnnotationsField value={props.playerNotes} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer title='Detalhes Pessoais' outline>
                            {props.playerExtraInfo.map(info =>
                                <PlayerExtraInfoField key={info.ExtraInfo.id} value={info.value} extraInfo={info.ExtraInfo} />
                            )}
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
                permanent: false
            },
            props: {
                playerID: 0,
                playerExtraInfo: [],
                playerNotes: undefined
            }
        };
    }

    const results = await Promise.all([
        prisma.playerExtraInfo.findMany({
            where: { player_id: player.id },
            select: { value: true, ExtraInfo: true }
        }),
        prisma.playerNote.findUnique({
            where: { player_id: player.id },
            select: { value: true }
        })
    ]);

    return {
        props: {
            playerID: player.id,
            playerExtraInfo: results[0],
            playerNotes: results[1]?.value
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage2);