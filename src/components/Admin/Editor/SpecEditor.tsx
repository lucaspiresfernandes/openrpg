import { Spec } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type SpecEditorProps = {
    spec: Spec[];
}

export default function SpecEditor(props: SpecEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}