import { Equipment, Skill } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import EquipmentEditorField from './EquipmentEditorField';

type EquipmentEditorProps = {
    equipment: Equipment[];
    skills: Skill[];
    onDelete(id: number): void;
}

export default function EquipmentEditor(props: EquipmentEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive className='align-middle text-center'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Perícia</th>
                            <th>Tipo</th>
                            <th>Dano</th>
                            <th>Alcance</th>
                            <th>Ataques</th>
                            <th>Munição</th>
                            <th>Visível</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.equipment.map(eq =>
                            <EquipmentEditorField key={eq.id} equipment={eq}
                                onDelete={props.onDelete} skills={props.skills} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}