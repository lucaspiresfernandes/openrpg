import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';

export default function NPCContainer() {
    const [npcs, setNPCs] = useState<number[]>([]);

    function addNewNPC() {
        setNPCs([...npcs, Date.now()]);
    }

    function removeNPC(id: number) {
        const newNpcs = [...npcs];
        newNpcs.splice(newNpcs.findIndex(npcID => npcID === id), 1);
        setNPCs(newNpcs);
    }

    return (
        <DataContainer xs={12} lg title='NPCs' addButton={{ type: 'button', onAdd: addNewNPC }}>
            <Row>
                <Col>
                    <div className='w-100 wrapper'>
                        <ListGroup variant='flush' className='text-center'>
                            {npcs.map(id =>
                                <ListGroup.Item key={id}>
                                    <BottomTextInput defaultValue='NPC' className='w-25 mx-1' />
                                    <BottomTextInput type='number' defaultValue='0' style={{ maxWidth: '3rem' }} />
                                    <Button size='sm' variant='secondary' className='ms-1'
                                        onClick={() => removeNPC(id)}>-</Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </DataContainer>
    );
}