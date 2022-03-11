import { Characteristic } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type CharacteristicEditorProps = {
    characteristic: Characteristic[];
}

export default function CharacteristicEditor(props: CharacteristicEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}