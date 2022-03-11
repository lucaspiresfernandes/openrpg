import { Equipment } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type EquipmentEditorProps = {
    equipment: Equipment[];
}

export default function EquipmentEditor(props: EquipmentEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}