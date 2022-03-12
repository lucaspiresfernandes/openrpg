import { ExtraInfo } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import ExtraInfoEditorField from './ExtraInfoEditorField';

type ExtraInfoEditorProps = {
    extraInfo: ExtraInfo[];
    onDelete(id: number): void;
}

export default function ExtraInfoEditor(props: ExtraInfoEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.extraInfo.map(info =>
                            <ExtraInfoEditorField key={info.id}
                                extraInfo={info} onDelete={props.onDelete} />
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}