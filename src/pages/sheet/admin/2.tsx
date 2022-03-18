import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React, { useState } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import AttributeEditorField from '../../../components/Admin/Editor/AttributeEditorField';
import CharacteristicEditorField from '../../../components/Admin/Editor/CharacteristicEditorField';
import CurrencyEditorField from '../../../components/Admin/Editor/CurrencyEditorField';
import EquipmentEditorField from '../../../components/Admin/Editor/EquipmentEditorField';
import ExtraInfoEditorField from '../../../components/Admin/Editor/ExtraInfoEditorField';
import InfoEditorField from '../../../components/Admin/Editor/InfoEditorField';
import ItemEditorField from '../../../components/Admin/Editor/ItemEditorField';
import SkillEditorField from '../../../components/Admin/Editor/SkillEditorField';
import SpecEditorField from '../../../components/Admin/Editor/SpecEditorField';
import SpecializationEditorField from '../../../components/Admin/Editor/SpecializationEditorField';
import SpellEditorField from '../../../components/Admin/Editor/SpellEditorField';
import StatusEditorField from '../../../components/Admin/Editor/StatusEditorField';
import AdminNavbar from '../../../components/AdminNavbar';
import ApplicationHead from '../../../components/ApplicationHead';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import CreateAttributeModal from '../../../components/Modals/CreateAttributeModal';
import CreateAttributeStatusModal from '../../../components/Modals/CreateAttributeStatusModal';
import CreateCharacteristicModal from '../../../components/Modals/CreateCharacteristicModal';
import CreateCurrencyModal from '../../../components/Modals/CreateCurrencyModal';
import CreateEquipmentModal from '../../../components/Modals/CreateEquipmentModal';
import CreateExtraInfoModal from '../../../components/Modals/CreateExtraInfoModal';
import CreateInfoModal from '../../../components/Modals/CreateInfoModal';
import CreateItemModal from '../../../components/Modals/CreateItemModal';
import CreateSkillModal from '../../../components/Modals/CreateSkillModal';
import CreateSpecializationModal from '../../../components/Modals/CreateSpecializationModal';
import CreateSpecModal from '../../../components/Modals/CreateSpecModal';
import CreateSpellModal from '../../../components/Modals/CreateSpellModal';
import { ErrorLogger } from '../../../contexts';
import useToast from '../../../hooks/useToast';
import api from '../../../utils/api';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';

export default function Admin2(props: InferGetServerSidePropsType<typeof getSSP>): JSX.Element {

    //Toast
    const [toasts, addToast] = useToast();

    //Modals
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
    const [showEquipmentModal, setShowEquipmentModal] = useState(false);
    const [showSpecializationModal, setShowSpecializationModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [showSpellModal, setShowSpellModal] = useState(false);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);

    const [info, setInfo] = useState(props.info);
    const [extraInfo, setExtraInfo] = useState(props.extraInfo);
    const [attribute, setAttribute] = useState(props.attribute);
    const [status, setStatus] = useState(props.attributeStatus);
    const [spec, setSpec] = useState(props.spec);
    const [characteristic, setCharacteristic] = useState(props.characteristic);
    const [equipment, setEquipment] = useState(props.equipment);
    const [skill, setSkill] = useState(props.skill);
    const [item, setItem] = useState(props.item);
    const [spells, setSpell] = useState(props.spell);
    const [specialization, setSpecialization] = useState(props.specialization);
    const [currency, setCurrency] = useState(props.currency);

    function createInfo(name: string) {
        api.put('/sheet/info', { name }).then(res => {
            const id = res.data.id;
            setInfo([...info, { id, name, default: false }]);
        }).catch(addToast);
    }

    function deleteInfo(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/info', { data: { id } }).then(() => {
            const newInfo = [...info];
            const index = newInfo.findIndex(info => info.id === id);
            if (index > -1) {
                newInfo.splice(index, 1);
                setInfo(newInfo);
            }
        }).catch(addToast);
    }

    function createExtraInfo(name: string) {
        api.put('/sheet/extrainfo', { name }).then(res => {
            const id = res.data.id;
            setExtraInfo([...extraInfo, { id, name }]);
        }).catch(addToast);
    }

    function deleteExtraInfo(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/extrainfo', { data: { id } }).then(res => {
            const newExtraInfo = [...extraInfo];
            const index = newExtraInfo.findIndex(extraInfo => extraInfo.id === id);
            if (index > -1) {
                newExtraInfo.splice(index, 1);
                setExtraInfo(newExtraInfo);
            }
        }).catch(addToast);
    }

    function createAttribute(name: string, rollable: boolean) {
        api.put('/sheet/attribute', { name, rollable }).then(res => {
            const id = res.data.id;
            setAttribute([...attribute, { id, name, rollable }]);
        }).catch(addToast);
    }

    function deleteAttribute(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/attribute', { data: { id } }).then(res => {
            const newAttribute = [...attribute];
            const index = newAttribute.findIndex(attr => attr.id === id);
            if (index > -1) {
                newAttribute.splice(index, 1);
                setAttribute(newAttribute);
            }
        }).catch(addToast);
    }

    function createAttributeStatus(name: string, attributeID: number) {
        api.put('/sheet/attribute/status', { name, attributeID }).then(res => {
            const id = res.data.id;
            setStatus([...status, { id, name, attribute_id: attributeID }]);
        }).catch(addToast);
    }

    function deleteAttributeStatus(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/attribute/status', { data: { id } }).then(res => {
            const newStatus = [...status];
            const index = newStatus.findIndex(status => status.id === id);
            if (index > -1) {
                newStatus.splice(index, 1);
                setStatus(newStatus);
            }
        }).catch(addToast);
    }

    function createSpec(name: string) {
        api.put('/sheet/spec', { name }).then(res => {
            const id = res.data.id;
            setSpec([...spec, { id, name }]);
        }).catch(addToast);
    }

    function deleteSpec(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/spec', { data: { id } }).then(res => {
            const newSpec = [...spec];
            const index = newSpec.findIndex(spec => spec.id === id);
            if (index > -1) {
                newSpec.splice(index, 1);
                setSpec(newSpec);
            }
        }).catch(addToast);
    }

    function createCharacteristic(name: string, rollable: boolean) {
        api.put('/sheet/characteristic', { name, rollable }).then(res => {
            const id = res.data.id;
            setCharacteristic([...characteristic, { id, name, rollable }]);
        }).catch(addToast);
    }

    function deleteCharacteristic(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/characteristic', { data: { id } }).then(res => {
            const newCharacteristic = [...characteristic];
            const index = newCharacteristic.findIndex(char => char.id === id);
            if (index > -1) {
                newCharacteristic.splice(index, 1);
                setCharacteristic(newCharacteristic);
            }
        }).catch(addToast);
    }

    function createSpecialization(name: string) {
        api.put('/sheet/specialization', { name }).then(res => {
            const id = res.data.id;
            setSpecialization([...specialization, { id, name }]);
        }).catch(addToast);
    }

    function deleteSpecialization(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/specialization', { data: { id } }).then(res => {
            const newSpecialization = [...specialization];
            const index = newSpecialization.findIndex(spec => spec.id === id);
            if (index > -1) {
                newSpecialization.splice(index, 1);
                setSpecialization(newSpecialization);
            }
        }).catch(addToast);
    }

    function createSkill(name: string, mandatory: boolean, specializationID: number | null) {
        api.put('/sheet/skill', { name, specializationID, mandatory }).then(res => {
            const id = res.data.id;
            setSkill([...skill, { id, name, specialization_id: specializationID, mandatory }]);
        }).catch(addToast);
    }

    function deleteSkill(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/skill', { data: { id } }).then(res => {
            const newSkill = [...skill];
            const index = newSkill.findIndex(skill => skill.id === id);
            if (index > -1) {
                newSkill.splice(index, 1);
                setSkill(newSkill);
            }
        }).catch(addToast);
    }

    function createEquipment(name: string, type: string, damage: string, range: string,
        attacks: string, ammo: number | null = null) {
        api.put('/sheet/equipment', { name, type, damage, range, attacks, ammo }).then(res => {
            const id = res.data.id;
            setEquipment([...equipment, { id, name, type, damage, range, attacks, ammo, visible: true }]);
        }).catch(addToast);
    }

    function deleteEquipment(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/equipment', { data: { id } }).then(res => {
            const newEquipment = [...equipment];
            const index = newEquipment.findIndex(eq => eq.id === id);
            if (index > -1) {
                newEquipment.splice(index, 1);
                setEquipment(newEquipment);
            }
        }).catch(addToast);
    }

    function createItem(name: string, description: string) {
        api.put('/sheet/item', { name, description }).then(res => {
            const id = res.data.id;
            setItem([...item, { id, name, description, visible: true }]);
        }).catch(addToast);
    }

    function deleteItem(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/item', { data: { id } }).then(res => {
            const newItem = [...item];
            const index = newItem.findIndex(item => item.id === id);
            if (index > -1) {
                newItem.splice(index, 1);
                setItem(newItem);
            }
        }).catch(addToast);
    }

    function createSpell(name: string, description: string, cost: string, type: string,
        damage: string, castingTime: string, range: string, duration: string) {
        api.put('/sheet/spell', { name, description, cost, type, damage, castingTime, range, duration }).then(res => {
            const id = res.data.id;
            setSpell([...spells, { id, name, description, cost, type, damage, castingTime, range, duration, visible: true }]);
        }).catch(addToast);
    }

    function deleteSpell(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse spell?')) return;
        api.delete('/sheet/spell', { data: { id } }).then(res => {
            const newSpell = [...spells];
            const index = newSpell.findIndex(spell => spell.id === id);
            if (index > -1) {
                newSpell.splice(index, 1);
                setSpell(newSpell);
            }
        }).catch(addToast);
    }

    function createCurrency(name: string) {
        api.put('/sheet/currency', { name }).then(res => {
            const id = res.data.id;
            setCurrency([...currency, { id, name }]);
        }).catch(addToast);
    }

    function deleteCurrency(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/currency', { data: { id } }).then(() => {
            const newCurrency = [...currency];
            const index = newCurrency.findIndex(currency => currency.id === id);
            if (index > -1) {
                newCurrency.splice(index, 1);
                setCurrency(newCurrency);
            }
        }).catch(addToast);
    }

    return (
        <ErrorLogger.Provider value={addToast}>
            <ApplicationHead title='Editor' />
            <AdminNavbar />
            <Container>
                <Row className='display-5 text-center'>
                    <Col>Painel do Administrador</Col>
                </Row>
                {
                    props.players.length === 0 &&
                    <>
                        <Row>
                            <DataContainer outline title='Informações Pessoais (Geral)'
                                addButton={{ onAdd: () => setShowInfoModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {info.map(info =>
                                                    <InfoEditorField key={info.id}
                                                        info={info} onDelete={deleteInfo} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Informações Pessoais (Extra)'
                                addButton={{ onAdd: () => setShowExtraInfoModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {extraInfo.map(info =>
                                                    <ExtraInfoEditorField key={info.id}
                                                        extraInfo={info} onDelete={deleteExtraInfo} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Atributos'
                                addButton={{ onAdd: () => setShowAttributeModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                    <th>Testável</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attribute.map(attr =>
                                                    <AttributeEditorField key={attr.id}
                                                        attribute={attr} onDelete={deleteAttribute} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Status de Atributos'
                                addButton={{ onAdd: () => setShowStatusModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                    <th>Atributo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {status.map(stat =>
                                                    <StatusEditorField key={stat.id} attributeStatus={stat}
                                                        attributes={attribute} onDelete={deleteAttributeStatus} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Especificações de Jogador'
                                addButton={{ onAdd: () => setShowSpecModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {spec.map(spec =>
                                                    <SpecEditorField key={spec.id}
                                                        spec={spec} onDelete={deleteSpec} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Características'
                                addButton={{ onAdd: () => setShowCharacteristicModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                    <th>Testável</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {characteristic.map(char =>
                                                    <CharacteristicEditorField key={char.id}
                                                        characteristic={char} onDelete={deleteCharacteristic} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Especializações'
                                addButton={{ onAdd: () => setShowSpecializationModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {specialization.map(specialization =>
                                                    <SpecializationEditorField key={specialization.id}
                                                        specialization={specialization} onDelete={deleteSpecialization} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                        <Row>
                            <DataContainer outline title='Moedas'
                                addButton={{ onAdd: () => setShowCurrencyModal(true) }}>
                                <Row>
                                    <Col>
                                        <Table responsive className='align-middle'>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currency.map(curr =>
                                                    <CurrencyEditorField key={curr.id}
                                                        currency={curr} onDelete={deleteCurrency} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </DataContainer>
                        </Row>
                    </>
                }
                <Row>
                    <DataContainer outline title='Perícias'
                        addButton={{ onAdd: () => setShowSkillModal(true) }}>
                        <Row>
                            <Col>
                                <Table responsive className='align-middle'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nome</th>
                                            <th>Especialização</th>
                                            <th>Obrigatório</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skill.map(skill =>
                                            <SkillEditorField key={skill.id} skill={skill}
                                                onDelete={deleteSkill} specializations={specialization} />
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </DataContainer>
                </Row>
                <Row>
                    <DataContainer outline title='Equipamentos'
                        addButton={{ onAdd: () => setShowEquipmentModal(true) }}>
                        <Row>
                            <Col>
                                <Table responsive className='align-middle text-center'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Dano</th>
                                            <th>Alcance</th>
                                            <th>Ataques</th>
                                            <th>Munição</th>
                                            <th>Visível</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipment.map(eq =>
                                            <EquipmentEditorField key={eq.id} equipment={eq}
                                                onDelete={deleteEquipment} />
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </DataContainer>
                </Row>
                <Row>
                    <DataContainer outline title='Itens'
                        addButton={{ onAdd: () => setShowItemModal(true) }}>
                        <Row>
                            <Col>
                                <Table responsive className='align-middle'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th>Visível</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.map(item => <ItemEditorField key={item.id} item={item} onDelete={deleteItem} />)}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </DataContainer>
                </Row>
                <Row>
                    <DataContainer outline title='Magias'
                        addButton={{ onAdd: () => setShowSpellModal(true) }}>
                        <Row>
                            <Col>
                                <Table responsive className='align-middle text-center'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th>Custo</th>
                                            <th>Tipo</th>
                                            <th>Dano</th>
                                            <th>Tempo de Conjuração</th>
                                            <th>Alcance</th>
                                            <th>Duração</th>
                                            <th>Visível</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spells.map(spell =>
                                            <SpellEditorField key={spell.id} spell={spell} onDelete={deleteSpell} />
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </DataContainer>
                </Row>
            </Container>
            <CreateInfoModal show={showInfoModal} onHide={() => setShowInfoModal(false)}
                onCreate={createInfo} />
            <CreateExtraInfoModal show={showExtraInfoModal} onHide={() => setShowExtraInfoModal(false)}
                onCreate={createExtraInfo} />
            <CreateAttributeModal show={showAttributeModal} onHide={() => setShowAttributeModal(false)}
                onCreate={createAttribute} />
            <CreateAttributeStatusModal show={showStatusModal} onHide={() => setShowStatusModal(false)}
                onCreate={createAttributeStatus} attributes={attribute} />
            <CreateSpecModal show={showSpecModal} onHide={() => setShowSpecModal(false)}
                onCreate={createSpec} />
            <CreateCharacteristicModal show={showCharacteristicModal} onHide={() => setShowCharacteristicModal(false)}
                onCreate={createCharacteristic} />
            <CreateCurrencyModal show={showCurrencyModal} onHide={() => setShowCurrencyModal(false)}
                onCreate={createCurrency} />
            <CreateEquipmentModal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)}
                onCreate={createEquipment} skill={skill} />
            <CreateSpecializationModal show={showSpecializationModal} onHide={() => setShowSpecializationModal(false)}
                onCreate={createSpecialization} />
            <CreateSkillModal show={showSkillModal} onHide={() => setShowSkillModal(false)}
                onCreate={createSkill} specialization={specialization} />
            <CreateItemModal show={showItemModal} onHide={() => setShowItemModal(false)}
                onCreate={createItem} />
            <CreateSpellModal show={showSpellModal} onHide={() => setShowSpellModal(false)}
                onCreate={createSpell} />
            <ErrorToastContainer toasts={toasts} />
        </ErrorLogger.Provider>
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
                players: [],
                info: [],
                extraInfo: [],
                attribute: [],
                attributeStatus: [],
                spec: [],
                characteristic: [],
                equipment: [],
                skill: [],
                item: [],
                specialization: [],
                spell: [],
                currency: []
            }
        };
    }

    const results = await Promise.all([
        prisma.player.findMany({ where: { role: 'PLAYER' } }),
        prisma.info.findMany(),
        prisma.extraInfo.findMany(),
        prisma.attribute.findMany(),
        prisma.attributeStatus.findMany(),
        prisma.spec.findMany(),
        prisma.characteristic.findMany(),
        prisma.equipment.findMany(),
        prisma.skill.findMany(),
        prisma.item.findMany(),
        prisma.specialization.findMany(),
        prisma.spell.findMany(),
        prisma.currency.findMany(),
    ]);

    return {
        props: {
            players: results[0],
            info: results[1],
            extraInfo: results[2],
            attribute: results[3],
            attributeStatus: results[4],
            spec: results[5],
            characteristic: results[6],
            equipment: results[7],
            skill: results[8],
            item: results[9],
            specialization: results[10],
            spell: results[11],
            currency: results[12]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);