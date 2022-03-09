import { Col, Image, Row } from 'react-bootstrap';
import DataContainer from '../DataContainer';

export default function DiceContainer() {
    return (
        <DataContainer xs={12} lg title='Rolagem'>
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
        </DataContainer>
    );
}