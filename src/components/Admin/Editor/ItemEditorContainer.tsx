import DataContainer from '../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ItemEditorField from './ItemEditorField';
import { useContext, useState } from 'react';
import { Item } from '@prisma/client';
import api from '../../../utils/api';
import { ErrorLogger } from '../../../contexts';
import CreateItemModal from '../../Modals/CreateItemModal';

type ItemEditorContainerProps = {
    item: Item[];
}

export default function ItemEditorContainer(props: ItemEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showItemModal, setShowItemModal] = useState(false);
    const [item, setItem] = useState(props.item);

    function createItem(name: string, description: string) {
        api.put('/sheet/item', { name, description }).then(res => {
            const id = res.data.id;
            setItem([...item, { id, name, description, weight: 0, visible: true }]);
        }).catch(logError);
    }

    function deleteItem(id: number) {
        if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
        api.delete('/sheet/item', { data: { id } }).then(() => {
            const newItem = [...item];
            const index = newItem.findIndex(item => item.id === id);
            if (index > -1) {
                newItem.splice(index, 1);
                setItem(newItem);
            }
        }).catch(logError);
    }
    
    return (
        <>
            <DataContainer outline title='Itens'
                addButton={{ onAdd: () => setShowItemModal(true) }}>
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
                                {item.map(item =>
                                    <ItemEditorField key={item.id}
                                        item={item} onDelete={deleteItem} />
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </DataContainer>
            <CreateItemModal show={showItemModal} onHide={() => setShowItemModal(false)}
                onCreate={createItem} />
        </>
    );
}