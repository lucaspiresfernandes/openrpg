import { Equipment } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { RetrieveSocket } from '../../../contexts';

type EquipmentFieldProps = {
    playerID: number;
    equipments: {
        Equipment: Equipment;
        currentAmmo: number | null;
    }[];
}

export default function EquipmentField(props: EquipmentFieldProps) {
    return (
        <>
            <Row>
                <Col className='h3'>
                    Equipamentos
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Dano</th>
                                <th>Tipo</th>
                                <th>Alcance</th>
                                <th>Ataques</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.equipments.map(equip =>
                                <tr key={equip.Equipment.id}>
                                    <td>{equip.Equipment.name}</td>
                                    <td>{equip.Equipment.damage}</td>
                                    <td>{equip.Equipment.type}</td>
                                    <td>{equip.Equipment.range}</td>
                                    <td>{equip.Equipment.attacks}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}