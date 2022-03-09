import { GetServerSidePropsContext } from 'next';
import { createContext, useRef } from 'react';
import { Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Form, Image, ListGroup, Row } from 'react-bootstrap';
import AdminGlobalConfigurations from '../../../components/Admin/AdminGlobalConfigurations';
import PlayerContainer from '../../../components/Admin/PlayerContainer';
import AdminNavbar from '../../../components/AdminNavbar';
import DataContainer from '../../../components/DataContainer';
import ErrorToastContainer from '../../../components/ErrorToastContainer';
import PlayerAnnotationsField from '../../../components/Player/PlayerAnnotationField';
import WrapperContainer from '../../../components/WrapperContainer';
import useToast from '../../../hooks/useToast';
import { sessionSSR } from '../../../utils/session';

export const errorLogger = createContext<(err: any) => void>(() => { });

export default function Admin1() {
    const [toasts, addToast] = useToast();

    const environment = useRef('combat');

    function onEnvironmentChanged() {
        environment.current = environment.current === 'combat' ? 'idle' : 'combat';
        console.log(environment.current);
    }

    return (
        <>
            <AdminNavbar />
            <errorLogger.Provider value={addToast}>
                <Container>
                    <Row className='display-5 text-center'>
                        <Col>
                            Painel do Administrador
                        </Col>
                    </Row>
                    <Row className='my-4'>
                        <Col className='text-center h5'>
                            <AdminGlobalConfigurations environment='combat' />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col xs={12} md={6} xl={4} className='text-center'>
                            <Row className='mx-md-1 data-container h-100'>
                                <Col>
                                    <PlayerContainer />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='my-3 text-center'>
                        <Col xs={12} lg className='my-2'>
                            <Row className='mx-2 text-center'>
                                <Col className='h2'>Rolagem</Col>
                                <hr />
                            </Row>
                            <Row className='mb-3 justify-content-center'>
                                <Col xs={3}>
                                    <Row>
                                        <Col className='h5'>Geral</Col>
                                    </Row>
                                    <Row>
                                        <Image fluid src='/dice20.png' alt='Dado' className='clickable' />
                                    </Row>
                                </Col>
                                <Col xs={3}>
                                    <Row>
                                        <Col className='h5'>Rápido</Col>
                                    </Row>
                                    <Row>
                                        <Image fluid src='/dice20.png' alt='Dado' className='clickable' />
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} lg className='my-2'>
                            <Row className='mx-2'>
                                <Col xs={{ offset: 3 }} className='h2 text-center'>Combate</Col>
                                <Col xs={3} className='align-self-center'>
                                    <DropdownButton title='+' >
                                        {/*All players names here*/}
                                        <Dropdown.Divider />
                                        <Dropdown.Item>Novo...</Dropdown.Item>
                                    </DropdownButton>
                                </Col>
                                <hr />
                            </Row>
                            <Row className='my-2'>
                                <Col>
                                    <label className='h5' htmlFor='combatRound'>Rodada:</label>
                                    <input type='number' id='combatRound' className='h4 theme-element bottom-text' value={1} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <WrapperContainer className='w-100'>
                                        <ListGroup variant='flush'>
                                        </ListGroup>
                                    </WrapperContainer>
                                </Col>
                            </Row>
                            <Row className='mt-2 justify-content-center'>
                                <Col><Button size='sm' variant='secondary'>Anterior</Button></Col>
                                <Col><Button size='sm' variant='secondary'>Limpar</Button></Col>
                                <Col><Button size='sm' variant='secondary'>Próximo</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='my-3'>
                        <Col xs={12} lg className='my-2'>
                            <Row className='mx-2 text-center'>
                                <Col className='h2 '>Histórico</Col>
                                <hr />
                            </Row>
                            <Row>
                                <Col>
                                    <WrapperContainer className='w-100'>
                                        <ListGroup variant='flush'>
                                        </ListGroup>
                                    </WrapperContainer>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} lg className='my-2'>
                            <Row className='mx-2'>
                                <Col xs={{ offset: 3 }} className='h2 text-center'>NPCs</Col>
                                <Col xs={3} className='align-self-center'>
                                    <Button variant='dark'>+</Button>
                                </Col>
                                <hr />
                            </Row>
                            <Row>
                                <Col>
                                    <WrapperContainer className='w-100'>
                                        <ListGroup variant='flush'>
                                        </ListGroup>
                                    </WrapperContainer>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='my-3'>
                        <DataContainer title='Anotações' htmlFor='playerAnnotations'>
                            <PlayerAnnotationsField value={''} />
                        </DataContainer>
                    </Row>
                </Container>
            </errorLogger.Provider>
            <ErrorToastContainer toasts={toasts} />
        </>
    );
}

export const getServerSideProps = sessionSSR(
    async function getServerSideProps(ctx: GetServerSidePropsContext) {
        const user = ctx.req.session.player;
        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            };
        }
        return { props: {} };
    }
);