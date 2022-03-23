import { Attribute } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
            <td>
                <Button onClick={() => props.onDelete(props.attribute.id)} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onBlur} />
            </td>
            <td>
                <Form.Check checked={rollable} onChange={changeRollable} />
            </td>
        </tr>
    );
}