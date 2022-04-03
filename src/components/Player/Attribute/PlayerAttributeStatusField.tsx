import { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';

type PlayerAttributeStatusFieldProps = {
    playerAttributeStatus: {
        value: boolean;
        AttributeStatus: {
            id: number;
            name: string;
            attribute_id: number;
        };
    };
    onStatusChanged?(id: number, newValue: boolean): void;
}

export default function PlayerAttributeStatusField({ playerAttributeStatus, onStatusChanged }: PlayerAttributeStatusFieldProps) {
    const id = playerAttributeStatus.AttributeStatus.id;
    const attrID = playerAttributeStatus.AttributeStatus.attribute_id;
    const name = playerAttributeStatus.AttributeStatus.name;
    const logError = useContext(ErrorLogger);
    const [checked, setChecked] = useState(playerAttributeStatus.value);

    function changeValue() {
        const value = !checked;
        setChecked(value);
        api.post('/sheet/player/attribute/status', { attrStatusID: id, value }).then(() => {
            if (onStatusChanged) onStatusChanged(id, value);
        }).catch(err => {
            logError(err);
            setChecked(checked);
        });
    }

    return <Form.Check inline type='checkbox' checked={checked} label={name}
        onChange={changeValue} id={`spec${id}${attrID}`} />;
}