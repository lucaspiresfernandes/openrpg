import { FormEvent, useState } from 'react';
import { Button, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { clamp } from '../../utils';
import BottomTextInput from '../BottomTextInput';
import DataContainer from '../DataContainer';
import { PlayerName } from './DiceList';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

export default function CombatContainer({ players }: { players: PlayerName[] }) {
    const [round, setRound] = useState(1);
    const [entities, setEntities] = useState<string[]>([]);
    const [pointer, setPointer] = useState(0);

    const SortableItem = SortableElement((props: { value: string, selected?: boolean, count: number }) => {
        return (
            <ListGroup.Item className={props.selected ? 'selected' : ''}>
                <BottomTextInput defaultValue={props.value} className='text-center' />
                <Button size='sm' variant='secondary' className='ms-1' onClick={() => removeEntity(props.count)}>-</Button>
            </ListGroup.Item>
        );
    });

    const SortableList = SortableContainer(({ items }: { items: string[] }) => {
        return (
            <ListGroup variant='flush' className='text-center'>
                {items.map((val: any, index: number) =>
                    <SortableItem key={val} index={index} count={index} value={val} selected={pointer === index} />
                )}
            </ListGroup>
        );
    });

    const dropdown = (
        <>
            {players.map(pl => {
                if (entities.find(e => e === pl.name)) return null;
                return (
                    <Dropdown.Item key={pl.id} onClick={ev => setEntities([...entities, pl.name])}>
                        {pl.name}
                    </Dropdown.Item>
                );
            })}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setEntities([...entities, `NPC ${entities.length}`])}>
                Novo...
            </Dropdown.Item>
        </>
    );

    function roundUpdate(ev: FormEvent<HTMLInputElement>) {
        const aux = ev.currentTarget.value;
        let newRound = parseInt(aux);
        if (aux.length === 0) newRound = 1;
        else if (isNaN(newRound)) return;
        setRound(clamp(newRound, 1, 100));
    }

    function onSortEnd({ oldIndex, newIndex }: SortEnd) {
        if (oldIndex === newIndex) return;
        setEntities(entities => arrayMoveImmutable(entities, oldIndex, newIndex));
        if (oldIndex === pointer) return setPointer(newIndex);
        if (newIndex >= pointer && oldIndex < pointer) return setPointer(pointer - 1);
        if (oldIndex > pointer && newIndex <= pointer) return setPointer(pointer + 1);
    }

    function movePointer(coeff: number) {
        let currentIndex = pointer + coeff;
        if (currentIndex < 0) currentIndex = entities.length - 1;
        else if (currentIndex >= entities.length) currentIndex = 0;
        setPointer(currentIndex);
    }

    function removeEntity(index: number) {
        if (index < pointer) setPointer(pointer - 1);
        const newEntities = [...entities];
        newEntities.splice(index, 1);
        setEntities(newEntities);
    }

    function emptyList() {
        setEntities([]);
        setPointer(0);
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
                        <SortableList items={entities} onSortEnd={onSortEnd} />
                    </div>
                </Col>
            </Row>
            <Row className='mt-3 justify-content-center'>
                <Col>
                    <Button size='sm' variant='secondary' onClick={() => movePointer(-1)}>
                        Anterior
                    </Button>
                </Col>
                <Col>
                    <Button size='sm' variant='secondary' onClick={emptyList}>
                        Limpar
                    </Button>
                </Col>
                <Col>
                    <Button size='sm' variant='secondary' onClick={() => movePointer(1)}>
                        Próximo
                    </Button>
                </Col>
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