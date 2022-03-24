import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AttributeEditorContainer from '../../../components/Admin/Editor/Attribute/AttributeEditorContainer';
import CharacteristicEditorContainer from '../../../components/Admin/Editor/Characteristic/CharacteristicEditorContainer';
import CurrencyEditorContainer from '../../../components/Admin/Editor/Currency/CurrencyEditorContainer';
import EquipmentEditorContainer from '../../../components/Admin/Editor/Equipment/EquipmentEditorContainer';
import ExtraInfoEditorContainer from '../../../components/Admin/Editor/ExtraInfo/ExtraInfoEditorContainer';
import InfoEditorContainer from '../../../components/Admin/Editor/Info/InfoEditorContainer';
import ItemEditorContainer from '../../../components/Admin/Editor/Item/ItemEditorContainer';
import SkillEditorContainer from '../../../components/Admin/Editor/Skill/SkillEditorContainer';
import SpecEditorContainer from '../../../components/Admin/Editor/Spec/SpecEditorContainer';
import SpellEditorContainer from '../../../components/Admin/Editor/Spell/SpellEditorContainer';
import AdminNavbar from '../../../components/AdminNavbar';
import ApplicationHead from '../../../components/ApplicationHead';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import { ErrorLogger } from '../../../contexts';
import useToast from '../../../hooks/useToast';
import prisma from '../../../utils/database';
import { sessionSSR } from '../../../utils/session';

export default function Admin2(props: InferGetServerSidePropsType<typeof getSSP>) {
    const [toasts, addToast] = useToast();

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
                            <InfoEditorContainer info={props.info} />
                        </Row>
                        <Row>
                            <ExtraInfoEditorContainer extraInfo={props.extraInfo} />
                        </Row>
                        <AttributeEditorContainer attributes={props.attribute} attributeStatus={props.attributeStatus} />
                        <Row>
                            <SpecEditorContainer specs={props.spec} />
                        </Row>
                        <Row>
                            <CharacteristicEditorContainer characteristics={props.characteristic} />
                        </Row>
                        <Row>
                            <CurrencyEditorContainer currencies={props.currency} />
                        </Row>
                    </>
                }
                <SkillEditorContainer skills={props.skill} specializations={props.specialization} />
                <Row>
                    <EquipmentEditorContainer equipments={props.equipment} />
                </Row>
                <Row>
                    <ItemEditorContainer items={props.item} />
                </Row>
                <Row>
                    <SpellEditorContainer spells={props.spell} />
                </Row>
            </Container>
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