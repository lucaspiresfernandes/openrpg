import { Characteristic } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../../contexts';
import useExtendedState from '../../../../hooks/useExtendedState';
import api from '../../../../utils/api';
import BottomTextInput from '../../../BottomTextInput';

type CharacteristicEditorFieldProps = {
    characteristic: Characteristic;
    onDelete(id: number): void;
}

export default function CharacteristicEditorField(props: CharacteristicEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.characteristic.name);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/characteristic', { id: props.characteristic.id, name }).catch(logError);
    }

    return (
        <tr>
            <td>
                <Button onClick={() => props.onDelete(props.characteristic.id)} size='sm' variant='secondary'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onBlur} />
            </td>
        </tr>
    );
}