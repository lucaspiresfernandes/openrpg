import Prisma from '@prisma/client';
import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import useExtendedState from '../../hooks/useExtendedState';
import { errorLogger } from '../../pages/sheet/1';
import api from '../../utils/api';

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
        api.post('/sheet/player/spec', { specID, value }).catch(logError);
    }

    return (
        <Col xs={12} sm={6} lg={4} className='text-center my-3'>
            <Row>
                <Col>
                    <input className='theme-element bottom-text w-100 text-center h5' type='text'
                        id={`spec${specID}`} autoComplete='off' value={value}
                        onChange={ev => setValue(ev.currentTarget.value)} onBlur={onValueBlur} />
                </Col>
            </Row>
            <Row>
                <Col><label htmlFor={`spec${specID}`}>{playerSpec.Spec.name}</label></Col>
            </Row>
        </Col>
    );
}