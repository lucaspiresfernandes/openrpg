import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminTable from '../../AdminTable';
import EquipmentEditorField from './EquipmentEditorField';
import { useContext, useState } from 'react';
import { Equipment } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateEquipmentModal from '../../../Modals/CreateEquipmentModal';

type EquipmentEditorContainerProps = {
    equipments: Equipment[];
}

export default function EquipmentEditorContainer(props: EquipmentEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showEquipmentModal, setShowEquipmentModal] = useState(false);
    const [equipment, setEquipment] = useState(props.equipments);

    function createEquipment(name: string, type: string, damage: string, range: string,
        attacks: string, ammo: number | null = null) {
        api.put('/sheet/equipment', { name, type, damage, range, attacks, ammo }).then(res => {
            const id = res.data.id;
            setEquipment([...equipment, { id, name, type, damage, range, attacks, ammo, visible: true }]);
        }).catch(logError);
    }

    function deleteEquipment(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/equipment', { data: { id } }).then(() => {
            const newEquipment = [...equipment];
            const index = newEquipment.findIndex(eq => eq.id === id);
            if (index > -1) {
                newEquipment.splice(index, 1);
                setEquipment(newEquipment);
            }
        }).catch(logError);
    }

    return (
        <>
            <DataContainer outline title='Equipamentos'
                addButton={{ onAdd: () => setShowEquipmentModal(true) }}>
                <Row>
                    <Col>
                        <AdminTable centerText>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th title='Nome do Equipamento.'>Nome</th>
                                    <th title='Tipo do Equipamento.'>Tipo</th>
                                    <th title='Dano do Equipamento.'>Dano</th>
                                    <th title='Alcance, em metros, do Equipamento.'>Alcance</th>
                                    <th title='Números de ataques por round do Equipamento.'>Ataques</th>
                                    <th title='Munição total do Equipamento.'>Munição</th>
                                    <th title='Define se o Equipamento será visível para o jogador.'>Visível</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map(equipment =>
                                    <EquipmentEditorField key={equipment.id}
                                        equipment={equipment} onDelete={deleteEquipment} />
                                )}
                            </tbody>
                        </AdminTable>
                    </Col>
                </Row>
            </DataContainer>
            <CreateEquipmentModal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)}
                onCreate={createEquipment} />
        </>
    );
}