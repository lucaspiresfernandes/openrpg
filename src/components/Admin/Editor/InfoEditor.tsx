import { Info } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type InfoEditorProps = {
    info: Info[];
}

export default function InfoEditor(props: InfoEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}