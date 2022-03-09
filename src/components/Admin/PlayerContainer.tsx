import { Button, Col, Image, Row, Table } from 'react-bootstrap';

export default function PlayerContainer() {
    return (
        <>
            <Row className='my-2'>
                <Col>
                    <Button size='sm' variant='secondary'>Apagar</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Image fluid src='avatar' alt='avatar' />
                </Col>
            </Row>
            <Row>
                <Col>
                    Player Name
                </Col>
            </Row>
            <Row>
                <>
                    <Col>
                        <Row>
                            Attribute
                        </Row>
                        <Row>
                            Attribute Name
                        </Row>
                    </Col>
                </>
            </Row>
            <hr />

            <Row>
                <>
                    <Col>
                        <Row>
                            Spec
                        </Row>
                        <Row>
                            Spec Name
                        </Row>
                    </Col>
                </>
            </Row>
            <hr />

            <Row>
                <>
                    <Col>
                        <Row>
                            Characteristic
                        </Row>
                        <Row>
                            Characteristic Name
                        </Row>
                    </Col>
                </>
            </Row>
            <hr />

            <Row>
                <Col className='h3'>
                    Equipamentos
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive>
                        {/* Equipment Data */}
                    </Table>
                </Col>
            </Row>
            <hr />

            <Row>
                <Col className='h3'>
                    Inventário
                </Col>
            </Row>
            <Row className='mb-2'>
                <Col>
                    <Table responsive>
                        {/* Item Data */}
                    </Table>
                </Col>
            </Row>
        </>
    );
}