import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
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
import PlayerEquipmentField from '../../components/Player/PlayerEquipmentField';
import api from '../../utils/api';
import AddDataModal from '../../components/Modals/EditDataModal';
import PlayerItemField from '../../components/Player/PlayerItemField';
import EditAvatarModal from '../../components/Modals/EditAvatarModal';
import { ErrorLogger, ShowDiceResult } from '../../contexts';
import useSocket, { SocketIO } from '../../hooks/useSocket';
import Router from 'next/router';
import PlayerSkillContainer, { PlayerSkill } from '../../components/Player/Skill/PlayerSkillContainer';
import { Spell } from '@prisma/client';
import PlayerSpellField from '../../components/Player/PlayerSpellField';

const bonusDamageName = config.player.bonus_damage_name;

type PlayerEquipment = {
    currentAmmo: number;
    Equipment: {
        id: number;
        ammo: number | null;
        attacks: string;
        damage: string;
        name: string;
        range: string;
        type: string;
        Skill: {
            name: string;
        };
    };
};

type PlayerItem = {
    Item: {
        id: number;
        name: string;
    };
    currentDescription: string;
    quantity: number;
};

export default function Sheet1(props: InferGetServerSidePropsType<typeof getServerSidePropsPage1>): JSX.Element {
    //Toast
    const [toasts, addToast] = useToast();

    //Socket
    const [socket, setSocket] = useState<SocketIO | null>(null);

    //Dices
    const [generalDiceRollShow, setGeneralDiceRollShow] = useState(false);
    const [diceRoll, setDiceRoll] = useState<{ dices: string | ResolvedDice[], resolverKey?: string }>({ dices: '' });

    //Avatar
    const [avatarModalShow, setAvatarModalShow] = useState(false);

    //Data
    const [bonusDamage, setBonusDamage] = useState(props.playerSpecs.find(spec => spec.Spec.name === bonusDamageName)?.value);

    function onBonusDamageChanged(name: string, value: string) {
        if (name !== bonusDamageName) return;
        setBonusDamage(value);
    }

    //Equipments
    const [addEquipmentShow, setAddEquipmentShow] = useState(false);
    const [equipments, setEquipments] = useState<{ id: number, name: string }[]>(props.availableEquipments.map(eq => {
        return {
            id: eq.id,
            name: eq.name
        };
    }));
    const [playerEquipments, setPlayerEquipments] = useState<PlayerEquipment[]>(props.playerEquipments);
    const playerEquipmentsRef = useRef(playerEquipments);
    playerEquipmentsRef.current = playerEquipments;

    function onAddEquipment(id: number) {
        api.put('/sheet/player/equipment', { id }).then(res => {
            const equipment = res.data.equipment as PlayerEquipment;
            setPlayerEquipments([...playerEquipments, equipment]);

            const newEquipments = [...equipments];
            newEquipments.splice(newEquipments.findIndex(eq => eq.id === id), 1);
            setEquipments(newEquipments);
        }).catch(addToast);
    }

    function onDeleteEquipment(id: number) {
        const newPlayerEquipments = [...playerEquipments];
        const index = newPlayerEquipments.findIndex(eq => eq.Equipment.id === id);

        newPlayerEquipments.splice(index, 1);
        setPlayerEquipments(newPlayerEquipments);

        const modalEquipment = { id, name: playerEquipments[index].Equipment.name };
        setEquipments([...equipments, modalEquipment]);
    }

    //Skills
    const [addSkillShow, setAddSkillShow] = useState(false);
    const [skills, setSkills] = useState<{ id: number, name: string }[]>(props.availableSkills.map(eq => {
        return {
            id: eq.id,
            name: eq.name
        };
    }));
    const [playerSkills, setPlayerSkills] = useState<PlayerSkill[]>(props.playerSkills);

    function onAddSkill(id: number) {
        api.put('/sheet/player/skill', { id }).then(res => {
            const skill = res.data.skill;
            setPlayerSkills([...playerSkills, skill]);

            const newSkills = [...skills];
            newSkills.splice(newSkills.findIndex(eq => eq.id === id), 1);
            setSkills(newSkills);
        }).catch(addToast);
    }

    //Items
    const [addItemShow, setAddItemShow] = useState(false);
    const [items, setItems] = useState<{ id: number, name: string }[]>(props.availableItems.map(eq => {
        return {
            id: eq.id,
            name: eq.name
        };
    }));
    const [playerItems, setPlayerItems] = useState<PlayerItem[]>(props.playerItems);
    const playerItemsRef = useRef(playerItems);
    playerItemsRef.current = playerItems;

    function onAddItem(id: number) {
        api.put('/sheet/player/item', { id }).then(res => {
            const item = res.data.item as PlayerItem;
            setPlayerItems([...playerItems, item]);

            const newItems = [...items];
            newItems.splice(newItems.findIndex(eq => eq.id === id), 1);
            setItems(newItems);
        }).catch(addToast);
    }

    function onDeleteItem(id: number) {
        const newPlayerItems = [...playerItems];
        const index = newPlayerItems.findIndex(eq => eq.Item.id === id);

        newPlayerItems.splice(index, 1);
        setPlayerItems(newPlayerItems);

        const modalItem = { id, name: playerItems[index].Item.name };
        setItems([...items, modalItem]);
    }

    //Spells
    const [addSpellShow, setAddSpellShow] = useState(false);
    const [spells, setSpells] = useState<{ id: number, name: string }[]>(props.availableSpells.map(sp => {
        return { id: sp.id, name: sp.name };
    }));
    const [playerSpells, setPlayerSpells] = useState<Spell[]>(props.playerSpells.map(sp => sp.Spell));
    const playerSpellsRef = useRef(playerSpells);
    playerSpellsRef.current = playerSpells;

    function onAddSpell(id: number) {
        api.put('/sheet/player/spell', { id }).then(res => {
            const spell = res.data.spell as Spell;
            setPlayerSpells([...playerSpells, spell]);

            const newSpells = [...spells];
            newSpells.splice(newSpells.findIndex(spell => spell.id === id), 1);
            setSpells(newSpells);
        }).catch(addToast);
    }

    function onDeleteSpell(id: number) {
        const newPlayerSpells = [...playerSpells];
        const index = newPlayerSpells.findIndex(spell => spell.id === id);

        newPlayerSpells.splice(index, 1);
        setPlayerSpells(newPlayerSpells);

        const modalSpell = { id, name: playerSpells[index].name };
        setSpells([...spells, modalSpell]);
    }

    //Attribute Status
    const [playerStatus, setPlayerStatus] = useState(props.playerAttributeStatus);

    function onAvatarUpdate() {
        setPlayerStatus([...playerStatus]);
    }

    const attributeStatus = playerStatus.map(stat => stat.AttributeStatus);

    useSocket(socket => {
        socket.emit('roomJoin', `player${props.playerID}`);
        setSocket(socket);
    });

    useEffect(() => {
        if (!socket) return;

        socket.on('playerDelete', () => api.delete('/player').then(() => Router.replace('/')));

        socket.on('playerEquipmentAdd', (id, name) => {
            setEquipments(equipments => {
                if (equipments.findIndex(eq => eq.id === id) > -1 ||
                    playerEquipmentsRef.current.findIndex(eq => eq.Equipment.id === id) > -1)
                    return equipments;
                return [...equipments, { id, name }];
            });
        });

        socket.on('playerEquipmentRemove', (id) => {
            setEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.id === id);
                if (index === -1) return equipments;

                const newEquipments = [...equipments];
                newEquipments.splice(index, 1);
                return newEquipments;
            });
        });

        socket.on('playerEquipmentChange', (id, equip) => {
            setPlayerEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.Equipment.id === id);
                if (index === -1) return equipments;

                const newEquipments = [...equipments];
                newEquipments[index].Equipment = equip;
                return newEquipments;
            });

            setEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.id === id);
                if (index === -1) return equipments;

                const newEquipments = [...equipments];
                newEquipments[index].name = equip.name;
                return newEquipments;
            });
        });

        socket.on('playerItemAdd', (id, name) => {
            setItems(items => {
                console.log(playerItemsRef.current);
                if (items.findIndex(item => item.id === id) > -1 ||
                    playerItemsRef.current.findIndex(eq => eq.Item.id === id) > -1)
                    return items;
                return [...items, { id, name }];
            });
        });

        socket.on('playerItemRemove', (id) => {
            setItems(items => {
                const index = items.findIndex(item => item.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems.splice(index, 1);
                return newItems;
            });
        });

        socket.on('playerItemChange', (id, name) => {
            setPlayerItems(items => {
                const index = items.findIndex(eq => eq.Item.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems[index].Item.name = name;
                return newItems;
            });

            setItems(items => {
                const index = items.findIndex(eq => eq.id === id);
                if (index === -1) return items;

                const newItems = [...items];
                newItems[index].name = name;
                return newItems;
            });
        });

        socket.on('playerSkillChange', (id, name, Specialization) => {
            setPlayerSkills(skills => {
                const index = skills.findIndex(skill => skill.Skill.id === id);
                if (index === -1) return skills;

                const newSkills = [...skills];
                newSkills[index].Skill = { id, name, Specialization };
                return newSkills;
            });

            setSkills(skills => {
                const index = skills.findIndex(skill => skill.id === id);
                if (index === -1) return skills;

                const newSkills = [...skills];
                newSkills[index].name = name;
                return newSkills;
            });
        });

        return () => {
            socket.off('playerDelete');
            socket.off('playerEquipmentAdd');
            socket.off('playerEquipmentRemove');
            socket.off('playerEquipmentChange');
            socket.off('playerItemAdd');
            socket.off('playerItemRemove');
            socket.off('playerItemChange');
            socket.off('playerSkillChange');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <>
            <SheetNavbar />
            <ErrorLogger.Provider value={addToast}>
                <ShowDiceResult.Provider value={(dices, resolverKey) => { setDiceRoll({ dices, resolverKey }); }}>
                    <Container>
                        <Row className='display-5 text-center'>
                            <Col>
                                Perfil de {config.player.role}
                            </Col>
                        </Row>
                        <Row>
                            <DataContainer outline title='Detalhes Pessoais'>
                                <>
                                    {props.playerInfo.map(pinfo =>
                                        <PlayerInfoField key={pinfo.Info.id} info={pinfo.Info} value={pinfo.value} />
                                    )}
                                    <Row className='justify-content-center'>
                                        {props.playerSpecs.map(spec =>
                                            <PlayerSpecField key={spec.Spec.id} value={spec.value} Spec={spec.Spec}
                                                onSpecChanged={onBonusDamageChanged} />
                                        )}
                                    </Row>
                                </>
                            </DataContainer>
                            <Col>
                                <PlayerAttributeContainer playerAttributes={props.playerAttributes}
                                    playerStatus={playerStatus}
                                    onDiceClick={() => setGeneralDiceRollShow(true)}
                                    onAvatarClick={() => setAvatarModalShow(true)} />
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
                            <DataContainer outline title='Combate' addButton={{ onAdd: () => setAddEquipmentShow(true) }}>
                                <Row className='mb-3 text-center'>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                    <th>Perícia</th>
                                                    <th>Tipo</th>
                                                    <th>Dano</th>
                                                    <th></th>
                                                    <th>Alcance</th>
                                                    <th>Ataques</th>
                                                    <th>Mun. Atual</th>
                                                    <th>Mun. Máxima</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {playerEquipments.map(eq =>
                                                    <PlayerEquipmentField key={eq.Equipment.id} equipment={eq.Equipment}
                                                        currentAmmo={eq.currentAmmo} onDelete={onDeleteEquipment} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Perícias' addButton={{ onAdd: () => setAddSkillShow(true) }}>
                                <PlayerSkillContainer skills={playerSkills} />
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Itens' addButton={{ onAdd: () => setAddItemShow(true) }}>
                                <Table responsive className='align-middle'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th>Quant.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playerItems.map(eq =>
                                            <PlayerItemField key={eq.Item.id} description={eq.currentDescription}
                                                item={eq.Item} quantity={eq.quantity} onDelete={onDeleteItem} />
                                        )}
                                    </tbody>
                                </Table>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Magias' addButton={{ onAdd: () => setAddSpellShow(true) }}>
                                <Row className='justify-content-center'>
                                    {playerSpells.map(spell =>
                                        <PlayerSpellField key={spell.id} spell={spell} onDelete={onDeleteSpell} />
                                    )}
                                </Row>
                            </DataContainer>
                        </Row>
                    </Container>
                    <GeneralDiceRollModal show={generalDiceRollShow} onHide={() => setGeneralDiceRollShow(false)}
                        showDiceResult={(dices, resolverKey) => setDiceRoll({ dices, resolverKey })} />
                </ShowDiceResult.Provider>
                <DiceRollResultModal dices={diceRoll.dices} resolverKey={diceRoll.resolverKey}
                    onHide={() => setDiceRoll({ dices: '', resolverKey: '' })} bonusDamage={bonusDamage} />
                <EditAvatarModal attributeStatus={attributeStatus} show={avatarModalShow}
                    onHide={() => setAvatarModalShow(false)} onUpdate={onAvatarUpdate} />

                <AddDataModal title='Adicionar Equipamento' show={addEquipmentShow} onHide={() => setAddEquipmentShow(false)}
                    data={equipments} onAddData={onAddEquipment} />
                <AddDataModal title='Adicionar Perícia' show={addSkillShow} onHide={() => setAddSkillShow(false)}
                    data={skills} onAddData={onAddSkill} />
                <AddDataModal title='Adicionar Item' show={addItemShow} onHide={() => setAddItemShow(false)}
                    data={items} onAddData={onAddItem} />
                <AddDataModal title='Adicionar Magia' show={addSpellShow} onHide={() => setAddSpellShow(false)}
                    data={spells} onAddData={onAddSpell} />
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
                playerID: 0,
                playerInfo: [],
                playerAttributes: [],
                playerAttributeStatus: [],
                playerSpecs: [],
                playerCharacteristics: [],
                playerEquipments: [],
                playerSkills: [],
                playerItems: [],
                playerSpells: [],
                availableEquipments: [],
                availableSkills: [],
                availableItems: [],
                availableSpells: [],
                players: [],
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
                        Skill: { select: { name: true } },
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
                Item: { select: { name: true, id: true } },
                currentDescription: true, quantity: true
            }
        }),

        database.playerSpell.findMany({
            where: { player_id: playerID },
            include: { Spell: true }
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

        database.player.findMany({
            select: { id: true, role: true, username: true }
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
            playerEquipments: results[5],
            playerSkills: results[6],
            playerItems: results[7],
            playerSpells: results[8],
            availableEquipments: results[9],
            availableSkills: results[10],
            availableItems: results[11],
            availableSpells: results[12],
            players: results[13]
        }
    };
}
export const getServerSideProps = sessionSSR(getServerSidePropsPage1);