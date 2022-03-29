import { Attribute } from '@prisma/client';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../../contexts';
import useExtendedState from '../../../../hooks/useExtendedState';
import api from '../../../../utils/api';
import BottomTextInput from '../../../BottomTextInput';

type AttributeEditorFieldProps = {
    attribute: Attribute;
    deleteDisabled?: boolean;
    onDelete(id: number): void;
    onNameChange?(id: number, newName: string): void;
}

export default function AttributeEditorField(props: AttributeEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.attribute.name);
    const [lastColor, color, setColor] = useExtendedState(`#${props.attribute.color}`);
    const [rollable, setRollable] = useState(props.attribute.rollable);
    const logError = useContext(ErrorLogger);

    function onNameBlur() {
        if (name === lastName) return;
        setName(name);
        if (props.onNameChange) props.onNameChange(props.attribute.id, name);
        api.post('/sheet/attribute', { id: props.attribute.id, name }).catch(logError);
    }

    function onColorBlur() {
        if (color === lastColor) return;
        setColor(color);
        api.post('/sheet/attribute', { id: props.attribute.id, color: color.substring(1) }).catch(logError);
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
                <Button onClick={() => props.onDelete(props.attribute.id)} size='sm'
                    variant='secondary' disabled={props.deleteDisabled}>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onNameBlur} />
            </td>
            <td>
                <FormControl type='color' value={color} onChange={ev => setColor(ev.currentTarget.value)}
                    onBlur={onColorBlur} className='theme-element' />
            </td>
            <td>
                <FormCheck checked={rollable} onChange={changeRollable} />
            </td>
        </tr>
    );
}