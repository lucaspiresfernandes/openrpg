import { Spell } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ErrorLogger, Socket } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AddDataModal from '../../Modals/AddDataModal';
import PlayerSpellField from './PlayerSpellField';
import useExtendedState from '../../../hooks/useExtendedState';
import BottomTextInput from '../../BottomTextInput';

type PlayerSpellContainerProps = {
    playerSpells: Spell[];
    availableSpells: Spell[];
    playerMaxSlots: number;
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
            <DataContainer outline title='Magias' addButton={{ onAdd: () => setAddSpellShow(true) }}>
                <Row className='justify-content-center'>
                    <Row className='mb-2'>
                        <Col className='text-center h5'>
                            <span className='me-2'>Espaços de Magia: </span>
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
            <AddDataModal title='Adicionar Magia' show={addSpellShow} onHide={() => setAddSpellShow(false)}
                data={spells} onAddData={onAddSpell} />
        </>
    );
}