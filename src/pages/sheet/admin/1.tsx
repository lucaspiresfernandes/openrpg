import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AdminGlobalConfigurations from '../../../components/Admin/AdminGlobalConfigurations';
import CombatContainer from '../../../components/Admin/CombatContainer';
import DiceContainer from '../../../components/Admin/DiceContainer';
import DiceList, { DiceListPlayer } from '../../../components/Admin/DiceList';
import NPCContainer from '../../../components/Admin/NPCContainer';
import PlayerContainer from '../../../components/Admin/PlayerContainer';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../../components/Player/PlayerAnnotationField';
import useSocket from '../../../hooks/useSocket';
import useToast from '../../../hooks/useToast';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';

export const errorLogger = createContext<(err: any) => void>(() => { });

export default function Admin1(props: InferGetServerSidePropsType<typeof getAdmin1Props>) {
    const [toasts, addToast] = useToast();

    const diceListPlayers: DiceListPlayer[] = [];

    const players = props.players.map(player => {
        const name = player.PlayerInfo[0].value || 'Desconhecido';

        diceListPlayers.push({ id: player.id, name });

        return {
            id: player.id,
            name
        };
    });

    return (
        <>
            <AdminNavbar />
            <errorLogger.Provider value={addToast}>
                <Container>
                    <Row className='display-5 text-center'>
                        <Col>
                            Painel do Administrador
                        </Col>
                    </Row>
                    <Row className='my-4'>
                        <Col className='text-center h5'>
                            <AdminGlobalConfigurations environment={props.environment} />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={12} md={6} xl={4} className='text-center'>
                            <Row className='mx-md-1 player-container h-100'>
                                <Col>
                                    {players.map(player =>
                                        <PlayerContainer key={player.id} />
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='my-3 text-center'>
                        <DiceContainer />
                        <CombatContainer />
                    </Row>
                    <Row className='my-3'>
                        <DiceList players={diceListPlayers} />
                        <NPCContainer />
                    </Row>
                    <Row className='my-3'>
                        <DataContainer outline title='Anotações' htmlFor='playerAnnotations'>
                            <PlayerAnnotationsField value={''} />
                        </DataContainer>
                    </Row>
                </Container>
            </errorLogger.Provider>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

async function getAdmin1Props(ctx: GetServerSidePropsContext) {
    const user = ctx.req.session.player;
    if (!user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {
                environment: null,
                players: []
            }
        };
    }

    const results = await Promise.all([
        prisma.config.findUnique({
            where: { key: 'environment' }
        }),
        prisma.player.findMany({
            where: { role: 'PLAYER' },
            select: {
                id: true, PlayerInfo: {
                    where: { Info: { name: 'Nome' } },
                    select: { Info: true, value: true },
                }
            }
        })
    ]);

    return {
        props: {
            environment: results[0],
            players: results[1]
        }
    };
}

export const getServerSideProps = sessionSSR(getAdmin1Props);