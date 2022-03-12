import { Specialization } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import SpecializationEditorField from './SpecializationEditorField';

type SpecializationEditorProps = {
    specialization: Specialization[];
    onDelete(id: number): void;
}

export default function SpecializationEditor(props: SpecializationEditorProps) {
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
                        {props.specialization.map(specialization =>
                            <SpecializationEditorField key={specialization.id}
                                specialization={specialization} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}