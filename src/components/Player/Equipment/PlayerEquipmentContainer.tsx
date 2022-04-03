import { Equipment } from '@prisma/client';
import { useContext, useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { ErrorLogger, Socket } from '../../../contexts';
import { ResolvedDice } from '../../../utils';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import AddDataModal from '../../Modals/AddDataModal';
import PlayerEquipmentField from './PlayerEquipmentField';

type PlayerEquipmentContainerProps = {
    playerEquipments: {
        currentAmmo: number;
        Equipment: {
            id: number;
            ammo: number | null;
            attacks: string;
            damage: string;
            name: string;
            range: string;
            type: string;
        };
    }[];
    availableEquipments: Equipment[];
};

export default function PlayerEquipmentContainer(props: PlayerEquipmentContainerProps) {
    const [addEquipmentShow, setAddEquipmentShow] = useState(false);
    const [equipments, setEquipments] = useState<{ id: number, name: string }[]>(props.availableEquipments);
    const [playerEquipments, setPlayerEquipments] = useState(props.playerEquipments);
    const playerEquipmentsRef = useRef(playerEquipments);
    playerEquipmentsRef.current = playerEquipments;
    const socket = useContext(Socket);
    const logError = useContext(ErrorLogger);

    useEffect(() => {
        if (!socket) return;

        socket.on('playerEquipmentAdd', (id, name) => {
            setEquipments(equipments => {
                if (equipments.findIndex(eq => eq.id === id) > -1 ||
                    playerEquipmentsRef.current.findIndex(eq => eq.Equipment.id === id) > -1)
                    return equipments;
                return [...equipments, { id, name }];
            });
        });

        socket.on('playerEquipmentRemove', (id, hardRemove) => {
            if (hardRemove) {
                setPlayerEquipments(playerEquipments => {
                    const index = playerEquipments.findIndex(eq => eq.Equipment.id === id);
                    if (index === -1) return playerEquipments;
                    const newEquipments = [...playerEquipments];
                    newEquipments.slice(index, 1);
                    return newEquipments;
                });
            }
            setEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.id === id);
                if (index === -1) return equipments;
                const newEquipments = [...equipments];
                newEquipments.splice(index, 1);
                return newEquipments;
            });
        });

        socket.on('playerEquipmentChange', (id, equip) => {
            setPlayerEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.Equipment.id === id);
                if (index === -1) return equipments;
                const newEquipments = [...equipments];
                newEquipments[index].Equipment = equip;
                return newEquipments;
            });

            setEquipments(equipments => {
                const index = equipments.findIndex(eq => eq.id === id);
                if (index === -1) return equipments;
                const newEquipments = [...equipments];
                newEquipments[index].name = equip.name;
                return newEquipments;
            });
        });

        return () => {
            socket.off('playerEquipmentAdd');
            socket.off('playerEquipmentRemove');
            socket.off('playerEquipmentChange');
        };
    }, [socket]);

    function onAddEquipment(id: number) {
        api.put('/sheet/player/equipment', { id }).then(res => {
            const equipment = res.data.equipment;
            setPlayerEquipments([...playerEquipments, equipment]);

            const newEquipments = [...equipments];
            newEquipments.splice(newEquipments.findIndex(eq => eq.id === id), 1);
            setEquipments(newEquipments);
        }).catch(logError);
    }

    function onDeleteEquipment(id: number) {
        const newPlayerEquipments = [...playerEquipments];
        const index = newPlayerEquipments.findIndex(eq => eq.Equipment.id === id);

        if (index === -1) return;

        newPlayerEquipments.splice(index, 1);
        setPlayerEquipments(newPlayerEquipments);

        const modalEquipment = { id, name: playerEquipments[index].Equipment.name };
        setEquipments([...equipments, modalEquipment]);
    }

    return (
        <>
            <DataContainer outline title='Combate' addButton={{ onAdd: () => setAddEquipmentShow(true) }}>
                <Row className='mb-3 text-center'>
                    <Col>
                        <Table responsive className='align-middle'>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
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
                                {playerEquipments.map(eq =>
                                    <PlayerEquipmentField key={eq.Equipment.id} equipment={eq.Equipment}
                                        currentAmmo={eq.currentAmmo} onDelete={onDeleteEquipment} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <AddDataModal title='Adicionar Equipamento' show={addEquipmentShow} onHide={() => setAddEquipmentShow(false)}
                data={equipments} onAddData={onAddEquipment} />
        </>
    );
}