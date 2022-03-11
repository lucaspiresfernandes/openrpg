import { Attribute } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type AttributeEditorProps = {
    attribute: Attribute[];
}

export default function AttributeEditor(props: AttributeEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}