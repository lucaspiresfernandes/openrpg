import DataContainer from '../../../DataContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminTable from '../../AdminTable';
import ItemEditorField from './ItemEditorField';
import { useContext, useState } from 'react';
import { Item } from '@prisma/client';
import api from '../../../../utils/api';
import { ErrorLogger } from '../../../../contexts';
import CreateItemModal from '../../../Modals/CreateItemModal';

type ItemEditorContainerProps = {
    items: Item[];
    title: string;
}

export default function ItemEditorContainer(props: ItemEditorContainerProps) {
    const logError = useContext(ErrorLogger);
    const [showItemModal, setShowItemModal] = useState(false);
    const [item, setItem] = useState(props.items);

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
            <DataContainer outline title={props.title}
                addButton={{ onAdd: () => setShowItemModal(true) }}>
                <Row>
                    <Col>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th title='Nome do Item.'>Nome</th>
                                    <th title='Descrição do Item.'>Descrição</th>
                                    <th title='Peso do Item.'>Peso</th>
                                    <th title='Define se o Item será visível para o jogador.'>Visível</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.map(item =>
                                    <ItemEditorField key={item.id}
                                        item={item} onDelete={deleteItem} />
                                )}
                            </tbody>
                        </AdminTable>
                    </Col>
                </Row>
            </DataContainer>
            <CreateItemModal show={showItemModal} onHide={() => setShowItemModal(false)}
                onCreate={createItem} />
        </>
    );
}