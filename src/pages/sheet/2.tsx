import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createContext } from 'react';
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

export const errorLogger = createContext<(err: any) => void>(() => { });

export default function Sheet2(props: InferGetServerSidePropsType<typeof getServerSidePropsPage2>): JSX.Element {
    const [toasts, addToast] = useToast();

    return (
        <>
            <SheetNavbar />
            <errorLogger.Provider value={addToast}>
                <Container>
                    <Row className='display-5 text-center'>
                        <Col>
                            Perfil de {config.player.role}
                        </Col>
                    </Row>
                    <Row>
                        <DataContainer title='Anotações' htmlFor='playerAnnotations'>
                            <PlayerAnnotationsField value={props.playerNotes} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer title='Detalhes Pessoais'>
                            {props.playerExtraInfo.map(info =>
                                <PlayerExtraInfoField key={info.ExtraInfo.id} value={info.value} extraInfo={info.ExtraInfo} />
                            )}
                        </DataContainer>
                    </Row>
                </Container>
            </errorLogger.Provider>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

async function getServerSidePropsPage2(ctx: GetServerSidePropsContext) {
    const playerID = ctx.req.session.player.id;
    if (!playerID) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {
                playerExtraInfo: [],
                playerNotes: undefined
            }
        };
    }

    const results = await Promise.all([
        prisma.playerExtraInfo.findMany({
            where: { player_id: playerID },
            select: { value: true, ExtraInfo: true }
        }),
        prisma.playerNote.findUnique({
            where: { player_id: playerID },
            select: { value: true }
        })
    ]);

    return {
        props: {
            playerExtraInfo: results[0],
            playerNotes: results[1]?.value
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage2);