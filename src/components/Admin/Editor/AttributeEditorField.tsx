import { Attribute } from '@prisma/client';
import { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type AttributeEditorFieldProps = {
    attribute: Attribute;
    onDelete(id: number): void;
}

export default function AttributeEditorField(props: AttributeEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.attribute.name);
    const [rollable, setRollable] = useState(props.attribute.rollable);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/attribute', { id: props.attribute.id, name }).catch(logError);
    }

    function changeRollable() {
        const newRollable = !rollable;
        setRollable(newRollable);
        api.post('/sheet/attribute', { id: props.attribute.id, rollable: newRollable }).catch(err => {
            setRollable(rollable);
            logError(err);
        });
    }

    return (
        <tr>
            <td style={{ width: 50 }}>
                <Button onClick={() => props.onDelete(props.attribute.id)} size='sm' variant='dark'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onBlur} className='w-100' />
            </td>
            <td>
                <Form.Check checked={rollable} onChange={changeRollable} />
            </td>
        </tr>
    );
}