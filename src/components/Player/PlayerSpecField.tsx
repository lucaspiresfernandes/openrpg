import Prisma from '@prisma/client';
import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { errorLogger } from '../../pages/sheet/1';
import api from '../../utils/api';
import BottomTextInput from '../BottomTextInput';

type PlayerSpecFieldProps = {
    value: string;
    Spec: Prisma.Spec;
    onSpecChanged?(name: string, newValue: string): void;
}

export default function PlayerSpecField(playerSpec: PlayerSpecFieldProps) {
    const [lastValue, value, setValue] = useExtendedState(playerSpec.value);

    const logError = useContext(errorLogger);
    const specID = playerSpec.Spec.id;

    async function onValueBlur() {
        if (lastValue === value) return;
        if (playerSpec.onSpecChanged) playerSpec.onSpecChanged(playerSpec.Spec.name, value);
        setValue(value);
        api.post('/sheet/player/spec', { id: specID, value }).catch(logError);
    }

    return (
        <Col xs={12} sm={6} lg={4} className='text-center my-3'>
            <Row>
                <Col>
                    <BottomTextInput className='w-100 text-center h5' onBlur={onValueBlur}
                        id={`spec${specID}`} autoComplete='off' value={value}
                        onChange={ev => setValue(ev.currentTarget.value)} />
                </Col>
            </Row>
            <Row>
                <Col><label htmlFor={`spec${specID}`}>{playerSpec.Spec.name}</label></Col>
            </Row>
        </Col>
    );
}