import { Item } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';

type ItemEditorProps = {
    item: Item[];
}

export default function ItemEditor(props: ItemEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>

                </Table>
            </Col>
        </Row>
    );
}