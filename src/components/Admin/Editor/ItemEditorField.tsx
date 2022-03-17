import { Item } from '@prisma/client';
import { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type ItemEditorFieldProps = {
    item: Item;
    onDelete(id: number): void;
}

export default function ItemEditorField(props: ItemEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.item.name);
    const [lastDescription, description, setDescription] = useExtendedState(props.item.description);
    const [visible, setVisible] = useState(props.item.visible);
    const logError = useContext(ErrorLogger);

    function onNameBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/item', { id: props.item.id, name }).catch(logError);
    }

    function onDescriptionBlur() {
        if (description === lastDescription) return;
        setDescription(description);
        api.post('/sheet/item', { id: props.item.id, description }).catch(logError);
    }

    function onVisibleChange() {
        const newVisible = !visible;
        setVisible(newVisible);
        api.post('/sheet/item', { id: props.item.id, visible: newVisible }).catch(err => {
            setVisible(visible);
            logError(err);
        });
    }

    return (
        <tr>
            <td>
                <Button onClick={() => props.onDelete(props.item.id)} size='sm' variant='dark'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onNameBlur} style={{ maxWidth: '15rem' }} />
            </td>
            <td>
                <BottomTextInput value={description} onChange={ev => setDescription(ev.currentTarget.value)}
                    onBlur={onDescriptionBlur} style={{ minWidth: '45rem' }} />
            </td>
            <td>
                <Form.Check checked={visible} onChange={onVisibleChange} />
            </td>
        </tr>
    );
}