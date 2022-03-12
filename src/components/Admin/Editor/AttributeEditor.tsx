import { Attribute } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import AttributeEditorField from './AttributeEditorField';

type AttributeEditorProps = {
    attribute: Attribute[];
    onDelete(id: number): void;
}

export default function AttributeEditor(props: AttributeEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Testável</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.attribute.map(attr =>
                            <AttributeEditorField key={attr.id} attribute={attr} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}