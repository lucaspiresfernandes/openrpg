import { Characteristic } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import CharacteristicEditorField from './CharacteristicEditorField';

type CharacteristicEditorProps = {
    characteristic: Characteristic[];
    onDelete(id: number): void;
}

export default function CharacteristicEditor(props: CharacteristicEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Testável</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.characteristic.map(char =>
                            <CharacteristicEditorField key={char.id} characteristic={char} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}