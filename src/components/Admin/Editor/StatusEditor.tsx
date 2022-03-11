import { AttributeStatus } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type StatusEditorProps = {
    attributeStatus: AttributeStatus[];
}

export default function StatusEditor(props: StatusEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}