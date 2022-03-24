import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import SheetNavbar from '../../components/SheetNavbar';
import database from '../../utils/database';
import { sessionSSR } from '../../utils/session';
import config from '../../../openrpg.config.json';
import useToast from '../../hooks/useToast';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import { ResolvedDice } from '../../utils';
import PlayerSpecField from '../../components/Player/PlayerSpecField';
import DataContainer from '../../components/DataContainer';
import PlayerInfoField from '../../components/Player/PlayerInfoField';
import PlayerAttributeContainer from '../../components/Player/Attribute/PlayerAttributeContainer';
import PlayerCharacteristicField from '../../components/Player/PlayerCharacteristicField';
import api from '../../utils/api';
import { ErrorLogger, ShowDiceResult } from '../../contexts';
import useSocket, { SocketIO } from '../../hooks/useSocket';
import Router from 'next/router';
import PlayerSkillContainer from '../../components/Player/Skill/PlayerSkillContainer';
import ApplicationHead from '../../components/ApplicationHead';
import DiceRollResultModal from '../../components/Modals/DiceRollResultModal';
import PlayerItemContainer from '../../components/Player/Item/PlayerItemContainer';
import PlayerEquipmentContainer from '../../components/Player/Equipment/PlayerEquipmentContainer';
import { Socket } from '../../contexts';
import PlayerSpellContainer from '../../components/Player/Spell/PlayerSpellContainer';

const bonusDamageName = config.player.bonus_damage_name;

export default function Sheet1(props: InferGetServerSidePropsType<typeof getServerSidePropsPage1>): JSX.Element {
    const [toasts, addToast] = useToast();

    const [socket, setSocket] = useState<SocketIO | null>(null);

    const [diceRoll, setDiceRoll] = useState<{ dices: string | ResolvedDice[], resolverKey?: string }>({ dices: '' });

    const bonusDamage = useRef(props.playerSpecs.find(spec => spec.Spec.name === bonusDamageName)?.value);

    function onSpecChanged(name: string, value: string) {
        if (name !== bonusDamageName) return;
        bonusDamage.current = value;
    }

    useSocket(socket => {
        socket.emit('roomJoin', `player${props.player.id}`);
        setSocket(socket);
    });

    useEffect(() => {
        if (!socket) return;
        socket.on('playerDelete', () => api.delete('/player').then(() => Router.replace('/')));
        return () => { socket.off('playerDelete'); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <ApplicationHead title='Ficha do Personagem' />
            <SheetNavbar />
            <ErrorLogger.Provider value={addToast}>
                <ShowDiceResult.Provider value={(dices, resolverKey) => { setDiceRoll({ dices, resolverKey }); }}>
                    <Socket.Provider value={socket}>
                        <Container>
                            <Row className='display-5 text-center'>
                                <Col>
                                    Perfil de {config.player.role}
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <DataContainer outline title='Detalhes Pessoais'>
                                    <>
                                        {props.playerInfo.map(pinfo =>
                                            <PlayerInfoField key={pinfo.Info.id} info={pinfo.Info} value={pinfo.value} />
                                        )}
                                        <Row className='justify-content-center'>
                                            {props.playerSpecs.map(spec =>
                                                <PlayerSpecField key={spec.Spec.id} value={spec.value} Spec={spec.Spec}
                                                    onSpecChanged={onSpecChanged} />
                                            )}
                                        </Row>
                                    </>
                                </DataContainer>
                                <Col>
                                    <PlayerAttributeContainer playerAttributes={props.playerAttributes}
                                        playerAttributeStatus={props.playerAttributeStatus} playerAvatars={props.playerAvatars} />
                                </Col>
                            </Row>
                            <Row>
                                <DataContainer outline title='Características'>
                                    <Row className='mb-3 text-center align-items-end justify-content-center'>
                                        {props.playerCharacteristics.map(char =>
                                            <PlayerCharacteristicField key={char.Characteristic.id}
                                                characteristic={char.Characteristic} value={char.value} />
                                        )}
                                    </Row>
                                </DataContainer>
                            </Row>
                            <Row>
                                <PlayerEquipmentContainer availableEquipments={props.availableEquipments}
                                    playerEquipments={props.playerEquipments} />
                            </Row>
                            <Row>
                                <PlayerSkillContainer playerSkills={props.playerSkills} availableSkills={props.availableSkills} />
                            </Row>
                            <Row>
                                <PlayerItemContainer playerItems={props.playerItems} availableItems={props.availableItems}
                                    playerMaxLoad={props.player.maxLoad} playerCurrency={props.playerCurrency} />
                            </Row>
                            <Row>
                                <PlayerSpellContainer playerSpells={props.playerSpells.map(sp => sp.Spell)}
                                    availableSpells={props.availableSpells} />
                            </Row>
                        </Container>
                    </Socket.Provider>
                </ShowDiceResult.Provider>
                <DiceRollResultModal dices={diceRoll.dices} resolverKey={diceRoll.resolverKey}
                    onHide={() => setDiceRoll({ dices: '', resolverKey: undefined })} bonusDamage={bonusDamage.current} />
            </ErrorLogger.Provider>
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
                player: { id: 0, maxLoad: 0 },
                playerInfo: [],
                playerAttributes: [],
                playerAttributeStatus: [],
                playerAvatars: [],
                playerSpecs: [],
                playerCharacteristics: [],
                playerEquipments: [],
                playerSkills: [],
                playerCurrency: [],
                playerItems: [],
                playerSpells: [],
                availableEquipments: [],
                availableSkills: [],
                availableItems: [],
                availableSpells: [],
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
            select: { Attribute: true, value: true, maxValue: true }
        }),

        database.playerAttributeStatus.findMany({
            where: { player_id: playerID },
            select: { AttributeStatus: true, value: true }
        }),

        database.playerSpec.findMany({
            where: { player_id: playerID },
            select: { Spec: true, value: true }
        }),

        database.playerCharacteristic.findMany({
            where: { player_id: playerID },
            select: { Characteristic: true, value: true }
        }),

        database.playerEquipment.findMany({
            where: { player_id: playerID },
            select: {
                Equipment: {
                    select: {
                        id: true, ammo: true, attacks: true, damage: true,
                        name: true, range: true, type: true
                    }
                },
                currentAmmo: true
            }
        }),

        database.playerSkill.findMany({
            where: { player_id: playerID },
            select: {
                Skill: { select: { id: true, name: true, Specialization: { select: { name: true } } } },
                value: true
            }
        }),

        database.playerItem.findMany({
            where: { player_id: playerID },
            select: {
                Item: { select: { name: true, id: true, weight: true } },
                currentDescription: true, quantity: true
            }
        }),

        database.playerSpell.findMany({
            where: { player_id: playerID },
            select: { Spell: true }
        }),

        database.equipment.findMany({
            where: { visible: true, PlayerEquipment: { none: { player_id: playerID } } },
        }),

        database.skill.findMany({
            where: { PlayerSkill: { none: { player_id: playerID } } },
        }),

        database.item.findMany({
            where: { visible: true, PlayerItem: { none: { player_id: playerID } } },
        }),

        database.spell.findMany({
            where: { visible: true, PlayerSpell: { none: { player_id: playerID } } },
        }),

        database.playerCurrency.findMany({
            where: { player_id: playerID },
            select: { value: true, Currency: true }
        }),

        database.playerAvatar.findMany({
            where: { player_id: playerID },
            select: {
                link: true,
                AttributeStatus: { select: { id: true, name: true } }
            }
        }),

        database.player.findUnique({
            where: { id: playerID }, select: { maxLoad: true }
        })
    ]);

    return {
        props: {
            playerInfo: results[0],
            playerAttributes: results[1],
            playerAttributeStatus: results[2],
            playerSpecs: results[3],
            playerCharacteristics: results[4],
            playerEquipments: results[5],
            playerSkills: results[6],
            playerItems: results[7],
            playerSpells: results[8],
            availableEquipments: results[9],
            availableSkills: results[10],
            availableItems: results[11],
            availableSpells: results[12],
            playerCurrency: results[13],
            playerAvatars: results[14],
            player: { id: playerID, maxLoad: results[15]?.maxLoad || 0 },
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage1);