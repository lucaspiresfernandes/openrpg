import { Equipment, Skill } from '@prisma/client';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import PlayerEquipmentField from './PlayerEquipmentField';

type PlayerEquipmentContainerProps = {
    playerEquipments: PlayerEquipment[];
}

type PlayerEquipment = {
    currentAmmo: number;
    using: boolean;
    Equipment: Equipment & {
        Skill: Skill;
    };
};

export default function PlayerEquipmentContainer(props: PlayerEquipmentContainerProps) {
    const [equipments, setIds] = useState<PlayerEquipment[]>(props.playerEquipments);

    function onDelete(id: number) {
        const newIds = [...equipments];
        const index = newIds.findIndex(_id => id === id);
        if (index > -1) {
            newIds.splice(index, 1);
            setIds(newIds);
        }
    }

    return (
        <Table responsive variant='dark' className='align-middle'>
            <thead>
                <tr>
                    <th></th>
                    <th>Usando</th>
                    <th>Nome</th>
                    <th>Perícia</th>
                    <th>Tipo</th>
                    <th>Dano</th>
                    <th></th>
                    <th>Alcance</th>
                    <th>Ataques</th>
                    <th>Mun. Atual</th>
                    <th>Mun. Máxima</th>
                </tr>
            </thead>
            <tbody>
                {equipments.map(eq =>
                    <PlayerEquipmentField key={eq.Equipment.id} equipment={eq.Equipment}
                        currentAmmo={eq.currentAmmo} using={eq.using} onDelete={onDelete} />
                )}
            </tbody>
        </Table>
    );
}