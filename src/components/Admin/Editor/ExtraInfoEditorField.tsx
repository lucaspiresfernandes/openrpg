import { ExtraInfo } from '@prisma/client';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type ExtraInfoEditorFieldProps = {
    extraInfo: ExtraInfo;
    onDelete(id: number): void;
}

export default function ExtraInfoEditorField(props: ExtraInfoEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.extraInfo.name);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/extrainfo', { id: props.extraInfo.id, name }).catch(logError);
    }

    return (
        <tr>
            <td>
                <Button onClick={() => props.onDelete(props.extraInfo.id)} size='sm' variant='secondary'>
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