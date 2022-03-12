import { Characteristic } from '@prisma/client';
import { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type CharacteristicEditorFieldProps = {
    characteristic: Characteristic;
    onDelete(id: number): void;
}

export default function CharacteristicEditorField(props: CharacteristicEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.characteristic.name);
    const [rollable, setRollable] = useState(props.characteristic.rollable);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/characteristic', { id: props.characteristic.id, name }).catch(logError);
    }

    function changeRollable() {
        const newRollable = !rollable;
        setRollable(newRollable);
        api.post('/sheet/characteristic', { id: props.characteristic.id, rollable: newRollable }).catch(err => {
            setRollable(rollable);
            logError(err);
        });
    }

    return (
        <tr>
            <td style={{ width: 50 }}>
                <Button onClick={() => props.onDelete(props.characteristic.id)} size='sm' variant='dark'>
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