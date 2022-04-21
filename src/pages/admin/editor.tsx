import { GetServerSidePropsContext } from 'next';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AttributeEditorContainer from '../../components/Admin/Editor/AttributeEditorContainer';
import CharacteristicEditorContainer from '../../components/Admin/Editor/CharacteristicEditorContainer';
import CurrencyEditorContainer from '../../components/Admin/Editor/CurrencyEditorContainer';
import EquipmentEditorContainer from '../../components/Admin/Editor/EquipmentEditorContainer';
import ExtraInfoEditorContainer from '../../components/Admin/Editor/ExtraInfoEditorContainer';
import InfoEditorContainer from '../../components/Admin/Editor/InfoEditorContainer';
import ItemEditorContainer from '../../components/Admin/Editor/ItemEditorContainer';
import SkillEditorContainer from '../../components/Admin/Editor/SkillEditorContainer';
import SpecEditorContainer from '../../components/Admin/Editor/SpecEditorContainer';
import SpellEditorContainer from '../../components/Admin/Editor/SpellEditorContainer';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ApplicationHead from '../../components/ApplicationHead';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import { ErrorLogger } from '../../contexts';
import useToast from '../../hooks/useToast';
import prisma from '../../utils/database';
import { sessionSSR } from '../../utils/session';
import { ContainerConfig } from '../../utils/config';
import { InferSSRProps } from '../../utils';

export default function Admin2(props: InferSSRProps<typeof getSSP>) {
    const [toasts, addToast] = useToast();

    return (
        <ErrorLogger.Provider value={addToast}>
            <ApplicationHead title='Editor' />
            <AdminNavbar />
            <Container>
                <Row>
                    <InfoEditorContainer info={props.info}
                        title={props.containerConfig.find(c => c.originalName === 'Detalhes Pessoais')?.name || 'Detalhes Pessoais'} />
                </Row>
                <Row>
                    <ExtraInfoEditorContainer extraInfo={props.extraInfo}
                        title={props.containerConfig.find(c => c.originalName === 'Detalhes Pessoais')?.name || 'Detalhes Pessoais'} />
                </Row>
                <AttributeEditorContainer attributes={props.attribute} attributeStatus={props.attributeStatus} />
                <Row>
                    <SpecEditorContainer specs={props.spec} />
                </Row>
                <Row>
                    <CharacteristicEditorContainer characteristics={props.characteristic}
                        title={props.containerConfig.find(c => c.originalName === 'Características')?.name || 'Características'} />
                </Row>
                <Row>
                    <CurrencyEditorContainer currencies={props.currency} />
                </Row>
                <SkillEditorContainer skills={props.skill} specializations={props.specialization} />
                <Row>
                    <EquipmentEditorContainer equipments={props.equipment}
                        title={props.containerConfig.find(c => c.originalName === 'Combate')?.name || 'Combate'} />
                </Row>
                <Row>
                    <ItemEditorContainer items={props.item}
                        title={props.containerConfig.find(c => c.originalName === 'Itens')?.name || 'Itens'} />
                </Row>
                <Row>
                    <SpellEditorContainer spells={props.spell}
                        title={props.containerConfig.find(c => c.originalName === 'Magias')?.name || 'Magias'} />
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
            }
        };
    }

    const results = await prisma.$transaction([
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
        prisma.config.findUnique({ where: { name: 'container' } }),
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
            currency: results[12],
            containerConfig: JSON.parse(results[13]?.value || '[]') as ContainerConfig
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);