import { Spec } from '@prisma/client';
import { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { ErrorLogger } from '../../contexts';
import useExtendedState from '../../hooks/useExtendedState';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerSpecFieldProps = {
    value: string;
    Spec: Spec;
    onSpecChanged?(name: string, newValue: string): void;
}

export default function PlayerSpecField(playerSpec: PlayerSpecFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerSpec.value);

    const logError = useContext(ErrorLogger);
    const specID = playerSpec.Spec.id;

    async function onValueBlur() {
        if (lastValue === value) return;
        if (playerSpec.onSpecChanged) playerSpec.onSpecChanged(playerSpec.Spec.name, value);
        setValue(value);
        api.post('/sheet/player/spec', { id: specID, value }).catch(logError);
    }

    return (
        <Col xs={12} sm={6} lg={4} className='text-center mb-2'>
            <FormGroup controlId={`spec${specID}`}>
                <BottomTextInput className='w-100 text-center h5' onBlur={onValueBlur}
                    id={`spec${specID}`} autoComplete='off' value={value}
                    onChange={ev => setValue(ev.currentTarget.value)} />
                <FormLabel>{playerSpec.Spec.name}</FormLabel>
            </FormGroup>
        </Col>
    );
}