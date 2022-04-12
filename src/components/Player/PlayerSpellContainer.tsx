import { Spell } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ErrorLogger, Socket } from '../../contexts';
import api from '../../utils/api';
import DataContainer from '../DataContainer';
import AddDataModal from '../Modals/AddDataModal';
import useExtendedState from '../../hooks/useExtendedState';
import BottomTextInput from '../BottomTextInput';

type PlayerSpellContainerProps = {
    playerSpells: Spell[];
    availableSpells: Spell[];
    playerMaxSlots: number;
    title: string;
};

export default function PlayerSpellContainer(props: PlayerSpellContainerProps) {
    const [addSpellShow, setAddSpellShow] = useState(false);
    const [spells, setSpells] = useState<{ id: number, name: string }[]>(props.availableSpells);
    const [playerSpells, setPlayerSpells] = useState(props.playerSpells);
    const [lastMaxSlots, maxSlots, setMaxSlots] = useExtendedState(props.playerMaxSlots.toString());
    const playerSpellsRef = useRef(playerSpells);
    playerSpellsRef.current = playerSpells;
    const logError = useContext(ErrorLogger);
    const socket = useContext(Socket);

    useEffect(() => {
        if (!socket) return;

        socket.on('playerSpellAdd', (id, name) => {
            setSpells(spells => {
                if (spells.findIndex(spell => spell.id === id) > -1 ||
                    playerSpellsRef.current.findIndex(spell => spell.id === id) > -1)
                    return spells;
                return [...spells, { id, name }];
            });
        });

        socket.on('playerSpellRemove', (id) => {
            setSpells(spells => {
                const index = spells.findIndex(spell => spell.id === id);
                if (index === -1) return spells;

                const newSpells = [...spells];
                newSpells.splice(index, 1);
                return newSpells;
            });
        });

        socket.on('playerSpellChange', (id, spell) => {
            setPlayerSpells(spells => {
                const index = spells.findIndex(spell => spell.id === id);
                if (index === -1) return spells;

                const newSpells = [...spells];
                newSpells[index] = spell;
                return newSpells;
            });

            setSpells(spells => {
                const index = spells.findIndex(spell => spell.id === id);
                if (index === -1) return spells;

                const newSpells = [...spells];
                newSpells[index].name = spell.name;
                return newSpells;
            });
        });

        return () => {
            socket.off('playerSpellAdd');
            socket.off('playerSpellRemove');
            socket.off('playerSpellChange');
        };
    });

    function onAddSpell(id: number) {
        api.put('/sheet/player/spell', { id }).then(res => {
            const spell = res.data.spell as Spell;
            setPlayerSpells([...playerSpells, spell]);

            const newSpells = [...spells];
            newSpells.splice(newSpells.findIndex(spell => spell.id === id), 1);
            setSpells(newSpells);
        }).catch(logError);
    }

    function onDeleteSpell(id: number) {
        const newPlayerSpells = [...playerSpells];
        const index = newPlayerSpells.findIndex(spell => spell.id === id);

        newPlayerSpells.splice(index, 1);
        setPlayerSpells(newPlayerSpells);

        const modalSpell = { id, name: playerSpells[index].name };
        setSpells([...spells, modalSpell]);
    }

    function onMaxSlotsBlur() {
        if (maxSlots === lastMaxSlots) return;
        let maxSlotsFloat = parseFloat(maxSlots);
        if (isNaN(maxSlotsFloat)) {
            maxSlotsFloat = 0;
            setMaxSlots(maxSlotsFloat.toString());
        }
        else setMaxSlots(maxSlots);
        api.post('/sheet/player', { maxSlots: maxSlotsFloat }).catch(logError);
    }

    const slots = playerSpells.reduce((prev, cur) => prev + cur.slots, 0);
    const colorStyle = { color: slots > parseFloat(maxSlots) ? 'red' : 'inherit' };

    return (
        <>
            <DataContainer outline title={props.title} addButton={{ onAdd: () => setAddSpellShow(true) }}>
                <Row className='justify-content-center'>
                    <Row className='mb-2'>
                        <Col className='text-center h5'>
                            <span className='me-2'>Espaços: </span>
                            <span style={colorStyle}> {slots} /</span>
                            <BottomTextInput value={maxSlots} onChange={ev => setMaxSlots(ev.currentTarget.value)}
                                onBlur={onMaxSlotsBlur} className='text-center' style={{ ...colorStyle, maxWidth: '3rem' }} />
                        </Col>
                    </Row>
                    {playerSpells.map(spell =>
                        <PlayerSpellField key={spell.id} spell={spell} onDelete={onDeleteSpell} />
                    )}
                </Row>
            </DataContainer>
            <AddDataModal title='Adicionar' show={addSpellShow} onHide={() => setAddSpellShow(false)}
                data={spells} onAddData={onAddSpell} />
        </>
    );
}

type PlayerSpellFieldProps = {
    spell: Spell;
    onDelete(id: number): void;
}

function PlayerSpellField({ spell, onDelete }: PlayerSpellFieldProps) {
    const logError = useContext(ErrorLogger);
    const [loading, setLoading] = useState(false);

    function deleteSpell() {
        if (!confirm('Tem certeza que deseja apagar essa magia?')) return;
        setLoading(true);
        api.delete('/sheet/player/spell', { data: { id: spell.id } }).then(() => {
            onDelete(spell.id);
        }).catch(logError).finally(() => setLoading(false));
    }

    return (
        <Col xs={12} className='mb-3 w-100 text-center'>
            <Row>
                <Col className='data-container mx-3'>
                    <Row className='mt-2'>
                        <Col className='h2'>
                            {spell.name}
                            <Button className='ms-3' variant='secondary' size='sm' onClick={deleteSpell} disabled={loading}>
                                Apagar
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='h5' style={{ color: 'darkgray' }}>
                            {spell.description}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Custo: {spell.cost}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Tipo: {spell.type}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Dano: {spell.damage}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Alvo: {spell.target}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Tempo de Conjuração: {spell.castingTime}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Alcance: {spell.range}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Duração: {spell.duration}
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col>
                            Espaços Utilizados: {spell.slots}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}