import { Attribute, AttributeStatus } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import StatusEditorField from './StatusEditorField';

type StatusEditorProps = {
    attributeStatus: AttributeStatus[];
    attributes: Attribute[];
    onDelete(id: number): void;
}

export default function StatusEditor(props: StatusEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Atributo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.attributeStatus.map(stat =>
                            <StatusEditorField key={stat.id} attributeStatus={stat}
                                attributes={props.attributes} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}