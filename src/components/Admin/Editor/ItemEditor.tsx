import { Item } from '@prisma/client';
import { Col, Row, Table } from 'react-bootstrap';
import ItemEditorField from './ItemEditorField';

type ItemEditorProps = {
    item: Item[];
    onDelete(id: number): void;
}

export default function ItemEditor(props: ItemEditorProps) {
    return (
        <Row>
            <Col>
                <Table responsive className='align-middle'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Visível</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.item.map(item => <ItemEditorField key={item.id} item={item} onDelete={props.onDelete} />)}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}