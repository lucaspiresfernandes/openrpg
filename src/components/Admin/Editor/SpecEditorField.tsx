import { Spec } from '@prisma/client';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type SpecEditorFieldProps = {
    spec: Spec;
    onDelete(id: number): void;
}

export default function SpecEditorField(props: SpecEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.spec.name);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/spec', { id: props.spec.id, name }).catch(logError);
    }

    return (
        <tr>
            <td >
                <Button onClick={() => props.onDelete(props.spec.id)} size='sm' variant='dark'>
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