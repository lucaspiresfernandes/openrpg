import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useState } from 'react';
import { Col, Container, Row, Image, Table } from 'react-bootstrap';
import SheetNavbar from '../../components/SheetNavbar';
import database from '../../utils/database';
import { sessionSSR } from '../../utils/session';
import config from '../../../openrpg.config.json';
import useToast from '../../hooks/useToast';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import GeneralDiceRollModal from '../../components/Modals/GeneralDiceRoll';
import DiceRollResultModal from '../../components/Modals/DiceRollResult';
import { ResolvedDice } from '../../utils';
import PlayerSpecField from '../../components/Player/PlayerSpecField';
import DataContainer from '../../components/DataContainer';
import PlayerInfoField from '../../components/Player/PlayerInfoField';
import PlayerAttributeContainer from '../../components/Player/Attribute/PlayerAttributeContainer';
import PlayerCharacteristicField from '../../components/Player/PlayerCharacteristicField';

export const toastsContext = React.createContext<(err: any) => void>(() => { });
export const diceRollResultContext = React.createContext<(dices: string | ResolvedDice[], resolverKey?: string) => void>(() => { });

const bonusDamageName = 'Dano Bônus';

export default function Sheet1(props: InferGetServerSidePropsType<typeof getServerSidePropsPage1>): JSX.Element {
    const [toasts, addToast] = useToast();
    const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
    const [diceRoll, setDiceRoll] = useState<{ dices: string | ResolvedDice[], resolverKey?: string }>({ dices: '' });
    const [bonusDamage, setBonusDamage] = useState(props.playerSpecs.find(spec => spec.Spec.name === bonusDamageName)?.value);

    function onBonusDamageChanged(name: string, value: string) {
        if (name !== bonusDamageName) return;
        setBonusDamage(value);
    }

    return (
        <>
            <SheetNavbar />
            <toastsContext.Provider value={addToast}>
                <diceRollResultContext.Provider value={(dices, resolverKey) => { setDiceRoll({ dices, resolverKey }); }}>
                    <Container className='mt-2'>
                        <Row className='display-5 text-center'>
                            <Col>
                                Perfil de {config.player.role}
                            </Col>
                        </Row>
                        <Row>
                            <DataContainer title='Detalhes Pessoais'>
                                {props.playerInfo.map(pinfo =>
                                    <PlayerInfoField key={pinfo.Info.id} info={pinfo.Info} value={pinfo.value} />
                                )}
                            </DataContainer>
                            <Col>
                                <PlayerAttributeContainer playerAttributes={props.playerAttributes}
                                    playerStatus={props.playerAttributeStatus}
                                    generalDiceShow={() => setGeneralDiceRollShow(true)} />
                                <Row className='justify-content-center'>
                                    {props.playerSpecs.map(spec =>
                                        <PlayerSpecField key={spec.Spec.id} value={spec.value} Spec={spec.Spec}
                                            onSpecChanged={onBonusDamageChanged} />
                                    )}
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <DataContainer title='Atributos'>
                                <Row className='mb-3 text-center align-items-end justify-content-center'>
                                    {props.playerCharacteristics.map(char =>
                                        <PlayerCharacteristicField key={char.Characteristic.id}
                                            characteristic={char.Characteristic} value={char.value} />
                                    )}
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer title='Combate' onAdd={() => console.log('add')}>
                                <Row className='mb-3 text-center'>
                                    <Col>
                                        <Table responsive variant='dark' className='align-middle'>

                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                    </Container>
                    <GeneralDiceRollModal show={generalDiceRollShow} onHide={() => setGeneralDiceRollShow(false)} />
                </diceRollResultContext.Provider>
                <DiceRollResultModal dices={diceRoll.dices} resolverKey={diceRoll.resolverKey}
                    onHide={() => setDiceRoll({ dices: '', resolverKey: '' })} bonusDamage={bonusDamage} />
            </toastsContext.Provider>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

async function getServerSidePropsPage1(ctx: GetServerSidePropsContext) {
    const player = ctx.req.session.player;

    if (!player) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {
                playerID: 0,
                playerInfo: [],
                playerAttributes: [],
                playerAttributeStatus: [],
                playerSpecs: [],
                playerCharacteristics: [],
            }
        };
    }

    const playerID = player.id;

    const results = await Promise.all([
        database.playerInfo.findMany({
            where: { player_id: playerID },
            select: { Info: true, value: true }
        }),

        database.playerAttribute.findMany({
            where: { player_id: playerID },
            select: {
                value: true, maxValue: true, Attribute: {
                    select: {
                        id: true, name: true, rollable: true
                    }
                }
            }
        }),

        database.playerAttributeStatus.findMany({
            where: { player_id: playerID },
            select: {
                value: true, AttributeStatus: {
                    select: { id: true, name: true, attribute_id: true }
                }
            }
        }),

        database.playerSpec.findMany({
            where: { player_id: playerID },
            select: { Spec: true, value: true }
        }),

        database.playerCharacteristic.findMany({
            where: { player_id: playerID },
            select: { Characteristic: true, value: true }
        }),
    ]);

    return {
        props: {
            playerID,
            playerInfo: results[0],
            playerAttributes: results[1],
            playerAttributeStatus: results[2],
            playerSpecs: results[3],
            playerCharacteristics: results[4],
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage1);