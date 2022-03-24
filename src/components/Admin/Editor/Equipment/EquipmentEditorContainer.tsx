import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
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
                        <Table responsive className='align-middle text-center'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Dano</th>
                                    <th>Alcance</th>
                                    <th>Ataques</th>
                                    <th>Munição</th>
                                    <th>Visível</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map(equipment =>
                                    <EquipmentEditorField key={equipment.id}
                                        equipment={equipment} onDelete={deleteEquipment} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <CreateEquipmentModal show={showEquipmentModal} onHide={() => setShowEquipmentModal(false)}
                onCreate={createEquipment} />
        </>
    );
}