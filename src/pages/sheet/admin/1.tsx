import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import AdminGlobalConfigurations from '../../../components/Admin/AdminGlobalConfigurations';
import CombatContainer from '../../../components/Admin/CombatContainer';
import DiceList, { PlayerName } from '../../../components/Admin/DiceList';
import NPCContainer from '../../../components/Admin/NPCContainer';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../../components/Player/PlayerAnnotationField';
import useToast from '../../../hooks/useToast';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';
import { ResolvedDice } from '../../../utils';
import PlayerManager from '../../../components/Admin/PlayerManager';
import useSocket, { SocketIO } from '../../../hooks/useSocket';
import { ErrorLogger, RetrieveSocket } from '../../../contexts';
import ApplicationHead from '../../../components/ApplicationHead';
import GeneralDiceRollModal from '../../../components/Modals/GeneralDiceRollModal';
import DiceRollResultModal from '../../../components/Modals/DiceRollResultModal';

export default function Admin1(props: InferGetServerSidePropsType<typeof getSSP>) {
    const [toasts, addToast] = useToast();
    const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
    const [diceRoll, setDiceRoll] = useState<{ dices: string | ResolvedDice[], resolverKey?: string }>({ dices: '' });
    const [socket, setSocket] = useState<SocketIO | null>(null);

    useSocket(socket => {
        socket.emit('roomJoin', 'admin');
        setSocket(socket);
    });

    const playerNames: PlayerName[] = props.players.map(player => {
        return {
            id: player.id, name: player.PlayerInfo.find(info => info.Info.name === 'Nome')?.value || 'Desconhecido'
        };
    });

    return (
        <>
            <ApplicationHead title='Painel do Administrador' />
            <AdminNavbar />
            <ErrorLogger.Provider value={addToast}>
                <RetrieveSocket.Provider value={socket}>
                    <Container>
                        <Row className='my-4'>
                            <Col className='text-center h5'>
                                <AdminGlobalConfigurations environment={props.environment} />
                            </Col>
                        </Row>
                        <Row className='justify-content-center'>
                            <PlayerManager players={props.players} />
                        </Row>
                        <Row className='my-3 text-center'>
                            <DataContainer xs={12} lg title='Rolagem'>
                                <Row className='mb-3 justify-content-center'>
                                    <Col xs={3}>
                                        <Row>
                                            <Col className='h5'>Geral</Col>
                                        </Row>
                                        <Row>
                                            <Image fluid src='/dice20.png' alt='Dado'
                                                className='clickable' onClick={() => setGeneralDiceRollShow(true)} />
                                        </Row>
                                    </Col>
                                </Row>
                            </DataContainer>
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
                </RetrieveSocket.Provider>
                <GeneralDiceRollModal show={generalDiceRollShow} onHide={() => setGeneralDiceRollShow(false)}
                    showDiceRollResult={(dices, resolverKey) => setDiceRoll({ dices, resolverKey })} />
                <DiceRollResultModal dices={diceRoll.dices} resolverKey={diceRoll.resolverKey}
                    onHide={() => setDiceRoll({ dices: '', resolverKey: '' })} />
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
                permanent: false
            },
            props: {
                environment: null,
                players: [],
                notes: null
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
                id: true, maxLoad: true,
                PlayerAttributeStatus: { select: { AttributeStatus: true, value: true } },
                PlayerInfo: {
                    where: { Info: { name: { in: ['Nome'] } } },
                    select: { Info: true, value: true },
                },
                PlayerAttributes: { select: { Attribute: true, value: true, maxValue: true } },
                PlayerSpec: { select: { Spec: true, value: true } },
                PlayerEquipment: { select: { Equipment: true, currentAmmo: true } },
                PlayerItem: { select: { Item: true, currentDescription: true, quantity: true } },
                PlayerCurrency: { select: { Currency: true, value: true } }
            }
        }),
        prisma.playerNote.findUnique({
            where: { player_id: player.id },
            select: { value: true }
        }),
    ]);

    return {
        props: {
            environment: results[0],
            players: results[1],
            notes: results[2]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);