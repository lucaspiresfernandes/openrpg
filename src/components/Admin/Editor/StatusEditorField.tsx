import { Attribute, AttributeStatus } from '@prisma/client';
import { ChangeEvent, useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { ErrorLogger } from '../../../contexts';
import useExtendedState from '../../../hooks/useExtendedState';
import api from '../../../utils/api';
import BottomTextInput from '../../BottomTextInput';

type StatusEditorFieldProps = {
    attributeStatus: AttributeStatus;
    attributes: Attribute[];
    onDelete(id: number): void;
}

export default function StatusEditorField(props: StatusEditorFieldProps) {
    const [lastName, name, setName] = useExtendedState(props.attributeStatus.name);
    const [attributeID, setAttributeID] = useState(props.attributeStatus.attribute_id);
    const logError = useContext(ErrorLogger);

    function onBlur() {
        if (name === lastName) return;
        setName(name);
        api.post('/sheet/attribute/status', { id: props.attributeStatus.id, name }).catch(logError);
    }

    function attributeChange(ev: ChangeEvent<HTMLSelectElement>) {
        const newID = parseInt(ev.currentTarget.value);
        setAttributeID(newID);
        api.post('/sheet/attribute/status', { id: props.attributeStatus.id, attributeID: newID }).catch(err => {
            logError(err);
            setAttributeID(attributeID);
        });
    }

    return (
        <tr>
            <td style={{ width: 50 }}>
                <Button onClick={() => props.onDelete(props.attributeStatus.id)} size='sm' variant='dark'>
                    <BsTrash color='white' size={24} />
                </Button>
            </td>
            <td>
                <BottomTextInput value={name} onChange={ev => setName(ev.currentTarget.value)}
                    onBlur={onBlur} className='w-100' />
            </td>
            <td>
                <select className='theme-element' value={attributeID}
                    onChange={attributeChange}>
                    {props.attributes.map(attr => <option key={attr.id} value={attr.id}>{attr.name}</option>)}
                </select>
            </td>
        </tr>
    );
}