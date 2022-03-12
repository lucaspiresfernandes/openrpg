import { Info } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import InfoEditorField from './InfoEditorField';

type InfoEditorProps = {
    info: Info[];
    onDelete(id: number): void;
}

export default function InfoEditor(props: InfoEditorProps) {

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
                        {props.info.map(info =>
                            <InfoEditorField key={info.id}
                                info={info} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}