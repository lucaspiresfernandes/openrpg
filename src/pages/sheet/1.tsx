import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SheetNavbar from '../../components/SheetNavbar';
import database from '../../utils/database';
import { sessionSSR } from '../../utils/session';
import config from '../../../openrpg.config.json';
import PlayerInfoContainer from '../../components/PlayerInfo/PlayerInfoContainer';
import useToast, { AddToastFunction } from '../../hooks/useToast';
import ErrorToastContainer from '../../components/ErrorToastContainer';

export const toastsContext = React.createContext<AddToastFunction>(() => { });

export default function Sheet1(props: InferGetServerSidePropsType<typeof getServerSidePropsImpl>): JSX.Element {
    const [toasts, addToast] = useToast();

    return (
        <>
            <SheetNavbar />
            <toastsContext.Provider value={addToast}>
                <Container className='mt-2'>
                    <Row className='display-5 text-center'>
                        <Col>
                            Perfil de {config.player.role}
                        </Col>
                    </Row>
                    <Row>
                        <PlayerInfoContainer playerInfo={props.playerInfo} />
                    </Row>
                </Container>
            </toastsContext.Provider>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

async function getServerSidePropsImpl(ctx: GetServerSidePropsContext) {
    const player = ctx.req.session.player;

    if (!player) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {
                playerID: 0,
                playerInfo: []
            }
        };
    }

    const playerID = player.id;

    const results = await Promise.all([
        database.playerInfo.findMany({
            where: {
                player_id: playerID
            },
            select: {
                info: true,
                value: true
            },
        })
    ]);

    return {
        props: {
            playerID,
            playerInfo: results[0]
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsImpl);