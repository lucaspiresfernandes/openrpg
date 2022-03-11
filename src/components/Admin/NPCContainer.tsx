import React, { ChangeEvent, useState } from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

export default function NPCContainer() {
    const [names, setNames] = useState<string[]>([]);

    function addNewNPC() {
        setNames([...names, `NPC ${names.length}`]);
    }

    function changeNPC(ev: ChangeEvent<HTMLInputElement>, index: number) {
        const newNpcs = [...names];
        newNpcs[index] = ev.currentTarget.value;
        setNames(newNpcs);
    }

    function removeNPC(index: number) {
        const newNpcs = [...names];
        newNpcs.splice(index, 1);
        setNames(newNpcs);
    }

    return (
        <DataContainer xs={12} lg title='NPCs' addButton={{ type: 'button', onAdd: addNewNPC }}>
            <Row>
                <Col>
                    <div className='w-100 wrapper'>
                        <ListGroup variant='flush' className='text-center'>
                            {names.map((name, index) =>
                                <ListGroup.Item key={index}>
                                    <BottomTextInput value={name} onChange={ev => changeNPC(ev, index)} className='w-25 mx-1' />
                                    <BottomTextInput type='number' defaultValue='0' className='w-25' />
                                    <Button size='sm' variant='secondary' className='ms-1'
                                        onClick={() => removeNPC(index)}>-</Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </DataContainer>
    );
}