import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

export default function NPCContainer() {

    function addNewNPC() {

    }

    return (
        <DataContainer xs={12} lg title='NPCs' addButton={{ type: 'button', onAdd: addNewNPC }}>
            <Row>
                <Col>
                    <div className='w-100 wrapper'>
                        <ListGroup variant='flush' className='text-center'>
                            <ListGroup.Item>
                                <BottomTextInput />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <BottomTextInput />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <BottomTextInput />
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </DataContainer>
    );
}