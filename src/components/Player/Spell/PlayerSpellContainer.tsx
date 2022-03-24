import { Spell } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { ErrorLogger, Socket } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AddDataModal from '../../Modals/AddDataModal';
import PlayerSpellField from './PlayerSpellField';

type PlayerSpellContainerProps = {
    playerSpells: Spell[];
    availableSpells: Spell[];
};

export default function PlayerSpellContainer(props: PlayerSpellContainerProps) {
    const [addSpellShow, setAddSpellShow] = useState(false);
    const [spells, setSpells] = useState<{ id: number, name: string }[]>(props.availableSpells);
    const [playerSpells, setPlayerSpells] = useState(props.playerSpells);
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
            const spell = res.data.spell;
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

    return (
        <>
            <DataContainer outline title='Magias' addButton={{ onAdd: () => setAddSpellShow(true) }}>
                <Row className='justify-content-center'>
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