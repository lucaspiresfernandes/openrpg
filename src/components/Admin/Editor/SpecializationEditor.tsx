import { Specialization } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type SpecializationEditor = {
    specialization: Specialization[];
}

export default function SpecializationEditor(props: SpecializationEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}