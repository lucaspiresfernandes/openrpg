import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AdminGlobalConfigurations from '../../../components/Admin/AdminGlobalConfigurations';
import CombatContainer from '../../../components/Admin/CombatContainer';
import DiceContainer from '../../../components/Admin/DiceContainer';
import DiceList, { PlayerName } from '../../../components/Admin/DiceList';
import NPCContainer from '../../../components/Admin/NPCContainer';
import PlayerContainer from '../../../components/Admin/PlayerContainer';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../../components/Player/PlayerAnnotationField';
import useToast from '../../../hooks/useToast';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';

export const errorLogger = createContext<(err: any) => void>(() => { });

export default function Admin1(props: InferGetServerSidePropsType<typeof getAdmin1Props>) {
    const [toasts, addToast] = useToast();

    const players: PlayerName[] = props.players.map(player => {
        return {
            id: player.id, name: player.PlayerInfo.find(info => info.Info.name === 'Nome')?.value || 'Desconhecido'
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
                        {props.players.map(player =>
                            <PlayerContainer key={player.id} id={player.id}
                                info={player.PlayerInfo} attributes={player.PlayerAttributes}
                                specs={player.PlayerSpec} characteristics={player.PlayerCharacteristic}
                                equipments={player.PlayerEquipment} items={player.PlayerItem} />
                        )}
                    </Row>
                    <Row className='my-3 text-center'>
                        <DiceContainer />
                        <CombatContainer players={players} />
                    </Row>
                    <Row className='my-3'>
                        <DiceList players={players} />
                        <NPCContainer />
                    </Row>
                    <Row className='my-3'>
                        <DataContainer outline title='Anotações' htmlFor='playerAnnotations'>
                            <PlayerAnnotationsField value={props.notes?.value} />
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
                id: true,
                PlayerInfo: {
                    where: { Info: { name: { in: ['Nome'] } } },
                    select: { Info: true, value: true },
                },
                PlayerAttributes: {
                    where: { Attribute: { name: { in: ['Vida', 'Sanidade', 'Armadura'] } } },
                    select: { Attribute: true, value: true, maxValue: true }
                },
                PlayerSpec: {
                    where: { Spec: { name: { in: ['Exposição Paranormal'] } } },
                    select: { Spec: true, value: true }
                },
                PlayerCharacteristic: {
                    where: { Characteristic: { name: { in: ['Movimento'] } } },
                    select: { Characteristic: true, value: true }
                },
                PlayerEquipment: {
                    select: { Equipment: true, currentAmmo: true, using: true }
                },
                PlayerItem: {
                    select: { Item: true, currentDescription: true, quantity: true }
                }
            }
        }),
        prisma.playerNote.findUnique({
            where: { player_id: user.id },
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

export const getServerSideProps = sessionSSR(getAdmin1Props);