import { ExtraInfo } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type ExtraInfoEditorProps = {
    extraInfo: ExtraInfo[];
}

export default function ExtraInfoEditor(props: ExtraInfoEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}