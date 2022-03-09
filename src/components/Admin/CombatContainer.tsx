import { FormEvent, useState } from 'react';
import { Button, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { clamp } from '../../utils';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

export default function CombatContainer() {
    const [round, setRound] = useState(1);
    const [entities, setEntities] = useState<string[]>([]);

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

    function roundUpdate(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newRound = parseInt(aux);
        if (aux.length === 0) newRound = 1;
        else if (isNaN(newRound)) return;
        setRound(clamp(newRound, 1, 100));
    }

    return (
        <DataContainer xs={12} lg title='Combate' addButton={{ type: 'dropdown', children: dropdown }} >
            <Row className='my-2'>
                <Col>
                    <label className='h5' htmlFor='combatRound'>Rodada:</label>
                    <BottomTextInput type='number' id='combatRound' className='h4' value={round}
                        onChange={roundUpdate} />
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