import { Col, ListGroup, Row } from 'react-bootstrap';
import DataContainer from '../DataContainer';

export default function DiceList() {
    return (
        <DataContainer xs={12} lg title='Histórico'>
            <Row>
                <Col>
                    <div className='w-100 wrapper'>
                        <ListGroup variant='flush' className='text-center'>
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </DataContainer>
    );
}