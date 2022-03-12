import { Spec } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import SpecEditorField from './SpecEditorField';

type SpecEditorProps = {
    spec: Spec[];
    onDelete(id: number): void;
}

export default function SpecEditor(props: SpecEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.spec.map(spec =>
                            <SpecEditorField key={spec.id}
                                spec={spec} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}