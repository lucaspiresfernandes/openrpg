import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AttributeEditor from '../../../components/Admin/Editor/AttributeEditor';
import CharacteristicEditor from '../../../components/Admin/Editor/CharacteristicEditor';
import EquipmentEditor from '../../../components/Admin/Editor/EquipmentEditor';
import ExtraInfoEditor from '../../../components/Admin/Editor/ExtraInfoEditor';
import InfoEditor from '../../../components/Admin/Editor/InfoEditor';
import ItemEditor from '../../../components/Admin/Editor/ItemEditor';
import SkillEditor from '../../../components/Admin/Editor/SkillEditor';
import SpecEditor from '../../../components/Admin/Editor/SpecEditor';
import SpecializationEditor from '../../../components/Admin/Editor/SpecializationEditor';
import StatusEditor from '../../../components/Admin/Editor/StatusEditor';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import CreateAttributeModal from '../../../components/Modals/CreateAttributeModal';
import CreateAttributeStatusModal from '../../../components/Modals/CreateAttributeStatusModal';
import CreateCharacteristicModal from '../../../components/Modals/CreateCharacteristicModal';
import CreateEquipmentModal from '../../../components/Modals/CreateEquipmentModal';
import CreateExtraInfoModal from '../../../components/Modals/CreateExtraInfoModal';
import CreateInfoModal from '../../../components/Modals/CreateInfoModal';
import CreateItemModal from '../../../components/Modals/CreateItemModal';
import CreateSkillModal from '../../../components/Modals/CreateSkillModal';
import CreateSpecializationModal from '../../../components/Modals/CreateSpecializationModal';
import CreateSpecModal from '../../../components/Modals/CreateSpecModal';
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

    const [info, setInfo] = useState(props.info);
    const [extraInfo, setExtraInfo] = useState(props.extraInfo);
    const [attribute, setAttribute] = useState(props.attribute);
    const [status, setStatus] = useState(props.attributeStatus);
    const [spec, setSpec] = useState(props.spec);
    const [characteristic, setCharacteristic] = useState(props.characteristic);
    const [equipment, setEquipment] = useState(props.equipment);
    const [skill, setSkill] = useState(props.skill);
    const [item, setItem] = useState(props.item);
    const [specialization, setSpecialization] = useState(props.specialization);

    function createInfo(name: string) {
        api.put('/sheet/info', { name }).then(res => {
            const id = res.data.id;
            setInfo([...info, { id, name }]);
        }).catch(addToast);
    }

    function deleteInfo(id: number) {
        api.delete('/sheet/info', { data: { id } }).then(res => {
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
            setExtraInfo([...info, { id, name }]);
        }).catch(addToast);
    }

    function deleteExtraInfo(id: number) {
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
        api.delete('/sheet/specialization', { data: { id } }).then(res => {
            const newSpecialization = [...specialization];
            const index = newSpecialization.findIndex(spec => spec.id === id);
            if (index > -1) {
                newSpecialization.splice(index, 1);
                setSpecialization(newSpecialization);
            }
        }).catch(addToast);
    }

    function createSkill(name: string, specializationID: number, mandatory: boolean) {
        api.put('/sheet/skill', { name, specializationID, mandatory }).then(res => {
            const id = res.data.id;
            setSkill([...skill, { id, name, specialization_id: specializationID, mandatory }]);
        }).catch(addToast);
    }

    function deleteSkill(id: number) {
        api.delete('/sheet/skill', { data: { id } }).then(res => {
            const newSkill = [...skill];
            const index = newSkill.findIndex(skill => skill.id === id);
            if (index > -1) {
                newSkill.splice(index, 1);
                setSkill(newSkill);
            }
        }).catch(addToast);
    }

    function createEquipment(name: string, skillID: number, type: string, damage: string, range: string,
        attacks: string, ammo: number | null = null) {
        api.put('/sheet/equipment', { name, skillID, type, damage, range, attacks, ammo }).then(res => {
            const id = res.data.id;
            setEquipment([...equipment, { id, name, skill_id: skillID, type, damage, range, attacks, ammo, visible: true }]);
        }).catch(addToast);
    }

    function deleteEquipment(id: number) {
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
        api.put('/sheet/equipment', { name, description }).then(res => {
            const id = res.data.id;
            setItem([...item, { id, name, description, visible: true }]);
        }).catch(addToast);
    }

    function deleteItem(id: number) {
        api.delete('/sheet/equipment', { data: { id } }).then(res => {
            const newItem = [...item];
            const index = newItem.findIndex(item => item.id === id);
            if (index > -1) {
                newItem.splice(index, 1);
                setItem(newItem);
            }
        }).catch(addToast);
    }

    return (
        <>
            <AdminNavbar />
            <ErrorLogger.Provider value={addToast}>
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
                                    <InfoEditor info={info} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Informações Pessoais (Extra)'
                                    addButton={{ onAdd: () => setShowExtraInfoModal(true) }}>
                                    <ExtraInfoEditor extraInfo={extraInfo} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Atributos'
                                    addButton={{ onAdd: () => setShowAttributeModal(true) }}>
                                    <AttributeEditor attribute={attribute} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Status de Atributos'
                                    addButton={{ onAdd: () => setShowStatusModal(true) }}>
                                    <StatusEditor attributeStatus={status} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Especificações de Jogador'
                                    addButton={{ onAdd: () => setShowSpecModal(true) }}>
                                    <SpecEditor spec={spec} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Características'
                                    addButton={{ onAdd: () => setShowCharacteristicModal(true) }}>
                                    <CharacteristicEditor characteristic={characteristic} />
                                </DataContainer>
                            </Row>
                        </>
                    }
                    <Row>
                        <DataContainer outline title='Especializações'
                            addButton={{ onAdd: () => setShowSpecializationModal(true) }}>
                            <SpecializationEditor specialization={specialization} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer outline title='Perícias'
                            addButton={{ onAdd: () => setShowSkillModal(true) }}>
                            <SkillEditor skill={skill} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer outline title='Equipamentos'
                            addButton={{ onAdd: () => setShowEquipmentModal(true) }}>
                            <EquipmentEditor equipment={equipment} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer outline title='Itens'
                            addButton={{ onAdd: () => setShowItemModal(true) }}>
                            <ItemEditor item={item} />
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
                <CreateEquipmentModal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)}
                    onCreate={createEquipment} skill={skill} />
                <CreateSpecializationModal show={showSpecializationModal} onHide={() => setShowSpecializationModal(false)}
                    onCreate={createSpecialization} />
                <CreateSkillModal show={showSkillModal} onHide={() => setShowSkillModal(false)}
                    onCreate={createSkill} specialization={specialization} />
                <CreateItemModal show={showItemModal} onHide={() => setShowItemModal(false)}
                    onCreate={createItem} />
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
                specialization: []
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
        prisma.specialization.findMany()
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
            specialization: results[10]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);