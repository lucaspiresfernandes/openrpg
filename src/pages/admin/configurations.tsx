
import { Attribute, Prisma } from '@prisma/client';
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
                    <DiceContainer successTypeEnabled={props.enableSuccessTypes} diceConfig={props.diceConfig} logError={addToast} />
                    <PortraitContainer portraitConfig={props.portraitConfig} attributes={props.attributes} logError={addToast} />
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
            <label htmlFor='adminKeyField' className='me-2'>Chave do Administrador:</label>
            <BottomTextInput id='adminKeyField' value={value} onChange={ev => setValue(ev.currentTarget.value)} onBlur={onBlur} />
        </Col>
    );
}

function DiceContainer(props: { successTypeEnabled: boolean, diceConfig: Prisma.JsonObject, logError(err: any): void }) {
    const base = props.diceConfig['base'] as Prisma.JsonObject;
    const attribute = props.diceConfig['attribute'] as Prisma.JsonObject;

    const [loading, setLoading] = useState(false);
    const [successTypeEnabled, setSuccessTypeEnabled] = useState(props.successTypeEnabled);
    const [baseDiceNum, setBaseDiceNum] = useState(base['value'] as number);
    const [baseDiceBranched, setBaseDiceBranched] = useState(base['branched'] as boolean);
    const [attributeDiceNum, setAttributeDiceNum] = useState(attribute['value'] as number);
    const [attributeDiceBranched, setAttributeDiceBranched] = useState(attribute['branched'] as boolean);

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

function PortraitContainer(props: { portraitConfig: Prisma.JsonObject, logError(err: any): void, attributes: Attribute[] }) {
    const attrs = props.portraitConfig['attributes'] as Array<string>;

    const [loading, setLoading] = useState(false);
    const [attributes, setAttributes] = useState<Attribute[]>(props.attributes.filter(attr => {
        if (attrs.includes(attr.name)) return attr;
    }));
    const [sideAttribute, setSideAttribute] = useState(props.attributes.find(attr =>
        attr.name === props.portraitConfig['side_attribute'] as string) || props.attributes[0]);

    const availableAttributes = props.attributes.filter(attr => {
        if (!attributes.includes(attr) && sideAttribute.id !== attr.id) return attr;
    });

    function onApply() {
        setLoading(true);
        api.post('/config/portrait', {
            portraitConfigurations: {
                attributes: attributes.map(attr => attr.name),
                side_attribute: sideAttribute.name
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
        <DataContainer title='Retrato' outline className='ms-3'>
            <Row className='mt-2 text-center'>
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
            <Row className='text-center mb-4 mt-2'>
                <Col>
                    <ListGroup variant='flush' >
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
            <Row className='my-2 text-center'>
                <Col className='h5'>
                    <label htmlFor='portraitSideAttribute' className='me-2'>Atributo Secundário:</label>
                    <select id='portraitSideAttribute' className='theme-element' value={sideAttribute.id}
                        onChange={onSideAttributeChange}>
                        {props.attributes.map(attr => {
                            if (attributes.includes(attr)) return null;
                            return <option value={attr.id} key={attr.id}>{attr.name}</option>;
                        })}
                    </select>
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col className='text-center'>
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
                diceConfig: {} as Prisma.JsonObject,
                portraitConfig: {} as Prisma.JsonObject,
                attributes: []
            }
        };
    }

    const results = await Promise.all([
        prisma.config.findUnique({ where: { name: 'admin_key' } }),
        prisma.config.findUnique({ where: { name: 'enable_success_types' } }),
        prisma.config.findUnique({ where: { name: 'dice' } }),
        prisma.config.findUnique({ where: { name: 'portrait' } }),
        prisma.attribute.findMany(),
    ]);

    return {
        props: {
            adminKey: results[0]?.value || '',
            enableSuccessTypes: JSON.parse(results[1]?.value || '{}') as boolean,
            diceConfig: JSON.parse(results[2]?.value || '{}') as Prisma.JsonObject,
            portraitConfig: JSON.parse(results[3]?.value || '{}') as Prisma.JsonObject,
            attributes: results[4]
        }
    };
}

export const getServerSideProps = sessionSSR(getSSP);