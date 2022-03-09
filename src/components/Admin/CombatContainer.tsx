import { Button, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

export default function CombatContainer() {

    function addPlayer() {

    }

    function addNPC() {

    }

    const dropdown = (
        <>
            <Dropdown.Divider />
            <Dropdown.Item onClick={addNPC}>Novo...</Dropdown.Item>
        </>
    );

    return (
        <DataContainer xs={12} lg title='Combate' addButton={{ type: 'dropdown', children: dropdown }} >
            <Row className='my-2'>
                <Col>
                    <label className='h5' htmlFor='combatRound'>Rodada:</label>
                    <BottomTextInput type='number' id='combatRound' className='h4' value={1} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='w-100 wrapper'>
                        <ListGroup variant='flush' className='text-center'>
                        </ListGroup>
                    </div>
                </Col>
            </Row>
            <Row className='mt-3 justify-content-center'>
                <Col><Button size='sm' variant='secondary'>Anterior</Button></Col>
                <Col><Button size='sm' variant='secondary'>Limpar</Button></Col>
                <Col><Button size='sm' variant='secondary'>Próximo</Button></Col>
            </Row>
        </DataContainer>

        // <Row className='mx-2'>
        // <Col xs={{ offset: 3 }} className='h2 text-center'>Combate</Col>
        // <Col xs={3} className='align-self-center'>
        // <DropdownButton title='+' >
        //     {/*All players names here*/}
        //     <Dropdown.Divider />
        //     <Dropdown.Item>Novo...</Dropdown.Item>
        // </DropdownButton>
        // </Col>
        // <hr />
        // </Row>
    );
}