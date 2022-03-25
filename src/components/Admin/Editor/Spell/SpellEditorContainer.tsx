import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminTable from '../../AdminTable';
import SpellEditorField from './SpellEditorField';
import { useContext, useState } from 'react';
import { Spell } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateSpellModal from '../../../Modals/CreateSpellModal';

type SpellEditorContainerProps = {
    spells: Spell[];
}

export default function SpellEditorContainer(props: SpellEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showSpellModal, setShowSpellModal] = useState(false);
    const [spell, setSpell] = useState(props.spells);

    function createSpell(name: string, description: string, cost: string, type: string,
        damage: string, castingTime: string, range: string, duration: string) {
        api.put('/sheet/spell', { name, description, cost, type, damage, castingTime, range, duration }).then(res => {
            const id = res.data.id;
            setSpell([...spell, { id, name, description, cost, type, damage, castingTime, range, duration, visible: true }]);
        }).catch(logError);
    }

    function deleteSpell(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse spell?')) return;
        api.delete('/sheet/spell', { data: { id } }).then(() => {
            const newSpell = [...spell];
            const index = newSpell.findIndex(spell => spell.id === id);
            if (index > -1) {
                newSpell.splice(index, 1);
                setSpell(newSpell);
            }
        }).catch(logError);
    }

    return (
        <>
            <DataContainer outline title='Magias'
                addButton={{ onAdd: () => setShowSpellModal(true) }}>
                <Row>
                    <Col>
                        <AdminTable centerText>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th title='Nome da Magia.'>Nome</th>
                                    <th title='Descrição da Magia.'>Descrição</th>
                                    <th title='Custo da Magia.'>Custo</th>
                                    <th title='Tipo da Magia.'>Tipo</th>
                                    <th title='Dano da Magia.'>Dano</th>
                                    <th title='Tempo de conjuração da Magia.'>Tempo de Conjuração</th>
                                    <th title='Alcance, em metros, da Magia.'>Alcance</th>
                                    <th title='Duração da Magia.'>Duração</th>
                                    <th title='Define se a Magia será visível para o jogador.'>Visível</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spell.map(spell =>
                                    <SpellEditorField key={spell.id}
                                        spell={spell} onDelete={deleteSpell} />
                                )}
                            </tbody>
                        </AdminTable>
                    </Col>
                </Row>
            </DataContainer>
            <CreateSpellModal show={showSpellModal} onHide={() => setShowSpellModal(false)}
                onCreate={createSpell} />
        </>
    );
}