
import { Attribute } from '@prisma/client';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from 'react-bootstrap/DropdownItem';
import FormCheck from 'react-bootstrap/FormCheck';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ApplicationHead from '../../components/ApplicationHead';
import BottomTextInput from '../../components/BottomTextInput';
import DataContainer from '../../components/DataContainer';
import ErrorToastContainer from '../../components/ErrorToastContainer';
import useExtendedState from '../../hooks/useExtendedState';
import useToast from '../../hooks/useToast';
import api from '../../utils/api';
import { DiceConfig, PortraitConfig, PortraitOrientation } from '../../utils/config';
import prisma from '../../utils/database';
import { sessionSSR } from '../../utils/session';

export default function Configurations(props: InferGetServerSidePropsType<typeof getSSP>) {
    const [toasts, addToast] = useToast();

    return (
        <>
            <ApplicationHead title='Configurações' />
            <AdminNavbar />
            <Container>
                <Row className='display-5 text-center'>
                    <Col>Configurações do Sistema</Col>
                </Row>
                <Row className='mt-3 text-center'>
                    <AdminKeyContainer adminKey={props.adminKey} logError={addToast} />
                </Row>
                <Row className='mt-3'>
                    <DiceContainer successTypeEnabled={props.enableSuccessTypes} diceConfig={props.dice} logError={addToast} />
                    <PortraitContainer portrait={props.portrait} attributes={props.attributes} logError={addToast} />
                </Row>
            </Container>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

function AdminKeyContainer(props: { adminKey: string, logError(err: any): void }) {
    const [lastValue, value, setValue] = useExtendedState(props.adminKey);

    function onBlur() {
        if (value === lastValue) return;
        setValue(value);
        api.post('/config/adminkey', { key: value }).catch(props.logError);
    }

    return (
        <Col className='h5'>
            <label htmlFor='adminKeyField' className='me-2'>Chave do Mestre:</label>
            <BottomTextInput id='adminKeyField' value={value} onChange={ev => setValue(ev.currentTarget.value)} onBlur={onBlur} />
        </Col>
    );
}

function DiceContainer(props: { successTypeEnabled: boolean, diceConfig: DiceConfig, logError(err: any): void }) {
    const [loading, setLoading] = useState(false);
    const [successTypeEnabled, setSuccessTypeEnabled] = useState(props.successTypeEnabled);
    const [baseDiceNum, setBaseDiceNum] = useState(props.diceConfig.base.value);
    const [baseDiceBranched, setBaseDiceBranched] = useState(props.diceConfig.base.branched);
    const [attributeDiceNum, setAttributeDiceNum] = useState(props.diceConfig.attribute.value);
    const [attributeDiceBranched, setAttributeDiceBranched] = useState(props.diceConfig.attribute.branched);

    function onApply() {
        setLoading(true);
        api.post('/config/dice', {
            enableSuccessType: successTypeEnabled,
            diceConfigurations: {
                base: {
                    value: baseDiceNum,
                    branched: baseDiceBranched
                },
                attribute: {
                    value: attributeDiceNum,
                    branched: attributeDiceBranched
                }
            }
        }).then(() => alert('Configurações de dado aplicados com sucesso.')).catch(props.logError).finally(() => setLoading(false));
    }

    return (
        <DataContainer title='Dados' outline className='me-3'>
            <Row className='text-center mt-2'>
                <Col className='h5'>
                    <FormGroup controlId='diceSuccessTypeEnabled'>
                        <FormCheck inline checked={successTypeEnabled} onChange={() => setSuccessTypeEnabled(e => !e)} />
                        <FormLabel className='me-2'>Ativar Tipos de Sucesso</FormLabel>
                    </FormGroup>
                </Col>
            </Row>
            <Row className='text-center'>
                <DataContainer title='Rolagem Base' outline className='mx-3' hidden={!successTypeEnabled}>
                    <Row>
                        <Col className='h5' style={{ color: 'gray' }}>
                            Rolagem base é o tipo de rolagem aplicado a Características e Perícias.
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor='baseeDiceValue' className='me-2'>Valor:</label>
                            <select id='baseeDiceValue' className='theme-element' value={baseDiceNum}
                                onChange={ev => setBaseDiceNum(parseInt(ev.currentTarget.value))}>
                                <option value={20}>d20</option>
                                <option value={100}>d100</option>
                            </select>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col>
                            <FormGroup controlId='baseDiceBranched'>
                                <FormCheck inline checked={baseDiceBranched} onChange={() => setBaseDiceBranched(b => !b)} />
                                <FormLabel className='me-2'>Ativar Ramificações</FormLabel>
                            </FormGroup>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <Row className='text-center mt-2 mb-2'>
                <DataContainer title='Rolagem de Atributo' outline className='mx-3' hidden={!successTypeEnabled}>
                    <Row>
                        <Col className='h5' style={{ color: 'gray' }}>
                            Rolagem de atributo é o tipo de rolagem aplicado a barras de Atributo roláveis.
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label className='me-2' htmlFor='attributeDiceValue'>Valor:</label>
                            <select id='attributeDiceValue' className='theme-element' value={attributeDiceNum}
                                onChange={ev => setAttributeDiceNum(parseInt(ev.currentTarget.value))}>
                                <option value={20}>d20</option>
                                <option value={100}>d100</option>
                            </select>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col>
                            <FormGroup controlId='attributeDiceBranched'>
                                <FormCheck inline checked={attributeDiceBranched} onChange={() => setAttributeDiceBranched(b => !b)} />
                                <FormLabel className='me-2'>Ativar Ramificações</FormLabel>
                            </FormGroup>
                        </Col>
                    </Row>
                </DataContainer>
            </Row>
            <Row className='mb-2'>
                <Col className='text-center'>
                    <Button size='sm' variant='secondary' onClick={onApply} disabled={loading}>Aplicar</Button>
                </Col>
            </Row>
        </DataContainer>
    );
}

type PortraitContainerProps = {
    portrait: { attributes: Attribute[], side_attribute: Attribute, orientation: PortraitOrientation };
    attributes: Attribute[];
    logError(err: any): void;
};

function PortraitContainer(props: PortraitContainerProps) {
    const [loading, setLoading] = useState(false);
    const [attributes, setAttributes] = useState<Attribute[]>(props.portrait.attributes);
    const [sideAttribute, setSideAttribute] = useState(props.portrait.side_attribute);
    const [orientation, setOrientation] = useState<string>(props.portrait.orientation);
    const availableAttributes = props.attributes.filter(attr =>
        !attributes.find(at => at.id === attr.id) && attr.id !== sideAttribute.id);

    function onApply() {
        setLoading(true);
        api.post('/config/portrait', {
            portraitConfigurations: {
                attributes: attributes.map(attr => attr.id),
                side_attribute: sideAttribute.id,
                orientation
            }
        }).then(() => alert('Configurações de retrato aplicados com sucesso.')).catch(props.logError).finally(() => setLoading(false));
    }

    function addAttribute(attr: Attribute) {
        setAttributes([...attributes, attr]);
    }

    function removeAttribute(id: number) {
        const newAttr = [...attributes];
        newAttr.splice(attributes.findIndex(attr => attr.id === id), 1);
        setAttributes(newAttr);
    }

    function onSideAttributeChange(ev: ChangeEvent<HTMLSelectElement>) {
        const id = parseInt(ev.currentTarget.value);
        setSideAttribute(availableAttributes.find(attr => attr.id === id) || sideAttribute);
    }

    return (
        <DataContainer title='Retrato (Extensão OBS)' outline className='ms-3 text-center'>
            <Row className='mt-2'>
                <Col className='h5'>
                    <label htmlFor='portraitOrientation' className='me-2'>Orientação:</label>
                    <select id='portraitOrientation' className='theme-element' value={orientation}
                        onChange={ev => setOrientation(ev.currentTarget.value)}>
                        <option value='center'>Centro</option>
                        <option value='top'>Superior</option>
                        <option value='bottom'>Inferior</option>
                    </select>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col xs={{ offset: 3, span: 6 }} className='h5 align-self-center'>
                    Atributos Principais:
                </Col>
                <Col xs={3}>
                    <DropdownButton title='+' variant='secondary' size='sm'
                        menuVariant='dark' disabled={loading || availableAttributes.length === 0}>
                        {availableAttributes.map(attr =>
                            <DropdownItem key={attr.id} onClick={() => addAttribute(attr)}>{attr.name}</DropdownItem>
                        )}
                    </DropdownButton>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup variant='flush' className='theme-element'>
                        {attributes.map(attr =>
                            <ListGroup.Item key={attr.id} className='theme-element'>
                                {attr.name}
                                <Button size='sm' variant='secondary' className='ms-2'
                                    onClick={() => removeAttribute(attr.id)}>-</Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
            <Row className='my-2'>
                <Col className='h5'>
                    <label htmlFor='portraitSideAttribute' className='me-2'>Atributo Secundário:</label>
                    <select id='portraitSideAttribute' className='theme-element' value={sideAttribute.id}
                        onChange={onSideAttributeChange}>
                        {props.attributes.map(attr => {
                            if (attributes.find(at => at.id === attr.id)) return null;
                            return <option value={attr.id} key={attr.id}>{attr.name}</option>;
                        })}
                    </select>
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    <Button size='sm' variant='secondary' onClick={onApply} disabled={loading}>Aplicar</Button>
                </Col>
            </Row>
        </DataContainer>
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
                adminKey: '',
                enableSuccessTypes: false,
                dice: {} as DiceConfig,
                portrait: { attributes: [] as Attribute[], side_attribute: {} as Attribute, orientation: 'center' as PortraitOrientation },
                attributes: []
            }
        };
    }

    const portraitConfig = JSON.parse((await prisma.config.findUnique({
        where: { name: 'portrait' }, select: { value: true }
    }))?.value || 'null') as PortraitConfig;

    const results = await Promise.all([
        prisma.config.findUnique({ where: { name: 'admin_key' }, select: { value: true } }),
        prisma.config.findUnique({ where: { name: 'enable_success_types' }, select: { value: true } }),
        prisma.config.findUnique({ where: { name: 'dice' }, select: { value: true } }),
        prisma.attribute.findMany({ where: { id: { in: portraitConfig.attributes } } }),
        prisma.attribute.findUnique({ where: { id: portraitConfig.side_attribute } }),
        prisma.attribute.findMany(),
    ]);

    return {
        props: {
            adminKey: results[0]?.value || '',
            enableSuccessTypes: results[1]?.value === 'true',
            dice: JSON.parse(results[2]?.value || 'null') as DiceConfig,
            portrait: {
                attributes: results[3],
                side_attribute: results[4] as Attribute,
                orientation: portraitConfig.orientation || 'bottom'
            },
            attributes: results[5]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);