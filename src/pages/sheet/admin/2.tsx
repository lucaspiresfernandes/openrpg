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
import StatusEditor from '../../../components/Admin/Editor/StatusEditor';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import { ErrorLogger } from '../../../contexts';
import useToast from '../../../hooks/useToast';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';

export default function Admin2(props: InferGetServerSidePropsType<typeof getSSP>): JSX.Element {
    const [toasts, addToast] = useToast();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showExtraInfoModal, setShowExtraInfoModal] = useState(false);
    const [showAttributeModal, setShowAttributeModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
    const [showEquipmentModal, setShowEquipmentModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);

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
                                    <InfoEditor info={props.info} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Informações Pessoais (Extra)'
                                    addButton={{ onAdd: () => setShowExtraInfoModal(true) }}>
                                    <ExtraInfoEditor extraInfo={props.extraInfo} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Atributos'
                                    addButton={{ onAdd: () => setShowAttributeModal(true) }}>
                                    <AttributeEditor attribute={props.attribute} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Status de Atributos'
                                    addButton={{ onAdd: () => setShowStatusModal(true) }}>
                                    <StatusEditor attributeStatus={props.attributeStatus} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Especificações de Jogador'
                                    addButton={{ onAdd: () => setShowSpecModal(true) }}>
                                    <SpecEditor spec={props.spec} />
                                </DataContainer>
                            </Row>
                            <Row>
                                <DataContainer outline title='Características'
                                    addButton={{ onAdd: () => setShowCharacteristicModal(true) }}>
                                    <CharacteristicEditor characteristic={props.characteristic} />
                                </DataContainer>
                            </Row>
                        </>
                    }
                    <Row>
                        <DataContainer outline title='Equipamentos'
                            addButton={{ onAdd: () => setShowEquipmentModal(true) }}>
                            <EquipmentEditor equipment={props.equipment} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer outline title='Perícias'
                            addButton={{ onAdd: () => setShowSkillModal(true) }}>
                            <SkillEditor skill={props.skill} />
                        </DataContainer>
                    </Row>
                    <Row>
                        <DataContainer outline title='Itens'
                            addButton={{ onAdd: () => setShowItemModal(true) }}>
                            <ItemEditor item={props.item} />
                        </DataContainer>
                    </Row>
                </Container>
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
        prisma.item.findMany()
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
            item: results[9]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);